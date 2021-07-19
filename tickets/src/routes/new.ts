import {Router, Request, Response, NextFunction} from 'express'
import { requireAuthorization, requestValidator } from '@itcontext/ticketing-common'
import { natsClient } from '../nats-client'
import TicketCreatedPublisher from '../events/publishers/ticket-created-publisher'
import {Ticket} from '../models/ticket'
import {body} from 'express-validator'

const router = Router();

router.post('/api/tickets', requireAuthorization, [
  body('title').trim().isLength({min: 3, max: 100}),
  body('price').isFloat({gt:0})
], requestValidator, async (req: Request, res: Response, next: NextFunction)=>{

  try{
    const {title, price} = req.body
    const ticket = await Ticket.build({title, price, userId: req.currentUser!.id})
    await ticket.save()

    // emit ticket:created event
    await new TicketCreatedPublisher(natsClient.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    })

    res.status(201).json({ticket})
  }catch(e){
    console.error(e)
    next(e)
  }
})

export {router as createTicketRouter};