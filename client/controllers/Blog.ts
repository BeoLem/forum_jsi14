import { Request } from "express";
import { Response } from "../typings/Response";

export const GetCreateBlogPage = async (req: Request, res: Response) => {
  res.render("blogs/create", {
    params: req.params,
    cookies: req.cookies,
    locals: res.locals || {},
    page: {
      title: "CFrum | Create a blog",
    },
  });
};

export const GetEditBlogPage = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) return res.redirect("/");

  res.render("blogs/edit", {
    params: req.params,
    blogId: id,
    cookies: req.cookies,
    locals: res.locals || {},
    page: {
      title: "CFrum | Edit this blog",
    },
  });
};

export const GetSpecificBlogPage = async (req: Request, res: Response) => {
  res.render("blogs/blog", {
    params: req.params,
    blogId: req.query.id,
    cookies: req.cookies,
    locals: res.locals || {},
    page: {
      title: "CFrum | View a blog",
      sidebarId: "blog",
    },
  });
};

export const GetBlogListPage = async (req: Request, res: Response) => {
  res.redirect("/")
};
