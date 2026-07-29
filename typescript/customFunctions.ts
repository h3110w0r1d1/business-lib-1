
//SHIP_VERIFIED 

const fs=require('fs');
const data=JSON.parse(fs.readFileSync('./config.json', 'utf8'));
export type ModificationTarget =
    | "NONE"
    | "TEST"
    | "employees.modifier.cost"
    | "employees.modifier.profit"
    | "assets.profitPer"
    | "assets.tickCost"
    | "assets.tickCostAll"
    | "assets.profit";

export type eventRateType = {
    modified: ModificationTarget;
    strength:number[];
};



interface randomEventI{
    names:string[],
    type:eventRateType,

    chance:number;
};
export class randomEvent implements randomEventI{
names:string[];
type:eventRateType;
chance:number;

constructor(names:string[],eventt:eventRateType,chance:number){
  
    this.names=names;
    this.type=eventt;
    chance??-1;
    if(chance>1||chance<0){chance=0;console.warn("Unexpected chance value, setting to 0@constructor@randomEvent@events.ts");}
    this.chance=chance
   
   
}
}

import {weightedRandom as wRand} from './utils';
interface EventII{
    uuid:string;
    eventtype:eventRateType;
    name:string;
}
class EventI implements EventII{
    uuid:string;
    eventtype:eventRateType;
    name:string;
    constructor(event:randomEventI,name:string){
        this.uuid=crypto.randomUUID();
        this.eventtype=event.type;
        this.name=name;
    }
}//to be implemented

interface EventManagerI{
   events:randomEventI[];
   lastEvents:EventI[]
}
export class EventManager implements EventManagerI{
    events:randomEventI[];
  
    lastEvents:EventI[];
  constructor(){
    this.events=[];
    this.lastEvents=[];
   
}
newEvent():randomEvent{
   if(!data.randomEvent){console.log("events not allowed!@newEvent()@EventManager@Business")}
let chanceTotal=0;
//this.events.push(eventObject);
for(let i=0;i<this.events.length;i++){
    if(this.events[i]==undefined){break;}
    chanceTotal+=this.events[i].chance;
    if(chanceTotal>1){
        console.warn("Unexpected chance values summing to above 1. Ignoring other values...@"+i+" index@newEvent@EventManager");
        break;
    }
}if(chanceTotal<1){
    this.events.push(new randomEvent([" "],{modified:"NONE",strength:[0,0]}as eventRateType,(1-chanceTotal),))
}
let selectedEvent:randomEventI=this.events[wRand(this.events)];
let name=selectedEvent.names[Math.floor(Math.random() * ((selectedEvent.names.length-1) + 1))];
this.lastEvents.push(new EventI(selectedEvent,name));
return selectedEvent;
}
}

