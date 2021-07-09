import {Router, Request, Response, NextFunction} from 'express'
import { NotFoundError, requireAuthorization } from '@itcontext/ticketing-common'
import {Ticket} from '../models/ticket'

const router = Router();

router.get('/api/tickets/:id', async (req: Request, res: Response, next: NextFunction)=>{

  try{
    const {id} = req.params
    const ticket = await Ticket.findById(id)

    if(!ticket){
      throw new NotFoundError()
    }

    res.status(201).json({ticket})
  }catch(e){
    console.error(e)
    next(e)
  }
})

export {router as getTicketRouter};