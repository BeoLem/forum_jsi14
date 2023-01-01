import express from "express";
import { CreateReply } from "../controllers/Reply";
import { AuthUser } from "../middlewares/Auth";
import { ValidateBody, ValidateHeader } from "../middlewares/Validation";

const router = express.Router();

/**
 * @route /replies/:id
 * @method post
 * @access private
 * @desc Create a reply
 */
router.post(
  "/:id",
  ValidateHeader([
    {
      name: "authorization",
      type: "string",
      required: true,
    },
  ]),
  ValidateBody([
    {
      name: "replyToType",
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
  CreateReply
);

export = router;
