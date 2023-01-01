import { FieldValue } from "firebase/firestore";

export class CReply {
  constructor(
    public replyTo: string,
    public replyToType: "reply" | "comment",
    public replier: string,
    public timestamp: FieldValue,
    public description: string,
    public likes: string[],
    public dislikes: string[]
  ) {}
}
