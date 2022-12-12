import { Request } from 'express'
import { Response } from '../typings/Response'
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    where,
} from 'firebase/firestore'
import { database } from '../app'
import { CUser } from '../documents/User'
import { HashPassword } from '../utils/User'
import {
    SessionConverter,
    TimestampConverter,
    UserConverter,
} from '../utils/Converters'
import { CreateRespond } from '../utils/Response'
import config from 'config'

export const CreateUser = async (req: Request, res: Response) => {
    const username = (req.body!.username as string).toLowerCase()
    const email = (req.body!.email as string).toLowerCase()
    const password = req.body!.password as string

    const ref = collection(database, 'users').withConverter(UserConverter)

    const userQuerySnapshots = await getDocs(
        query(ref, where('username', '==', username))
    )

    if (!userQuerySnapshots.empty)
        return res
            .status(409)
            .send(CreateRespond('User already found in the database', 409))

    const hashedPassword = HashPassword(password)

    const docRef = await addDoc(
        ref,
        new CUser(username, hashedPassword, email, serverTimestamp())
    )

    res.send(
        CreateRespond('Account created', 200, {
            id: docRef.id,
        })
    )
}

export const GetUser = async (req: Request, res: Response) => {
    let idOrName = req.params.idOrName as string
    if (idOrName == '@me') idOrName = res.locals?.user?.id || ''

    if (!idOrName)
        return res
            .status(400)
            .send(
                CreateRespond('User is not logged in to use @me feature', 401)
            )

    const userDoc = await getDoc(
        doc(database, 'users', idOrName).withConverter(UserConverter)
    )

    let userData = userDoc?.data() || undefined

    let user = {
        ...userData,
        id: userDoc?.id || undefined,
    }

    if (!user || !userData) {
        idOrName = idOrName.toLowerCase()
        const docs = await getDocs(
            query(
                collection(database, 'users'),
                where('username', '==', idOrName)
            )
        )
        user = {
            ...(docs.docs[0]?.data() as CUser),
            id: docs.docs[0]?.id,
        }
    }

    if (user?.password) user.password = ''

    return res.send(
        CreateRespond(null, 200, {
            user,
        })
    )
}

export const DeleteUser = async (req: Request, res: Response) => {
    const { user } = res.locals
    const sessions = await getDocs(
        query(collection(database, 'sessions'), where('user', '==', user?.id))
    )

    if (sessions && !sessions.empty) {
        await Promise.all(
            sessions.docs.map(async (val) => {
                const docRef = doc(database, 'sessions', val.id).withConverter(
                    SessionConverter
                )
                if (docRef) await deleteDoc(docRef)
                else;
                return null
            })
        )
    } else;

    const userDocRef = doc(database, 'users', user!.id)
    await deleteDoc(userDocRef)

    res.send(CreateRespond('Account deleted', 200))
}
