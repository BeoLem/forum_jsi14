import { NextFunction, Request } from "express";
import { Response } from "../typings/Response";
import config from "config";
import logger from "../utils/Logger";
import { JWTCheck } from "../utils/Checking";
import fetch from "node-fetch";
import { CUser } from "../documents/User";
import { CSession } from "../documents/Session";

export let AuthUser = (
  stopIfNotAuth: true | false = true,
  dangerousAction: true | false = false
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies["accessToken"];
    if ((!token || !JWTCheck(token)) && stopIfNotAuth) {
      res.clearCookie("accessToken");
      return res.redirect(
        "/auth/login?error=You must be logged in to continue"
      );
    }

    let userRequest: any;
    let userData: any;
    let requestAccessData: any;
    let accessSessionData: any;

    try {
      requestAccessData = await fetch(
        `${config.get("backend.type")}://${config.get(
          "backend.host"
        )}:${config.get("backend.port")}/sessions/@me`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
    } catch (err) {
      logger.error(err);
      return res.redirect("/auth/login?error=Could not connect to the server");
    }

    accessSessionData =
      (await requestAccessData.json()) ||
      JSON.parse(await requestAccessData.text());

    if (
      (!accessSessionData ||
        !`${accessSessionData.statusCode}`.startsWith("2") ||
        !accessSessionData) &&
      stopIfNotAuth
    ) {
      if (req.cookies["refreshToken"]) {
        let newAccTokenRequest;

        try {
          newAccTokenRequest = await fetch(
            `${config.get("backend.type")}://${config.get(
              "backend.host"
            )}:${config.get("backend.port")}/sessions`,
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
          return res.redirect("/auth/login?error=Your session is expired");
        }

        let newAccTokenData =
          (await newAccTokenRequest.json()) ||
          JSON.parse(await newAccTokenRequest.text());

        if (newAccTokenData.accessToken && newAccTokenData.data) {
          token = newAccTokenData.accessToken;
          res.cookie("accessToken", newAccTokenData.accessToken);
          accessSessionData = {
            session: newAccTokenData.data,
          };
          requestAccessData = newAccTokenRequest;
        } else {
          res.clearCookie("accessToken");
          return res.redirect("/auth/login?error=Your session is expired");
        }
      } else {
        res.clearCookie("accessToken");
        return res.redirect("/auth/login?error=Your session is expired");
      }
    }

    if (accessSessionData) accessSessionData = accessSessionData.session;

    try {
      userRequest = await fetch(
        `${config.get("backend.type")}://${config.get(
          "backend.host"
        )}:${config.get("backend.port")}/users/@me`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
    } catch (err) {
      logger.error(err);
      return res.redirect("/auth/login?error=Could not connect to the server");
    }

    userData =
      (await userRequest.json()) || JSON.parse(await userRequest.text());

    if (
      (!userData || !`${userData.statusCode}`.startsWith("2") || !userData) &&
      stopIfNotAuth
    ) {
      res.clearCookie("accessToken");
      return res.redirect("/auth/login?error=Your session is expired");
    }

    if (userData) userData = userData.user;

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
