import { Schema, type} from "@colyseus/schema";
import { GameRoom } from "../gameRoom";
import { Client } from "colyseus";
import { DEBUG } from "../../utils/config";

export class Player extends Schema {
    @type("string") userId:string;
    @type("string") name:string 
   
    @type("boolean") playing:boolean = false
    @type("boolean") out: boolean = false;
    @type("boolean") hasSpot: boolean = false;
  
    room:GameRoom
    client:Client
    playFabData:any
    ip:string
  
    constructor(room:GameRoom, client:Client) {
      super()
      this.room = room
      this.client = client
      this.playFabData = client.auth.playfab
      this.userId = client.userData.userId
      this.name = client.userData.name
      this.ip = client.userData.ip

      if(DEBUG){
        return
      }
    }
  }