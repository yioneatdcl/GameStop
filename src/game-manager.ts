import { countdownBase, maxPlayers, minPlayers, numberOfMaps } from "./Admin"
import { GameRoom } from "./rooms/gameRoom"
import { Orb } from "./rooms/schemas/orb"
import { Player } from "./rooms/schemas/player"
import { generateRandomNumber, orbPositions } from "./utils/resource"
import { GAME_ROOM_STATUS, SERVER_MESSAGE_TYPES } from "./utils/types"

export class GameManager {

    room:GameRoom
    countDownStarted: boolean = false;
    
    countdownTimer: any;
    evictorTimer: any;
    circulatingTimer: any;
    countdownInterval: any;

    constructor(gameRoom:GameRoom) {
        this.room = gameRoom
    }

    garbageCollect(){
        clearTimeout(this.countdownTimer)
        clearInterval(this.countdownInterval) 
        clearTimeout(this.evictorTimer)
    }

    resetGame() {

        console.log("RESET GAME CALLED!!!!!")
        this.room.state.status = GAME_ROOM_STATUS.WAITING_TO_START;
     
        this.room.state.winner = "";
        this.room.state.winnerId = "";
        this.room.state.loserIds.clear();

        this.room.state.players.forEach(p => {
            p.playing = false;
            p.out = false;
            p.hasSpot = false
        })

        this.room.state.orbs.clear();
        this.room.state.currentNumberOfPlayers = 0;
        this.room.state.currentNumberOfPlayersStillInGame = 0;
        this.room.state.playersInGameList = ""

        clearTimeout(this.countdownTimer)
        clearInterval(this.countdownInterval);
        clearTimeout(this.evictorTimer)
    }

    addCurrentPlayers() { 
        this.room.state.currentNumberOfPlayers++; 
        this.getGameReadyToStart();
    }

    updateGameRoomData(){
       
        let playersStillInPlay = "";
        let currentNumberOfPlayers = 0;
        let currentNumberOfPlayersStillInPlay = 0;
        this.room.state.players.forEach(p => {
            if (p.playing) {
                playersStillInPlay += p.name + (p.out?"(out)":"") + "\n"
                currentNumberOfPlayers++;

                if(!p.out){
                    currentNumberOfPlayersStillInPlay++;
                }
            }
        })
       this.room.state.playersInGameList = playersStillInPlay
       this.room.state.currentNumberOfPlayers = currentNumberOfPlayers;
       this.room.state.currentNumberOfPlayersStillInGame = currentNumberOfPlayersStillInPlay;

        if (currentNumberOfPlayers < minPlayers) {
            console.log("Will reset game cos current number of players:" + this.room.state.currentNumberOfPlayers)
            this.resetGame();
        }
    }

    getGameReadyToStart() {

        // if we have min players we can start the count down in case more wants to join - only if countdown hasnt been kicked off

        if (this.room.state.currentNumberOfPlayers == maxPlayers) {
            this.startGame();
        }

        else if(this.room.state.currentNumberOfPlayers >= minPlayers){
            if (!this.countDownStarted) {
                this.countDownStarted = true;
                this.room.state.status = GAME_ROOM_STATUS.STARTING_SOON

                this.countdownInterval = setInterval(()=>{
                    this.room.state.gameCountdown--
                  }, 1000)

                  
                this.countdownTimer = setTimeout(()=>{
                    this.startGame()
                  }, 1000 * countdownBase)
            }
        } 
    }

    startGame() {
        clearInterval(this.countdownInterval)
        clearTimeout(this.countdownTimer)
        this.countDownStarted = false;
        this.room.state.gameCountdown = countdownBase
        this.room.state.mapIndex = generateRandomNumber(0, numberOfMaps - 1)
        this.room.state.status = GAME_ROOM_STATUS.IN_PROGRESS
       
        let playersStillInPlay = "";
        let countCurrentPlayersStillInGame = 0
        this.room.state.players.forEach(p => {
            if (p.playing) {
                playersStillInPlay += p.name + "\n"
                countCurrentPlayersStillInGame++
            }
        })
        this.room.state.playersInGameList = playersStillInPlay
        this.room.state.currentNumberOfPlayersStillInGame = countCurrentPlayersStillInGame

        this.circulate()



        let randomDelay = generateRandomNumber(20, 60);
        console.log("TIme to wait before we show evictor:" + randomDelay)

        this.evictorTimer = setTimeout(()=>{
            this.room.broadcast(SERVER_MESSAGE_TYPES.SHOW_EVICTOR, { })
          }, 1000* randomDelay)


    }

