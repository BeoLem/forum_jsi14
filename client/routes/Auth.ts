import express from 'express'
import {
    CreateAnAccount,
    GetLoginPage,
    GetRegisterPage,
    LogOut,
    LogTheUserIn,
} from '../controllers/Auth'
import { AuthUser } from '../middlewares/Auth'

const router = express.Router()

/**
 * @route /auth/login/
 * @method get
 * @access public
 * @desc Get the login page
 */
router.get('/login', GetLoginPage)

/**
 * @route /auth/login/
 * @method post
 * @access public
 * @desc Log the user in
 */
router.post('/login', LogTheUserIn)

/**
 * @route /auth/register/
 * @method get
 * @access public
 * @desc Get the register page
 */
router.get('/register', GetRegisterPage)

/**
 * @route /auth/register/
 * @method post
 * @access public
 * @desc Create a new account
 */
router.post('/register', CreateAnAccount)

/**
 * @route /auth/logout/
 * @method get
 * @access private
 * @desc Sign out & delete session
 */
router.get('/logout', AuthUser(true), LogOut)

export = router
