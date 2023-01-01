import { FieldValue } from 'firebase/firestore'

export class CUser {
    public username: string
    public password: string
    public timestamp: FieldValue
    public email: string

    constructor(
        username: string,
        password: string,
        email: string,
        timestamp: FieldValue
    ) {
        this.username = username
        this.email = email
        this.password = password
        this.timestamp = timestamp
    }
}
