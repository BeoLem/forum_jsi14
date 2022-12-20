import express from 'express'
import { AuthUser } from "../middlewares/Auth";
import { GetCreateBlogPage } from '../controllers/Blog';

const router = express.Router()

/**
 * @route /blogs/create
 * @method get
 * @access public
 * @desc Get the create blog page
 */
router.get("/create", AuthUser(true), GetCreateBlogPage);

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

export = router
