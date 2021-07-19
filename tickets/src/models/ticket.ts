import mongoose from 'mongoose'

const {Schema} = mongoose

interface TicketDoc extends mongoose.Document{
  title: string,
  price: number,
  userId: string
}

interface TicketAttributes {
  title: string,
  price: number,
  userId: string
}

interface TicketModel extends mongoose.Model<TicketDoc>{
  build(attrs: TicketAttributes): TicketDoc 
}

const ticketSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
},{
  toJSON: {
    transform(doc, ret){
      ret.id = ret._id;
      delete ret._id
    }
  }
})

ticketSchema.statics.build = (attrs: TicketAttributes) =>{
  return new Ticket(attrs)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema)


export {Ticket}