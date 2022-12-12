import { FieldValue } from 'firebase/firestore'

export class CComment {
    constructor(
        public commenter: string,
        public timestamp: FieldValue,
        public description: string,
        public post: string
    ) {}
}
