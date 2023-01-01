import { Request } from "express";
import { Response } from "../typings/Response";

export const GetHomePage = async (req: Request, res: Response) => {
  res.render("web/root", {
    locals: res.locals,
    page: {
      title: "CFrum | Home",
      sidebarId: "home",
    },
  });
};

export const GetAboutUsPage = async (req: Request, res: Response) => {
  res.render("web/about", {
    locals: res.locals,
    page: {
      title: "CFrum | About Us",
      sidebarId: "about",
    },
  });
};

export const GetErrorPage = async (req: Request, res: Response) => {
  res.render("web/error", {
    page: {
      status: req.query.status || "404",
      message: req.query.message || "Not Found",
      title: req.query.title || 'CFrum | Not Found',
      color: req.query.color || "red",
      redirect: req.query.redirect || "/"
    },
  });
}