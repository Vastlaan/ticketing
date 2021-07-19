import { Publisher, TicketCreatedEvent, Subjects} from '@itcontext/ticketing-common'

export default class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  readonly subject = Subjects.TicketCreated
}