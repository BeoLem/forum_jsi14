import express from 'express'
import {
    CreateSession,
    DeleteSession,
    GetCurrentSession,
    RegenerateAccessToken,
} from '../controllers/Session'
import { AuthUser } from '../middlewares/Auth'
import { ValidateBody, ValidateHeader } from '../middlewares/Validation'

const router = express.Router()

/**
 * @route /sessions/
 * @method post
 * @access public
 * @desc Create a session (login)
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
            name: 'password',
            type: 'string',
            required: true,
        },
    ]),
    CreateSession
)

/**
 * @route /sessions/@me
 * @method get
 * @access public
 * @desc Get the current session
 */
router.get(
    '/@me',
    ValidateHeader([
        {
            name: 'authorization',
            type: 'string',
            required: false,
        },
    ]),
    AuthUser(true),
    GetCurrentSession
)

/**
 * @route /sessions/
 * @method delete
 * @access public
 * @desc Delete a session (logout)
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
    AuthUser(true),
    DeleteSession
)

/**
 * @route /sessions/
 * @method patch
 * @access public
 * @desc Regenerate the access token
 */
router.patch(
    '/',
    ValidateHeader([
        {
            name: 'refreshToken',
            type: 'string',
            required: true,
        },
    ]),
    RegenerateAccessToken
)

export = router
