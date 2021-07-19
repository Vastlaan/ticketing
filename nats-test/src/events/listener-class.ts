import {Stan, Message} from 'node-nats-streaming'
import {Subjects} from './subjects'

interface Event{
  subject: Subjects;
  data: any
}

abstract class Listener<T extends Event> {

  abstract queueGroupName: string;
  abstract subject: T['subject'];       // abstract properities MUST be defined by whatever class is implemnting this one (Listener)
  abstract onMessage(data: T['data'], msg: Message) : void;
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

export default Listener