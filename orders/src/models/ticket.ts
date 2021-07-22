import mongoose from 'mongoose'
import { Order , OrderStatus } from './order'

interface TicketAttributes{
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document{
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}
interface TicketModel extends mongoose.Model<TicketDoc>{
  build(attrs: TicketAttributes): TicketDoc
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },

}, {
  toJSON: {
    transform(doc, ret){
      ret.id=ret._id
      delete ret._id
    }
  }
})

ticketSchema.statics.build = (attrs: TicketAttributes) =>{
  return new Ticket(attrs)
}
ticketSchema.methods.isReserved = async function(){

  const existingOrder = await Order.findOne({
    ticket: this.id,
    status: {
      $in: [
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
        OrderStatus.Created
        
      ]
    }
  })

  return !!existingOrder   // dubble exclamation mark because it might be null, so it will be null->true->false
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema)

export { Ticket }