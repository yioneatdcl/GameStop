import { SERVER_MESSAGE_TYPES } from "../../utils/types"
import { GameRoom } from "../gameRoom"
import { Player } from "../schemas/player"

export class RoomHandler {
    room: GameRoom

    constructor(room:GameRoom) {
        this.room = room

        room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_JOINED, async(client, info)=>{
            console.log(SERVER_MESSAGE_TYPES.PLAYER_JOINED + " message", info)

            let player: Player = room.state.players.get(client.userData.userId)
            if(player) {
                console.log("Player found: " + client.userData?.userId)
                // you cannot join unless game state is ready to add playing players so just update here
                if (!player.playing) {
                    console.log("Player wasnt playing: " + client.userData?.userId)
                    player.playing = true    
                    this.room.state.gameManager.addCurrentPlayers();
                }
            } 
        })

        room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_LEFT, async(client, info)=>{
            console.log(SERVER_MESSAGE_TYPES.PLAYER_LEFT + " message", info)
            
        })

        room.onMessage(SERVER_MESSAGE_TYPES.RESET_GAME, async(client, info)=>{
            console.log(SERVER_MESSAGE_TYPES.RESET_GAME + " message", info)

            this.room.state.gameManager.resetGame()
        })


        room.onMessage(SERVER_MESSAGE_TYPES.CLAIM_SPOT, async(client, info)=>{
            console.log(SERVER_MESSAGE_TYPES.CLAIM_SPOT + " message", info)
            
            this.room.state.gameManager.claimSpot(client.userData.userId, info)
        })

        room.onMessage(SERVER_MESSAGE_TYPES.EVICT, async(client)=>{
            console.log(SERVER_MESSAGE_TYPES.EVICT + " message")
            
            if (!this.room.state.isEvicting){
                this.room.state.isEvicting = true;
                this.room.state.gameManager.evict(client.userData.userId)
            }
            
            
        })
    }
}