import { Request } from "express";
import { Response } from "../typings/Response";

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
  const id = req.query.id;
  res.render("users/user", {
    locals: res.locals,
    page: {
      title: `CFrum User | ${res.locals.user?.username}`,
      sidebarId: "user",
    },
  })
}