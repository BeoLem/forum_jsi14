import { Request } from 'express'
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from 'firebase/firestore'
import { database } from '../app'
import { Response } from '../typings/Response'
import { SessionConverter, UserConverter } from '../utils/Converters'
import { CreateRespond } from '../utils/Response'
import { ComparePassword, GenerateToken, VerifyToken } from '../utils/Session'

export const CreateSession = async (req: Request, res: Response) => {
    try {
    const username = (req.body!.username as string).toLowerCase()
    const password = req.body!.password as string

    const ref = collection(database, 'users').withConverter(UserConverter)

    const userQuerySnapshots = await getDocs(
        query(ref, where('username', '==', username))
    )

    let userSnapshot
    if (userQuerySnapshots.empty) userSnapshot = null
    else userSnapshot = userQuerySnapshots.docs[0]

    const user = userSnapshot?.data() || null

    if (!userSnapshot || !user)
        return res.status(401).send(CreateRespond('User not found', 401, null))

    if (!ComparePassword(password, user.password))
        return res
            .status(401)
            .send(CreateRespond('Incorrect Password', 401, null))

    let refToken

    try {
        refToken = await GenerateToken(userSnapshot.id, 'refreshToken')
    } catch (err) {
        // logger.error(err)
        return res.status(401).send(CreateRespond(`${err}`, 401, null))
    }

    let accToken

    try {
        accToken = await GenerateToken(
            userSnapshot.id,
            'accessToken',
            refToken.session.id
        )
    } catch (err) {
        // logger.error(err)
        return res.status(401).send(CreateRespond(`${err}`, 401, null))
    }

    res.send(
        CreateRespond('Session created', 200, {
            refreshToken: refToken.token,
            accessToken: accToken.token,
        })
    )
    } catch (err) {
    return res.send(
      CreateRespond(`${err}`, 503, {
        error: err,
      })
    );
  }
}

export const GetCurrentSession = async (req: Request, res: Response) => {
    try {
    res.send(
        CreateRespond(null, 200, {
            session: res.locals.session || null,
            user: res.locals.user,
            refreshSession: res.locals.refreshSession,
        })
    )
    } catch (err) {
    return res.send(
      CreateRespond(`${err}`, 503, {
        error: err,
      })
    );
  }
}

export const DeleteSession = async (req: Request, res: Response) => {
    try {
    const accTokenDoc = doc(database, 'sessions', res.locals.session!.id)
    const refTokenDoc = doc(database, 'sessions', res.locals.refreshSession!.id)

    await deleteDoc(accTokenDoc)
    await deleteDoc(refTokenDoc)

    res.send(CreateRespond('Session deleted', 200))
    } catch (err) {
    return res.send(
      CreateRespond(`${err}`, 503, {
        error: err,
      })
    );
  }
}

// export const DeleteAllSessions = async (req: Request, res: Response) => {}

export const RegenerateAccessToken = async (req: Request, res: Response) => {
    try {
      const refToken = req.headers["refreshtoken"];
      if (!refToken || typeof refToken != "string")
        return res
          .status(400)
          .send(CreateRespond("Refresh Token field is not provided", 400));

      let refData;

      try {
        refData = await VerifyToken(refToken);
      } catch (err) {
        return res.status(401).send(CreateRespond(`Invalid token`, 401));
      }

      if (!refData || !refData.user || !refData.session)
        return res.status(401).send(CreateRespond(`Invalid token`, 401));

      let accRefs = await getDocs(
        query(
          collection(database, "sessions"),
          where("user", "==", refData?.user.id || ""),
          where("type", "==", "accessToken"),
          where("tokenParent", "==", refData?.session?.id || "")
        )
      );

      if (!accRefs.empty) {
        await Promise.all(
          accRefs.docs.map(async (snapshot) => {
            await deleteDoc(doc(database, "sessions", snapshot.id));
          })
        );
      }

      let accToken;

      try {
        accToken = await GenerateToken(
          refData?.user.id || "",
          "accessToken",
          refData?.session!.id || ""
        );
      } catch (err) {
        return res.status(401).send(CreateRespond(`${err}`, 401));
      }

      let newAccDoc = await getDoc(
        doc(database, "sessions", accToken.session.id).withConverter(
          SessionConverter
        )
      );
      let newAccData = newAccDoc?.data() || null;
      let userDoc = await getDoc(
        doc(database, "users", newAccData?.user || "").withConverter(
          UserConverter
        )
      );
      let userData = userDoc?.data() || null;

      res.send(
        CreateRespond("Successfully", 200, {
          accessToken: accToken?.token,
          accessSessionData: {
            ...newAccData,
            id: newAccDoc.id,
          },
          userData: {
            ...userData,
            id: userDoc.id,
          },
        })
      );
    } catch (err) {
      return res.send(
        CreateRespond(`${err}`, 503, {
          error: err,
        })
      );
    }
}
