import express from "express";
import { GetAboutUsPage, GetErrorPage, GetHomePage } from "../controllers/Root";
import { AuthUser } from "../middlewares/Auth";

const router = express.Router();

/**
 * @route /
 * @method get
 * @access public
 * @desc Home page
 */
router.get("/", AuthUser(false), GetHomePage);

/**
 * @route /about
 * @method get
 * @access public
 * @desc About Us page
 */
router.get("/about", AuthUser(false), GetAboutUsPage);

/**
 * @route /error?status=&message=&title=&color=&redirect=
 * @method get
 * @access public
 * @desc Error page
 */
router.get("/error", GetErrorPage);

export = router;
