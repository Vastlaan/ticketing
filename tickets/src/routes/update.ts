import {Router, Request, Response, NextFunction} from 'express'
import { requireAuthorization, requestValidator, NotFoundError, NotAuthorizedError } from '@itcontext/ticketing-common'
import {Ticket} from '../models/ticket'
import TicketUpdatedPublisher from '../events/publishers/ticket-updated-publisher';
import { natsClient } from '../nats-client';
import {body} from 'express-validator'

const router = Router();

router.put('/api/tickets/:id', requireAuthorization, [
  body('title').trim().isLength({min: 3, max: 100}),
  body('price').isFloat({gt:0})
], requestValidator, async (req: Request, res: Response, next: NextFunction)=>{

  try{
    const {title, price} = req.body
    const {id} = req.params

    const ticket = await Ticket.findById(id)

    if(!ticket){
      throw new NotFoundError()
    }

    if(ticket.userId !== req.currentUser!.id){
      throw new NotAuthorizedError()
    }

    ticket.title = title
    ticket.price = price

    await ticket.save()

    await new TicketUpdatedPublisher(natsClient.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    })

    console.log('TICKET: ', ticket)

    res.status(200).json({ticket})

  }catch(e){
    console.error(e)
    next(e)
  }
})

export {router as updateTicketRouter};