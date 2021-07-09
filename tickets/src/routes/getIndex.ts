import {Router, Request, Response, NextFunction} from 'express'
import { NotFoundError, requireAuthorization } from '@itcontext/ticketing-common'
import {Ticket} from '../models/ticket'

const router = Router();

router.get('/api/tickets', async (req: Request, res: Response, next: NextFunction)=>{

  try{
    const tickets = await Ticket.find({})

    if(!tickets){
      throw new NotFoundError()
    }

    res.status(200).json({tickets: tickets || []})
  }catch(e){
    console.error(e)
    next(e)
  }
})

export {router as getIndexRouter};