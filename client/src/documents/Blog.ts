import { FirebaseFieldValue } from '../typings/Firebase'

export class CBlog {
    constructor(
        public author: string,
        public title: string,
        public timestamp: FirebaseFieldValue,
        public description: string,
        public category: string
    ) {}
}
