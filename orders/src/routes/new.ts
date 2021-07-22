import express, {Request, Response} from 'express'
import {requireAuthorization, requestValidator, NotFoundError, OrderStatus, BadRequestError} from '@itcontext/ticketing-common'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import { Ticket } from '../models/ticket'
import { Order } from '../models/order'

const EXPIRATION_TIME_SECONDS = 15 * 60

const router = express.Router()

router.post('/api/orders', requireAuthorization, [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))  // this step assumes that services emitting ticket:created event store tickets in mongodb database
    .withMessage('ticketId must be provided')
], requestValidator,  async (req:Request, res:Response)=>{

  try{
    // Find the ticket the user is trying to order in database
    const {ticketId} = req.body
  
    const ticket = await Ticket.findById(ticketId)

    if(!ticket){
      throw new NotFoundError()
    }
  
    // Make sure that this ticket is not already reserved
    const isReserved = await ticket.isReserved()

    if(isReserved){
      throw new BadRequestError('Ticket is already reserved')
    }
  
    // Calculate the expire date for this order
    const expireDate = new Date()
    expireDate.setSeconds(expireDate.getSeconds() + EXPIRATION_TIME_SECONDS)
  
    // Build the order and save it to the database
    const order = Order.build({
      userId : req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expireDate,
      ticket: ticket
    })

    await order.save()
  
    // Publish an event that an order was created
  
    res.status(201).send(order)
  }catch(e){
    console.error(e)
    throw e // thanks to express-async-error
  }
})

export {router as createOrderRouter};