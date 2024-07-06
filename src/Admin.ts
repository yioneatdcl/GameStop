import { GameRoom } from "./rooms/gameRoom"

export const minPlayers:number = 2
export const maxPlayers:number = 3
export const countdownBase:number = 5
export const numberOfMaps = 2;

export let gameRooms:GameRoom[] = []

export function endGame(roomId:string){
    let room = gameRooms.find(room => room.roomId === roomId)
    if(room){
        console.log('admin force ending game')
        //room.state.gameManager.endGame()
    }
}

export function addGameRoom(room:GameRoom){
    gameRooms.push(room)
}

export function removeGameRoom(roomId:string){
    let roomIndex = gameRooms.findIndex(room => room.roomId === roomId)
    if(roomIndex >= 0){
        gameRooms.splice(roomIndex, 1)
    }
}