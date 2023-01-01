import { FieldValue } from 'firebase/firestore'

export class CBlog {
    constructor(
        public author: string,
        public title: string,
        public timestamp: FieldValue,
        public description: string,
        public category: string
    ) {}
}
