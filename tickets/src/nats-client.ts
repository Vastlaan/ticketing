import nats, {Stan} from 'node-nats-streaming'

class NatsClient {
  _client?: Stan;

  connect(clusterId: string, clientId: string, url: string){

    return new Promise<void>((resolve, reject)=>{

      const stan = nats.connect(clusterId, clientId, {url})
      this._client = stan

      this.client.on('connect',()=>{
        console.log('Connected to NATS')
        return resolve()
      })
      this.client.on('error', (err)=>{
        console.error(err)
        return reject(err)
      })
    })
  }

  // remember getters accessible without parenthesis, like: natsClient.client
  get client(){
    if(!this._client){
      throw new Error('Cannot access client before connecting')
    }
    return this._client
  }
}

export const natsClient = new NatsClient()

