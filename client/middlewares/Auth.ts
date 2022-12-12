import { NextFunction, Request } from "express";
import { Response } from "../typings/Response";
import config from "config";
import logger from "../utils/Logger";
import { JWTCheck } from "../utils/Checking";
import fetch from "node-fetch";
import { CUser } from "../documents/User";
import { CSession } from "../documents/Session";
import { getHost } from "../utils/URL";

export let AuthUser = (
  stopIfNotAuth: true | false = true,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies["accessToken"];
    if ((!token || !JWTCheck(token)) && stopIfNotAuth) {
      res.clearCookie("accessToken");
      return res.redirect(
        "/auth/login?notification=Please log in to continue"
      );
    }

    let userData: any;
    let requestAccessData: any;
    let accessSessionData: any;

    try {
      requestAccessData = await fetch(
        `${config.get("frontend.backend.path")}/sessions/@me`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
    } catch (err) {
      logger.error(err);
      return res.redirect("/auth/login?error=Couldn't verify your identity");
    }

    accessSessionData =
      (await requestAccessData.json()) ||
      JSON.parse(await requestAccessData.text());

    if (
      (!accessSessionData ||
        !`${accessSessionData.statusCode}`.startsWith("2") ||
        !accessSessionData)
    ) {
      if (req.cookies["refreshToken"]) {
        let newAccTokenRequest;

        try {
          newAccTokenRequest = await fetch(
            `${config.get("frontend.backend.path")}/sessions`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                refreshtoken: req.cookies["refreshToken"],
              },
            }
          );
        } catch (err) {
          logger.error(err);
          res.clearCookie("accessToken");
          return res.redirect("/auth/login?error=Couldn't verify your identity");
        }

        let newAccTokenData =
          (await newAccTokenRequest.json()) ||
          JSON.parse(await newAccTokenRequest.text());

        if (newAccTokenData.accessToken && newAccTokenData.userData) {
          token = newAccTokenData.accessToken;
          res.cookie("accessToken", newAccTokenData.accessToken);
          accessSessionData = {
            session: newAccTokenData.accessSessionData,
          };
          userData = newAccTokenData.userData;
          requestAccessData = newAccTokenRequest;
        } else {
          res.clearCookie("accessToken");
          if (stopIfNotAuth)
            return res.redirect(
              "/auth/login?notification=Your session is expired"
            );
        }
      } else {
        res.clearCookie("accessToken");
        if (stopIfNotAuth)
          return res.redirect(
            "/auth/login?notification=Your session is expired"
          );
      }
    }

    if (accessSessionData && accessSessionData.session) {
      if(accessSessionData.user && !userData) userData = accessSessionData.user,
      accessSessionData = accessSessionData.session
    }

    // if (userData) userData = userData.user;

    if (!userData?.id) userData = {};
    if (!accessSessionData?.id) accessSessionData = {};

    res.locals = {
      user: {
        ...new CUser(
          userData?.username,
          userData?.password,
          userData?.email,
          userData?.timestamp
        ),
        id: userData?.id,
      },
      session: {
        ...new CSession(
          accessSessionData?.user,
          accessSessionData?.type,
          accessSessionData?.timestamp,
          accessSessionData?.tokenParent,
          accessSessionData?.duration
        ),
        id: accessSessionData?.id,
      },
    };
    next();
  };
};
