import { CUser } from "../documents/User";
import { DocumentSnapshot, FieldValue } from "firebase/firestore";
import { CSession } from "../documents/Session";
import { CBlog } from "../documents/Blog";
import { CComment } from "../documents/Comment";
import { CReply } from "../documents/Reply";

export const UserConverter = {
  toFirestore: (user: CUser) => {
    return {
      username: user.username,
      password: user.password,
      email: user.email,
      timestamp: user.timestamp,
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: any) => {
    const data = snapshot.data(options);
    return new CUser(
      data?.username,
      data?.password,
      data?.email,
      data?.timestamp
    );
  },
};

export const SessionConverter = {
  toFirestore: (session: CSession) => {
    return {
      user: session?.user,
      type: session?.type,
      timestamp: session?.timestamp,
      tokenParent: session?.tokenParent,
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: any) => {
    const data = snapshot.data(options);
    return new CSession(
      data?.user,
      data?.type,
      data?.timestamp,
      data?.tokenParent
    );
  },
};

export const BlogConverter = {
  toFirestore: (blog: CBlog) => {
    return {
      author: blog.author,
      title: blog.title,
      timestamp: blog.timestamp,
      description: blog.description,
      category: blog.category,
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: any) => {
    const data = snapshot.data(options);
    return new CBlog(
      data?.author,
      data?.title,
      data?.timestamp,
      data?.description,
      data?.category
    );
  },
};

export const CommentConverter = {
  toFirestore: (comment: CComment) => {
    return {
      commenter: comment.commenter,
      timestamp: comment.timestamp,
      description: comment.description,
      blog: comment.blog,
      likes: comment.likes,
      dislikes: comment.dislikes,
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: any) => {
    const data = snapshot.data(options);
    // let replies: CReply[] = [];
    // data?.replies.map((v: CReply) =>
    //   replies.push(
    //     new CReply(
    //       v.replier,
    //       v.timestamp,
    //       v.description,
    //       v.likes,
    //       v.dislikes,
    //       v.replies
    //     )
    //   )
    // );
    return new CComment(
      data?.commenter,
      data?.timestamp,
      data?.description,
      data?.blog,
      data?.likes,
      data?.dislikes
      // replies
    );
  },
};

export const ReplyConverter = {
  toFirestore: (reply: CReply) => {
    return {
      replyTo: reply.replyTo,
      replyToType: reply.replyToType,
      replier: reply.replier,
      timestamp: reply.timestamp,
      description: reply.description,
      likes: reply.likes,
      dislikes: reply.dislikes,
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: any) => {
    const data = snapshot.data(options);
    return new CReply(
      data?.replyTo,
      data?.replyToType,
      data?.replier,
      data?.timestamp,
      data?.description,
      data?.likes,
      data?.dislikes
    );
  },
};

export const TimestampConverter = (timestamp: FieldValue | string): Date => {
  // (seconds=x, nanoseconds = y)
  timestamp = `${timestamp}`;
  const seconds = timestamp.slice(
    timestamp.indexOf(`(seconds=`) + 9,
    timestamp.indexOf(`, nanoseconds`)
  );
  const date = new Date(0);
  date.setUTCSeconds(parseInt(seconds));
  return date;
  // CONVERT FROM UTC TIME TO LOCAL TIME
};
