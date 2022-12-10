import config from 'config'
import { FirebaseFieldValue } from '../typings/Firebase'

export class CSession {
    public user: string
    public type: 'refreshToken' | 'accessToken'
    public duration: number
    public timestamp: FirebaseFieldValue
    public tokenParent?: string

    constructor(
        user: string,
        type: 'refreshToken' | 'accessToken',
        timestamp: FirebaseFieldValue,
        tokenParent: string = '',
        duration: number
    ) {
        this.user = user
        this.type = type
        this.timestamp = timestamp
        this.tokenParent = tokenParent
        this.duration = duration
    }
}
