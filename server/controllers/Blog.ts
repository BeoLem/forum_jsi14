import c from "config";
import { Request } from "express";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
  QueryConstraint,
  updateDoc,
} from "firebase/firestore";
import { database } from "../app";
import { Category } from "../configurations/Category";
import { CBlog } from "../documents/Blog";
import { Response } from "../typings/Response";
import { BlogConverter } from "../utils/Converters";
import { CreateRespond } from "../utils/Response";

export const CreateBlog = async (req: Request, res: Response) => {
  const title = req.body.title;
  const description = req.body.description;
  let category = req.body.category;

  const author = res.locals.user;

  if (!Category[category]) category = Category[3];

  const docRef = await addDoc(
    collection(database, "blogs").withConverter(BlogConverter),
    new CBlog(
      author?.id || "Unknown",
      title,
      serverTimestamp(),
      description,
      category
    )
  );

  res.send(
    CreateRespond("Blog created", 200, {
      id: docRef.id,
    })
  );
};

export const EditBlog = async (req: Request, res: Response) => {
  const title = req.body.title;
  const description = req.body.description;
  let category = req.body.category;
  const author = res.locals.user;
  const blogId = req.params.id;

  const blogDocRef = doc(database, "blogs", blogId).withConverter(
    BlogConverter
  );

  const blog = (await getDoc(blogDocRef))?.data() || null;
  if (!blog)
    return res
      .status(404)
      .send(CreateRespond("Can't find a blog with this ID", 404));
  if (blog.author != author?.id)
    return res
      .status(401)
      .send(CreateRespond("You are not the author of this blog", 401));

  if (!Category[category]) category = Category[3];

  let updated = {
    title: title || blog.title,
    description: description || blog.description,
  };

  await updateDoc(blogDocRef, updated);

  res.send(
    CreateRespond("Blog edited", 200, {
      id: blogId,
    })
  );
};

export const DeleteBlog = async (req: Request, res: Response) => {
  const id = req.params.id;
  const blogDocRef = doc(database, "blogs", id).withConverter(BlogConverter);
  const blogSnapshot = await getDoc(blogDocRef);

  if (!blogSnapshot || !blogSnapshot.exists())
    return res.status(404).send(CreateRespond("Blog not found", 404));

  const blog = blogSnapshot.data();
  if (blog.author != res.locals.user!.id)
    return res
      .status(401)
      .send(CreateRespond("User is not allowed to delete this blog", 401));

  await deleteDoc(blogDocRef);

  res.send(CreateRespond("Blog deleted", 200));
};

export const GetBlogList = async (req: Request, res: Response) => {
  const queries = req.query;

  const ref = collection(database, "blogs").withConverter(BlogConverter);

  const range =
    (queries.range && typeof queries.range == "string") ? queries.range : "1-10";

  let maxRange = parseInt(range.split("-")[1]);
  let minRange = parseInt(range.split("-")[0]);

  if (minRange == 0) minRange = 1;
  if (maxRange == 0) maxRange = 10;

  const queryArguments: QueryConstraint[] = [
    orderBy("timestamp", "desc"),
    limit(maxRange),
  ];
  if (queries.author) {
    queryArguments.push(where("author", "==", queries.author));
  }

  const docs = await getDocs(query(ref, ...queryArguments));

  let blogs: (CBlog & { id: string })[] = [];
  docs.forEach((snapshot) => {
    const data = snapshot.data();
    blogs.push({
      ...data,
      id: snapshot.id,
    });
  });

  blogs = blogs.slice(minRange - 1, maxRange);

  res.status(200).send(
    CreateRespond("Successfully", 200, {
      data: blogs,
    })
  );
};

export const GetSpecificBlog = async (req: Request, res: Response) => {
  const id = req.params.id;
  const blogSnapshot = await getDoc(
    doc(database, "blogs", id).withConverter(BlogConverter)
  );

  const blog = blogSnapshot?.data() || null;
  if (!blog || !blogSnapshot.exists())
    return res.status(404).send(CreateRespond("Blog not found", 404));
  return res.status(200).send(
    CreateRespond("Successfully", 200, {
      data: {
        ...blog,
        id: blogSnapshot.id,
      },
    })
  );
};
