import mongoose from "mongoose";
import {natsClient} from './nats-client'
import { app } from "./app";

const start = async () => {

    console.log(global.global)
    
    if (!process.env.JWT_KEY || !process.env.MONGO_URI || !process.env.NATS_URL || !process.env.NATS_CLUSTER_ID || !process.env.NATS_CLIENT_ID) {
        throw new Error("The environmental varibles must be defined!");
    }
    try {
        // connect to nats
        await natsClient.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)
        // quick note on values:
        // @params clusterID - we define it in nats-depl.yaml file when launching this service with flag -cid 'ticketing'
        // @params clientID - this is random string defining this actual ticket service that is connecting to nats
        // @params url - this is the name of our ClusterIP service connecting us to NATS pod

        natsClient.client.on('close',()=>{
            console.log('NATS connection closed.')
            process.exit()
        })
        process.on('SIGINT', ()=>natsClient.client.close())
        process.on('SIGTERM', ()=>natsClient.client.close())

        // use mongoose.connect('') for single db or mongoose.createConnection('') for multiple db
        // both take a mongodb:// URI, or the parameters host, database, port, options
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error(err);
    }
    const PORT = 3000 || process.env.PORT;

    app.listen(PORT, () => {
        console.log(`App is listening on porta: ${PORT} !`);
    });
};

start();
