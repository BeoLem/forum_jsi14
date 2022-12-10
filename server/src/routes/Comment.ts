import express from 'express'
import {
    CreateBlog,
    DeleteBlog,
    GetBlogList,
    GetSpecificBlog,
} from '../controllers/Blog'
import { AuthUser } from '../middlewares/Auth'
import { ValidateBody, ValidateHeader } from '../middlewares/Validation'

const router = express.Router()

/**
 * @route /comments/
 * @method post
 * @access public
 * @desc Create a comment
 */
router.post(
    '/',
    ValidateHeader([
        {
            name: 'authorization',
            type: 'string',
            required: true,
        },
    ]),
    ValidateBody([
        {
            name: 'title',
            type: 'string',
            required: true,
        },
        {
            name: 'description',
            type: 'string',
            required: true,
        },
        {
            name: 'category',
            type: 'string',
            required: true,
        },
    ]),
    AuthUser(true),
    CreateBlog
)

/**
 * @route /comments/:id
 * @method delete
 * @access public
 * @desc Delete a comment
 */
router.delete(
    '/:id',
    ValidateHeader([
        {
            name: 'authorization',
            type: 'string',
            required: true,
        },
    ]),
    AuthUser(true),
    DeleteBlog
)

/**
 * @route /comments/@list
 * @method get
 * @access public
 * @desc Get comment list
 */
router.get('/@list', GetBlogList)

/**
 * @route /comments/:id
 * @method get
 * @access public
 * @desc Get a comment
 */
router.get('/:id', GetSpecificBlog)

export = router
