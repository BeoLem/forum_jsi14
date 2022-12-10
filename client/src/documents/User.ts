import { FirebaseFieldValue } from '../typings/Firebase'

export class CUser {
    public username: string
    public password: string
    public timestamp: FirebaseFieldValue
    public email: string

    constructor(
        username: string,
        password: string,
        email: string,
        timestamp: FirebaseFieldValue
    ) {
        this.username = username
        this.email = email
        this.password = password
        this.timestamp = timestamp
    }
}
