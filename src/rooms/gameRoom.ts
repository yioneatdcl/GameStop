import { Client, Room } from "colyseus";
import { GameRoomState } from "./schemas/gameRoomState";
import { GameManager } from "../game-manager";
import { RoomHandler } from "./handlers/roomHandler";
import { Player } from "./schemas/player";
import { addGameRoom } from "../Admin";

export class GameRoom extends Room<GameRoomState> {

    async onAuth(client: Client, options: any, req: any) {
        console.log('player trying to join', options.userData.name)
        return true;
    }

    onCreate(options: any) {
        this.setState(new GameRoomState());
        
        addGameRoom(this)

        this.state.world = options.world

        this.state.gameManager = new GameManager(this)

        //add listeners
        this.state.handler = new RoomHandler(this) 

        this.setSeatReservationTime(20)
    }

    onJoin(client: Client, options: any) {
        try {
            // console.log(auth.userId, "joined! -", options.userData.name, "Realm -", auth.realm);

            client.userData = options.userData;
            client.userData.ip = client.auth.ip
            // client.userData.userId = auth.userId;
            // client.userData.realm = auth.realm;

            client.userData.roomId = this.roomId
            this.getPlayerInfo(client, options)
        } catch (e) {
            console.log('on join error', e)
        }
    }

    async onLeave(client: Client, consented: boolean) {
        let player:Player = this.state.players.get(client.userData.userId)
        if(player){
            console.log(player.name + " left!");

            player.playing = false;
            this.state.gameManager.updateGameRoomData();
        }
    }
    
    onDispose() {
        console.log("room", this.roomId, "disposing...");
        //clear all timers
        this.state.gameManager.garbageCollect()

    }

    async getPlayerInfo(client: Client, options: any) {

        let player:Player = this.state.players.get(client.userData.userId)
        if(!player){

             console.log("User added to players - " + options.userData.name + "(" + options.userData.userId + ")")
              player = new Player(this, client)
                this.state.players.set(options.userData.userId, player)
        } else {
            console.log("User already in player set - name:" + player.name)
        }
    }
}
