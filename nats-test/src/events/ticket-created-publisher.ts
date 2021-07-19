import Publisher from './publisher-class'
import {TicketCreatedEvent} from './ticket-created-event'
import { Subjects } from './subjects'

export default class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{

  readonly subject = Subjects.TicketCreated 
}