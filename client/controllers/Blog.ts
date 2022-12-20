import { Request } from 'express'
import { Category } from '../configurations/Category'
import { Response } from '../typings/Response'
import { CreateRespond } from '../utils/Response'

export const GetCreateBlogPage = async (req: Request, res: Response) => {
  // if (res.locals.user?.id) return res.redirect('/auth/logout')
  res.render("blogs/create", {
    query: req.query,
    locals: res.locals || {},
    page: {
      title: "CFrum | Create a blog",
    },
  });
};