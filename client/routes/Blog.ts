import express from "express";
import { AuthUser } from "../middlewares/Auth";
import {
  GetBlogListPage,
  GetCreateBlogPage,
  GetEditBlogPage,
  GetSpecificBlogPage,
} from "../controllers/Blog";

const router = express.Router();

/**
 * @route /blogs/create
 * @method get
 * @access public
 * @desc Get the create blog page
 */
router.get("/create", AuthUser(true), GetCreateBlogPage);

/**
 * @route /blogs/edit/:id
 * @method get
 * @access public
 * @desc Get the edit blog page
 */
router.get("/edit/:id", AuthUser(true), GetEditBlogPage);

/**
 * @route /blogs/:id
 * @method get
 * @access public
 * @desc Get specific blog page
 */
router.get("/:id", AuthUser(false), GetSpecificBlogPage);

/**
 * @route /blogs/
 * @method get
 * @access public
 * @desc Get the blog list page
 */
router.get("/", AuthUser(false), GetBlogListPage);

// /**
//  * @route /blogs/:id
//  * @method delete
//  * @access public
//  * @desc Delete a blog
//  */
// router.delete(
//     '/:id',
//     ValidateHeader([
//         {
//             name: 'authorization',
//             type: 'string',
//             required: true,
//         },
//     ]),
//     AuthUser(true),
//     DeleteBlog
// )

// /**
//  * @route /blogs/@list
//  * @method get
//  * @access public
//  * @desc Get blog list
//  */
// router.get('/@list', GetBlogList)

// /**
//  * @route /blogs/:id
//  * @method get
//  * @access public
//  * @desc Get a blog
//  */
// router.get('/:id', GetSpecificBlog)

export = router;
