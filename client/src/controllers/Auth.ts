import { Request } from "express";
import fetch from "node-fetch";
import { Response } from "../typings/Response";
import config from "config";

export const GetLoginPage = async (req: Request, res: Response) => {
  // if (res.locals.user?.id) return res.redirect('/auth/logout')
  res.render("auth/login", {
    query: req.query,
    locals: res.locals || {},
    page: {
      title: "CFrum | Login",
    },
  });
};

export const GetRegisterPage = async (req: Request, res: Response) => {
  // if (res.locals.user?.id) return res.redirect('/auth/logout')
  res.render("auth/register", {
    query: req.query,
    locals: res.locals || {},
    page: {
      title: "CFrum | Register",
    },
  });
};

export const LogOut = async (req: Request, res: Response) => {
  if (req.cookies["accessToken"]) {
    fetch(
      `${config.get("backend.type")}://${config.get(
        "backend.host"
      )}:${config.get("backend.port")}/sessions/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: req.cookies["accessToken"],
        },
      }
    ).catch(() => {});

    res.clearCookie("accessToken");
  } else;

  if (req.cookies["refreshToken"]) res.clearCookie("refreshToken");

  res.redirect("/");
};

export const LogTheUserIn = async (req: Request, res: Response) => {
  const oldAccessToken = req.cookies["accessToken"];

  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.redirect(
      "/auth/login?error=Please fill out all the required fields"
    );
  }

  let request;
  try {
    request = await fetch(
      `${config.get("backend.type")}://${config.get(
        "backend.host"
      )}:${config.get("backend.port")}/sessions/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );
  } catch (err) {
    return res.redirect(`/auth/login?error=Couldn't connect to the server`);
  }

  const data = (await request.json()) || JSON.parse(await request.text());
  if (
    data.refreshToken &&
    data.accessToken &&
    data.statusCode >= 200 &&
    data.statusCode < 300
  ) {
    res.cookie("refreshToken", data.refreshToken);
    res.cookie("accessToken", data.accessToken);
    res.redirect("/");

    if (oldAccessToken) {
      fetch(
        `${config.get("backend.type")}://${config.get(
          "backend.host"
        )}:${config.get("backend.port")}/sessions/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: oldAccessToken,
          },
        }
      ).catch(() => {});
    }
  } else {
    res.redirect(`/auth/login?error=${data.message || "Unknown"}`);
  }
};

export const CreateAnAccount = async (req: Request, res: Response) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.redirect(
      "/auth/register?error=Please fill out all the required fields"
    );
  }

  let request;
  try {
    request = await fetch(
      `${config.get("backend.type")}://${config.get(
        "backend.host"
      )}:${config.get("backend.port")}/users/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      }
    );
  } catch (err) {
    return res.redirect(`/auth/register?error=Couldn't connect to the server`);
  }

  const data = (await request.json()) || JSON.parse(await request.text());
  if (data.id && data.statusCode >= 200 && data.statusCode < 300) {
    res.redirect("/auth/login?notification=Please login with your new account");
  } else {
    res.redirect(`/auth/register?error=${data.message || "Unknown"}`);
  }
};
