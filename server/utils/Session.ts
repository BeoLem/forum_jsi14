import config from 'config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    serverTimestamp,
} from 'firebase/firestore'
import { database } from '../app'
import {
    SessionConverter,
    TimestampConverter,
    UserConverter,
} from './Converters'
import { CUser } from '../documents/User'
import { CSession } from '../documents/Session'
import ms from 'ms'
import {
    TResponseLocalsSession,
    TResponseLocalsUser,
} from '../typings/Response'

const salt = parseInt(config.get('backend.bcrypt.salt'))
const jwtToken = config.get('backend.auth.jwt') as string

interface SessionPayload {
    id: string
}

export const VerifyToken = async (token: string) => {
    const payload = jwt.verify(token, jwtToken) as SessionPayload
    if (!payload) throw new Error('Invalid token')

    const tokenDoc = doc(database, 'sessions', payload.id).withConverter(
        SessionConverter
    )

    const sessionSnapshot = await getDoc(tokenDoc)
    const session = sessionSnapshot?.data() || null
    if (!session) throw new Error('Invalid session')

    if (
        TimestampConverter(session.timestamp).getTime() + session.duration <=
        Date.now()
    ) {
        await deleteDoc(tokenDoc)
        throw new Error('Session expired')
    }

    const userDoc = doc(database, 'users', session.user).withConverter(
        UserConverter
    )

    const userSnapshot = await getDoc(userDoc)
    const user = userSnapshot?.data() || null

    if (!user) {
        await deleteDoc(tokenDoc)
        throw new Error('User not found with this session')
    }

    let returnObj: {
        user: TResponseLocalsUser
        session: TResponseLocalsSession
        refreshSession?: TResponseLocalsSession
    } = {
        user: {
            ...(user as CUser),
            id: userSnapshot.id,
        },
        session: {
            ...(session as CSession),
            id: sessionSnapshot.id,
        },
    }

    if (session.type == 'accessToken') {
        const refTokenDoc = doc(
            database,
            'sessions',
            session.tokenParent as string
        ).withConverter(SessionConverter)
        const refTokenSnapshot = (await getDoc(refTokenDoc)) || null
        const refToken = refTokenSnapshot?.data() || null
        if (!refToken) {
            await deleteDoc(tokenDoc)
            throw new Error(
                'Refresh token linked with this access token is not exist'
            )
        }

        if (
            TimestampConverter(refToken.timestamp).getTime() +
                session.duration <=
            Date.now()
        ) {
            await deleteDoc(tokenDoc)
            await deleteDoc(refTokenDoc)
            throw new Error(
                'Refresh token linked with this access token is expired'
            )
        }
        returnObj.refreshSession = {
            ...refToken,
            id: refTokenSnapshot.id,
        }
    }

    return returnObj
}

export const GenerateToken = async (
    user: string,
    type: 'refreshToken' | 'accessToken',
    tokenParent?: string
) => {
    if (type == 'accessToken' && !tokenParent)
        throw new Error(
            "Can't generate a parentless (refresh token) access token"
        )
    const session = await addDoc(
        collection(database, 'sessions').withConverter(SessionConverter),
        new CSession(
            user,
            type,
            serverTimestamp(),
            tokenParent,
            parseInt(
                type == 'accessToken'
                    ? ms(config.get('backend.auth.accessTokenExpires' as string))
                    : ms(config.get('backend.auth.refreshTokenExpires' as string))
            )
        )
    )

    const payload: SessionPayload = {
        id: session.id,
    }

    return {
        type,
        token: jwt.sign(payload, jwtToken, {
            expiresIn:
                type == 'refreshToken'
                    ? (config.get('backend.auth.refreshTokenExpires') as string)
                    : (config.get('backend.auth.accessTokenExpires') as string),
        }),
        session,
    }
}

export const ComparePassword = (plain: string, hashed: string) =>
    bcrypt.compareSync(plain, hashed)
