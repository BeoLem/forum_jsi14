import { Request } from 'express'
import { Category } from '../configurations/Category'
import { Response } from '../typings/Response'
import { CreateRespond } from '../utils/Response'

export const GetCreateBlogPage = async (req: Request, res: Response) => {
  res.render("blogs/create", {
    query: req.query,
    cookies: req.cookies,
    locals: res.locals || {},
    page: {
      title: "CFrum | Create a blog",
    },
  });
};