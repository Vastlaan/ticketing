import { Message } from "node-nats-streaming";
import Listener from "./listener-class";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

class TicketCreatedListener extends Listener<TicketCreatedEvent>{
  
  readonly subject = Subjects.TicketCreated  // we use readonly to prevent the subject from being overwritten in some method
  queueGroupName = 'payment-service'

  onMessage = (data: TicketCreatedEvent['data'], msg: Message) =>{
    console.log('Event data: ', data)

    msg.ack()
  }

}

export default TicketCreatedListener