import express from "express";
import { CreateComment, DeleteComment, EditComment, GetCommentList, GetSpecificComment } from "../controllers/Comment";
import { AuthUser } from "../middlewares/Auth";
import { ValidateBody, ValidateHeader } from "../middlewares/Validation";

const router = express.Router();

/**
 * @route /comments/
 * @method post
 * @access private
 * @desc Create a comment
 */
router.post(
  "/",
  ValidateHeader([
    {
      name: "authorization",
      type: "string",
      required: true,
    },
  ]),
  ValidateBody([
    {
      name: "id",
      type: "string",
      required: true,
    },
    {
      name: "description",
      type: "string",
      required: true,
    },
  ]),
  AuthUser(true),
  CreateComment
);

/**
 * @route /comments/
 * @method delete
 * @access private
 * @desc Delete a comment
 */
router.delete(
  "/",
  ValidateHeader([
    {
      name: "authorization",
      type: "string",
      required: true,
    },
  ]),
  ValidateBody([
    {
      name: "id",
      type: "string",
      required: true,
    },
  ]),
  AuthUser(true),
  DeleteComment
);

/**
 * @route /comments/
 * @method patch
 * @access private
 * @desc Edit a comment
 */
router.patch(
  "/",
  ValidateHeader([
    {
      name: "authorization",
      type: "string",
      required: true,
    },
  ]),
  ValidateBody([
    {
      name: "id",
      type: "string",
      required: true,
    },
    {
      name: "description",
      type: "string",
      required: true,
    },
  ]),
  AuthUser(true),
  EditComment
);

/**
 * @route /comments/:id/@list
 * @method get
 * @access public
 * @desc Get comment list
 */
router.get(
  "/:id/@list", GetCommentList
);

/**
 * @route /comments/:id
 * @method get
 * @access public
 * @desc Get a comment
 */
router.get("/:id", GetSpecificComment);

export = router;
