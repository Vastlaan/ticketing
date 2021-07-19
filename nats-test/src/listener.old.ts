import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

// ==================================== BELOW RAW IMPLEMENTATION ====================================

// console.clear();

// const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
//   url: 'http://localhost:4222',
// });

// stan.on('connect', () => {
//   console.log('Listener connected to NATS');

//   stan.on('close', () => {
//     console.log('NATS connection closed!');
//     process.exit();
//   });

//   const options = stan
//     .subscriptionOptions()                  // indicates that the chain of options will be applied
//     .setManualAckMode(true)                 // force to send the acknowledge to publisher that the message been processed successfuly
//     .setDeliverAllAvailable()               // asks publisher to send all the messages ever created
//     .setDurableName('accounting-service');  // assign the name for group messages, so that, when they are processed the publisher will keep track on events which has been processed or not by listener
//                                             // setDurableName works with queue group!!!!
//   const subscription = stan.subscribe(
//     'ticket:created',                       // name of listener
//     'queue-group-name',                     // name of queue group
//     options                                 // options defined above
//   );

//   subscription.on('message', (msg: Message) => {
//     const data = msg.getData();

//     if (typeof data === 'string') {
//       console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
//     }

//     msg.ack();
//   });
// });

// process.on('SIGINT', () => stan.close());
// process.on('SIGTERM', () => stan.close());

// ==================================== ABOVE RAW IMPLEMENTATION ====================================

abstract class Listener {

  abstract queueGroupName: string;
  abstract subject: string;       // abstract properities MUST be defined by whatever class is implemnting this one (Listener)
  abstract onMessage(data: any, msg: Message) : void;
  private client : Stan;
  protected ackWait = 5 * 1000    // protected class indicates that it can be defined by subclass, but doesn't have to. (Default 5s)  


  constructor(client: Stan){
    this.client = client
  }

  subscriptionOptions(){
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName)
  }

  listen(){
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    )

    subscription.on('message', (msg: Message)=>{
      console.log(`
        Recieved message: ${this.subject} / ${this.queueGroupName}
      `)

      const parsedData = this.parseMessage(msg)

      this.onMessage(parsedData, msg)

    })
  }

  parseMessage(msg: Message){
    
    const data = msg.getData()

    return typeof data === 'string'
      ? JSON.parse(data)                        // if data is a string it is of JSON format, so we parse it to JS Object
      : JSON.parse(data.toString('utf-8'))      // otherwise it is a Buffer, and we parse it to JS Object
  }

}

class TicketCreatedListener extends Listener{
  
  subject = 'ticket:created'
  queueGroupName = 'payment-service'

  onMessage = (data: any, msg: Message) =>{
    console.log('Event data: ', data)

    msg.ack()
  }

}

// ==================================== BELOW CLASS IMPLEMENTATION ====================================

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  new TicketCreatedListener(stan).listen()

  process.on('SIGINT', () => stan.close());
  process.on('SIGTERM', () => stan.close());
})