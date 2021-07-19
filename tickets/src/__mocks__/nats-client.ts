import { Stan } from "node-nats-streaming";

export const natsClient = {
  client: {
    publish: (subject: string, data: string, callback: ()=>void) =>{
      callback()
    }
  }
}