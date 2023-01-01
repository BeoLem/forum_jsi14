import { Request } from "express";
import { Response } from "../typings/Response";
import config from "config";
import { getHost } from "../utils/URL";

export const GetUserList = async (req: Request, res: Response) => {
  res.render("users/list", {
    locals: res.locals,
    page: {
      title: "CFrum | Users",
      sidebarId: "user",
    },
  });
};

export const GetSpecificUser = async(req: Request, res: Response) => {
  const id = req.params.id;
  res.render("users/user", {
    locals: res.locals,
    userId: id,
    page: {
      title: `CFrum User | ${id}`,
      sidebarId: "user",
      userURLFetch: `${config.get("frontend.backend.path")}/users/${id}`,
    },
  });
}