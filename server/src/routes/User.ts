import express from 'express'
import { CreateUser, DeleteUser, GetUser } from '../controllers/User'
import { AuthUser } from '../middlewares/Auth'
import { ValidateBody, ValidateHeader } from '../middlewares/Validation'

const router = express.Router()

/**
 * @route /users/
 * @method post
 * @access public
 * @desc Create a user (Register)
 */
router.post(
    '/',
    ValidateBody([
        {
            name: 'username',
            type: 'string',
            required: true,
        },
        {
            name: 'email',
            type: 'email',
            required: true,
        },
        {
            name: 'password',
            type: 'string',
            required: true,
        },
    ]),
    CreateUser
)

/**
 * @route /users/:idOrName
 * @method get
 * @access public
 * @desc Get a user
 */
router.get(
    '/:idOrName',
    ValidateHeader([
        {
            name: 'authorization',
            type: 'string',
            required: false,
        },
    ]),
    AuthUser(false),
    GetUser
)

/**
 * @route /users/
 * @method delete
 * @access private
 * @desc Delete the logged in account
 */
router.delete(
    '/',
    ValidateHeader([
        {
            name: 'authorization',
            type: 'string',
            required: true,
        },
    ]),
    AuthUser(true, true),
    DeleteUser
)

export = router
