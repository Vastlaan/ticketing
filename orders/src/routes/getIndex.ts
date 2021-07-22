import express, {Request, Response} from 'express'
import {requireAuthorization, } from '@itcontext/ticketing-common'
import { Order } from '../models/order'

const router = express.Router()

router.get('/api/orders', requireAuthorization, async (req:Request, res:Response)=>{

  const orders = await Order.find({userId: req.currentUser!.id}).populate('ticket')
  
  res.send(orders)
})

export {router as getOrdersRouter};