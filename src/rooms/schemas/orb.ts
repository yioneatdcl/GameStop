import { Schema, type} from "@colyseus/schema";
import { DEBUG } from "../../utils/config";

export class Orb extends Schema {
    @type("int16") id: number;
    @type("int16") x:number;
    @type("int16") z:number 
   
    @type("boolean") claimed:boolean = false
  
    constructor(id: number,  x: number, z: number) {
      super()
      this.id = id;
      this.x = x;
      this.z = z;

      if(DEBUG){
        return
      }
    }
  }