import { Publisher, TicketUpdatedEvent, Subjects} from '@itcontext/ticketing-common'

export default class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  readonly subject = Subjects.TicketUpdated
}