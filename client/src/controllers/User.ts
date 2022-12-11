import { Request } from "express";
import { Response } from "../typings/Response";
import config from "config";


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
      title: `CFrum User | ${res.locals.user?.username}`,
      sidebarId: "user",
      userURLFetch: `${config.get("backend.type")}://${config.get(
        "backend.host"
      )}:${config.get("backend.port")}/users/${id}`,
    },
  });
}