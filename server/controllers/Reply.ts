import { Request } from "express";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { database } from "../app";
import { CReply } from "../documents/Reply";
import { Response } from "../typings/Response";
import { CommentConverter, ReplyConverter } from "../utils/Converters";
import { CreateRespond } from "../utils/Response";

export const CreateReply = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const description = req.body.description;
    let replyToType = req.body.replyToType;
    if (replyToType != "comment" && replyToType != "reply")
      return res
        .status(400)
        .send(
          CreateRespond(`You must reply to either "reply" or "comment".`, 400)
        );

    let collectionReplyToType =
      replyToType == "comment" ? "comments" : "replies";

    let docRef = doc(database, collectionReplyToType, id);
    if (replyToType == "comment")
      docRef = docRef.withConverter(CommentConverter);
    else docRef = docRef.withConverter(ReplyConverter);
    const replyToDocSnapshot = await getDoc(docRef);
    const replyToData = replyToDocSnapshot?.data() || null;
    if (!replyToData || !replyToDocSnapshot.exists())
      return res
        .status(404)
        .send(
          CreateRespond(
            `The target you are trying to reply to is not found!`,
            404
          )
        );

    let replyDocSnapshot = await addDoc(
      collection(database, "replies").withConverter(ReplyConverter),
      new CReply(
        id,
        replyToType,
        res.locals.user!.id,
        serverTimestamp(),
        description,
        [],
        []
      )
    );

    return res.send(
      CreateRespond("Successfully replied!", 200, {
        data: {
          id: replyDocSnapshot.id,
        },
      })
    );
  } catch (err) {
    return res.status(503).send(
      CreateRespond(`${err}`, 503, {
        error: err,
      })
    );
  }
};

export const EditReply = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    return res.status(503).send(
      CreateRespond(`${err}`, 503, {
        error: err,
      })
    );
  }
};
