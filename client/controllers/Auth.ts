import { Request } from "express";
import fetch from "node-fetch";
import { Response } from "../typings/Response";
import config from "config";
import { getHost } from "../utils/URL";

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
      `${config.get("frontend.backend.path")}/sessions/`,
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
  
  console.log(``)
  console.log(`${config.get("frontend.backend.path")}/sessions/`)
  
  let request;
  try {
    request = await fetch(
      `${config.get("frontend.backend.path")}/sessions/`,
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
    return res.status(401).send({
      message: "Couldn't connect to the server",
      statusCode: 401,
    })
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
    res.status(200).send({
      message: "Logged in successfully",
      statusCode: 200,
    })

    if (oldAccessToken) {
      fetch(
        `${config.get("frontend.backend.path")}/sessions/`,
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
    res.status(401).send({
      message: `${data.message}`,
      statusCode: 401,
    })
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
      `${config.get("frontend.backend.path")}/users/`,
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
    return res.status(401).send({
      message: "Couldn't connect to the server",
      statusCode: 401,
    })
  }

  const data = (await request.json()) || JSON.parse(await request.text());
  if (data.id && data.statusCode >= 200 && data.statusCode < 300) {
    res.status(200).send({
      message: "Account created successfully",
      statusCode: 200,
    })
  } else {
    res.status(401).send({
      message: `${data.message}`,
      statusCode: 401,
    })
  }
};

