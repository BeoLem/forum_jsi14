import { Request } from "express";
import { Response } from "../typings/Response";
import config from "config";
import { getHost } from "../utils/URL";

export const GetUserList = async (req: Request, res: Response) => {
  res.redirect("/")
};

export const GetSpecificUser = async(req: Request, res: Response) => {
  const id = req.params.id;
  res.render("users/user", {
    locals: res.locals,
    userId: id,
    page: {
      title: `CFrum User | ${id}`,
      sidebarId: "user",
    },
  });
}