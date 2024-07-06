import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema"
import { Player } from "./player"
import { GameManager } from "../../game-manager"
import { RoomHandler } from "../handlers/roomHandler"
import { GAME_ROOM_STATUS } from "../../utils/types"
import { Orb } from "./orb"
import { countdownBase } from "../../Admin"

export class GameRoomState extends Schema {
    @type("string") world:string = ""
    @type("string") status:string = GAME_ROOM_STATUS.WAITING_TO_START
    @type("int16") mapIndex = 0;
    @type("boolean") isCirculating: boolean = false;
    @type("boolean") isEvicting: boolean = false;
    
    @type("string") playersInGameList: string = "";
    @type("int32") currentNumberOfPlayers: number = 0;
    @type("int32") currentNumberOfPlayersStillInGame: number = 0;
    @type("int16") gameCountdown = countdownBase;

    @type("int16") claimedSpots = 0;

    @type("string") winner:string = ""
    @type("string") winnerId:string = ""
    @type(["string"]) loserIds = new ArraySchema<string>();




    @type({ map: Player }) players = new MapSchema<Player>();
    @type({ map: Orb }) orbs = new MapSchema<Orb>();

  

    handler: RoomHandler
    gameManager: GameManager
  }