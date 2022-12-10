import { FirebaseFieldValue } from '../typings/Firebase'

export class CComment {
    constructor(
        public commenter: string,
        public timestamp: FirebaseFieldValue,
        public description: string,
        public post: string
    ) {}
}
