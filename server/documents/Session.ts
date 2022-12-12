import { FieldValue } from 'firebase/firestore'
import ms from 'ms'
import config from 'config'

export class CSession {
    public user: string
    public type: 'refreshToken' | 'accessToken'
    public duration: number
    public timestamp: FieldValue
    public tokenParent?: string

    constructor(
        user: string,
        type: 'refreshToken' | 'accessToken',
        timestamp: FieldValue,
        tokenParent: string = '',
        duration: number = parseInt(
            type == 'accessToken'
                ? ms(config.get('backend.auth.accessTokenExpires' as string))
                : ms(config.get('backend.auth.refreshTokenExpires' as string))
        )
    ) {
        this.user = user
        this.type = type
        this.timestamp = timestamp
        this.tokenParent = tokenParent
        this.duration = duration
    }
}
