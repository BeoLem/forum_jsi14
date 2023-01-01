import { FieldValue } from "firebase/firestore";
import { CReply } from "./Reply";
export class CComment {
  constructor(
    public commenter: string,
    public timestamp: FieldValue,
    public description: string,
    public blog: string,
    public likes: string[],
    public dislikes: string[]
  ) {}
}