    circulate() {
        let randomTimeToCirculate = generateRandomNumber(10, 20);
        console.log("TIme to circulate:" + randomTimeToCirculate)

        this.circulatingTimer = setTimeout(()=>{
            this.room.state.isCirculating = false;
          }, 1000* randomTimeToCirculate)

        this.room.state.players.forEach(p =>{
            p.hasSpot = false
        })
        this.room.state.claimedSpots = 0;
        this.room.state.orbs.clear();

        let i: number;
        
        console.log("circulating; how many stil in game:" + this.room.state.currentNumberOfPlayersStillInGame)
        for(i = 0;i< this.room.state.currentNumberOfPlayersStillInGame-1;i++) {
            
            const randomPositionIndex = generateRandomNumber(0, 16)
            const randomPosition = orbPositions[randomPositionIndex]

            let orb = new Orb(i,  randomPosition.x, randomPosition.z)
            this.room.state.orbs.set(i.toString(), orb)
        }

        this.room.state.isCirculating = true;
    }

    claimSpot(userId: string, info: any) {
        let player: Player = this.room.state.players.get(userId)
        let orb: Orb = this.room.state.orbs.get(info.id.toString())
        
        if(player) {

            if (player.playing && !player.out && !player.hasSpot && !orb.claimed) {
                player.hasSpot = true;
                orb.claimed = true;
                this.room.state.claimedSpots = this.room.state.claimedSpots+1
                this.room.broadcast(SERVER_MESSAGE_TYPES.SPOT_CLAIMED, info)
               }
             

            console.log("Claimed Spot count: " + this.room.state.claimedSpots)
            console.log("Orb count:" + this.room.state.orbs.size)
          
            if (this.room.state.claimedSpots >= this.room.state.orbs.size)
            {
                this.room.state.players.forEach(p => {
                    if (p.playing && !p.hasSpot && !p.out) {
                        p.out = true;
                        
                        this.room.broadcast(SERVER_MESSAGE_TYPES.OUT, { id: p.userId})
                        this.room.state.currentNumberOfPlayersStillInGame = this.room.state.currentNumberOfPlayersStillInGame -1;
                        this.room.state.loserIds.push(p.userId)
                    }
                })

                this.room.state.gameManager.updateGameRoomData()

                if(this.room.state.currentNumberOfPlayersStillInGame == 1) {

                    let winner = ""
                    
                    this.room.state.players.forEach(p => {
                        if (p.out == false && p.hasSpot) {
                           winner = p.userId
                        }
                    })

                    this.room.state.status = GAME_ROOM_STATUS.GAME_ENDED
                    this.room.state.winnerId = winner
                    clearTimeout(this.evictorTimer)
                } else {
                    setTimeout(()=>{
                        this.room.state.gameManager.circulate()
                      }, 3000)
                }
            }
        }
    }

    evict(userId: string) {
        console.log("Evictor: " + userId)
        this.room.state.players.forEach(p => {
            if (p.playing && p.userId != userId && !p.out) {
                console.log("Evict: " + p.userId)
                
                this.room.broadcast(SERVER_MESSAGE_TYPES.EVICTION_TRIGGERED, { id: p.userId })
            }
        })

        this.room.state.isEvicting = false;

        let randomDelay = generateRandomNumber(20, 60);
        console.log("TIme to wait before we show evictor:" + randomDelay)

        this.evictorTimer = setTimeout(()=>{
            this.room.broadcast(SERVER_MESSAGE_TYPES.SHOW_EVICTOR, { })
          }, 1000* randomDelay)
        
    }
}

