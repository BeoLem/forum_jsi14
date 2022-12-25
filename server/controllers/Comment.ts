import { Request } from "express";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { database } from "../app";
import { CComment } from "../documents/Comment";
import { Response } from "../typings/Response";
import { BlogConverter, CommentConverter } from "../utils/Converters";
import { CreateRespond } from "../utils/Response";

export const CreateComment = async (req: Request, res: Response) => {
  const blogId = req.body.id;
  const description = req.body.description;

  const blog =
    (
      await getDoc(doc(database, "blogs", blogId).withConverter(BlogConverter))
    )?.data() || null;
  if (!blog || !blog.author)
    return res.status(404).send(CreateRespond("Blog not found", 404));

  const commentRef = await addDoc(
    collection(database, "comments").withConverter(CommentConverter),
    new CComment(
      res.locals.user?.id || "Unknown",
      serverTimestamp(),
      description,
      blogId
    )
  );

  const commentData =
    (
      await getDoc(
        doc(database, "comments", commentRef.id).withConverter(CommentConverter)
      )
    ).data() || null;

  return res.send(
    CreateRespond("Comment created", 200, {
      data: commentData
        ? {
            id: commentRef.id,
            ...commentData,
          }
        : null,
    })
  );
};

export const DeleteComment = async (req: Request, res: Response) => {
  const commentId = req.body.id;

  const commentRef = doc(database, "comments", commentId).withConverter(
    CommentConverter
  );

  const commentData = (await getDoc(commentRef))?.data() || null;

  if (!commentData)
    return res.status(404).send(CreateRespond("Comment not found", 404));

  if (commentData.commenter != res.locals.user?.id)
    return res
      .status(401)
      .send(CreateRespond("You are not allowed to delete this comment", 401));

  await deleteDoc(commentRef);

  return res.send(CreateRespond("Comment deleted", 200));
};

export const EditComment = async (req: Request, res: Response) => {
  const commentId = req.body.id;
  const description = req.body.description;

  const commentRef = doc(database, "comments", commentId).withConverter(
    CommentConverter
  );

  let commentData = (await getDoc(commentRef))?.data() || null;

  if (!commentData)
    return res.status(404).send(CreateRespond("Comment not found", 404));

  if (commentData.commenter != res.locals.user?.id)
    return res
      .status(401)
      .send(CreateRespond("You are not allowed to delete this comment", 401));

    await updateDoc(commentRef, {
        description
    })

    commentData =
      (
        await getDoc(
          doc(database, "comments", commentRef.id).withConverter(
            CommentConverter
          )
        )
      ).data() || null;

  return res.send(CreateRespond("Comment updated", 200, {
    data: commentData ? {
        ...commentData,
        id: commentId
    } : null
  }));
};
