import * as express from 'express';
// import * as WebSocket from 'ws';
//import {SharedStringServer} from './SharedStringServer';
// import { hostname } from './WorkspaceApi-backend-contribution';



//const sharedStringServer = new SharedStringServer();

export function registerCollab(app: express.Application){

    // const portnumber = parseInt(process.env.PORT ?? "3000");
    // const webServerOption : WebSocket.ServerOptions = {
    //     host: hostname,
    //     port: portnumber
    // }
    // var wss = new WebSocket.Server(webServerOption);

    // wss.on("connection", (ws: WebSocket) => {
    //     console.log("connection with client started");

    //     ws.on("close", () => {
    //         console.log("connection with client closed");
    //     });
    // });


    app.get("/startCollab", (req,res)=>{
        console.log("Start Collab");
        //let editorText = req.body.text;
        //sharedStringServer.startCollabSession(editorText);
    });

}