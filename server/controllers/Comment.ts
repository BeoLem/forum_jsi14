import e, { Request } from "express";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  QueryConstraint,
  serverTimestamp,
  updateDoc,
  where,
  query,
} from "firebase/firestore";
import { database } from "../app";
import { CComment } from "../documents/Comment";
import { CReply } from "../documents/Reply";
import { Response } from "../typings/Response";
import {
  BlogConverter,
  CommentConverter,
  ReplyConverter,
} from "../utils/Converters";
import { CreateRespond } from "../utils/Response";

export const CreateComment = async (req: Request, res: Response) => {
  try {
    const blogId = req.body.id;
    const description = req.body.description;

    const blog =
      (
        await getDoc(
          doc(database, "blogs", blogId).withConverter(BlogConverter)
        )
      )?.data() || null;
    if (!blog || !blog.author)
      return res.status(404).send(CreateRespond("Blog not found", 404));

    const commentRef = await addDoc(
      collection(database, "comments").withConverter(CommentConverter),
      new CComment(
        res.locals.user?.id || "Unknown",
        serverTimestamp(),
        description,
        blogId,
        [],
        []
      )
    );

    const commentData =
      (
        await getDoc(
          doc(database, "comments", commentRef.id).withConverter(
            CommentConverter
          )
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
  } catch (err) {
    return res.status(503).send(
      CreateRespond(`${err}`, 503, {
        error: err,
      })
    );
  }
};

export const DeleteComment = async (req: Request, res: Response) => {
  try {
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
  } catch (err) {
    return res.status(503).send(
      CreateRespond(`${err}`, 503, {
        error: err,
      })
    );
  }
};

export const EditComment = async (req: Request, res: Response) => {
  try {
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
      description,
    });

    commentData =
      (
        await getDoc(
          doc(database, "comments", commentRef.id).withConverter(
            CommentConverter
          )
        )
      ).data() || null;

    return res.send(
      CreateRespond("Comment updated", 200, {
        data: commentData
          ? {
              ...commentData,
              id: commentId,
            }
          : null,
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

export const GetCommentList = async (req: Request, res: Response) => {
  try {
    const blogId = req.body.blogId;

    const blog =
      (
        await getDoc(
          doc(database, "blogs", blogId).withConverter(BlogConverter)
        )
      )?.data() || null;
    if (!blog || !blog.author)
      return res.status(404).send(CreateRespond("Blog not found", 404));

    const queries = req.query;

    const ref = collection(database, "comments").withConverter(
      CommentConverter
    );

    const range =
      queries.range && typeof queries.range == "string"
        ? queries.range
        : "1-10";

    let maxRange = parseInt(range.split("-")[1]);
    let minRange = parseInt(range.split("-")[0]);

    if (minRange == 0) minRange = 1;
    if (maxRange == 0) maxRange = 10;

    const queryArguments: QueryConstraint[] = [
      where("blog", "==", blogId),
      orderBy("timestamp", "desc"),
      limit(maxRange),
    ];
    if (queries.commenter) {
      queryArguments.push(where("commenter", "==", queries.commenter));
    }

    const docs = await getDocs(query(ref, ...queryArguments));

    let comments: (CComment & { id: string })[] = [];
    docs.forEach((snapshot) => {
      const data = snapshot.data();
      comments.push({
        ...data,
        id: snapshot.id,
      });
    });

    comments = comments.slice(minRange - 1, maxRange);

    res.status(200).send(
      CreateRespond("Successfully", 200, {
        data: comments,
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

export const GetSpecificComment = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const commentSnapshot = await getDoc(
      doc(database, "comments", id).withConverter(BlogConverter)
    );

    const comment = commentSnapshot?.data() || null;
    if (!comment || !commentSnapshot.exists())
      return res.status(404).send(CreateRespond("Comment not found", 404));
    return res.status(200).send(
      CreateRespond("Successfully", 200, {
        data: {
          ...comment,
          id: commentSnapshot.id,
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
