import { GameRoom } from "./rooms/gameRoom";
import cors from 'cors'
import bodyParser from "body-parser";
import config from "@colyseus/tools";

export default config({

    initializeGameServer: (gameServer: any) => {
      
        gameServer.define('haya-game-expo', GameRoom)
        .filterBy(['world'])
    },

    initializeExpress: (app: any) => {

        app.use(cors({origin: true}))
        app.options('*', cors());
        app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
        app.use(bodyParser.json({ limit: '150mb' }));
       
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
