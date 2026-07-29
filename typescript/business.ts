//SHIP_VERIFIED 
import { eventRateType, EventManager} from './customFunctions';
import {stringObjConvert,tRandom} from './utils';
import fs from "fs";
interface randomEventI{
    names:string[],
    type: eventRateType,
    chance:number;
    strength?:number[];
};
interface AssetManagerI{
    profitPer:number;
    tickCost:number;
    tickCostAll:number;
    profit:number;

    assets:Asset[];
    tickUpd():number;
    
}
interface Asset {
    startCost: number;
    tickCost: number;
    profit: number;
    reqEmp: number[];
}

interface Config {
    Base: Asset[];
    startMoney: number;
    startEmployees: number[];
    calcStartEmployees: boolean;
    employeeCost: number;
    employeeRev: number;
    roundPoint: number;
    maxEmployeeLevel: number;
    eventsAllowed:randomEventI[];
}



const raw = fs.readFileSync('./config.json', 'utf8');
const data: Config = JSON.parse(raw);

const assetBase = data.Base;//MOVE THIS TO A JSON FILE XD


//fixed types within functions

class AssetManager implements AssetManagerI{
    profitPer:number;
    tickCost:number;
    assets: Asset[];
    tickCostAll:number;
    profit:number;
    constructor(asset:Asset[]){
        this.profitPer=1;
        this.tickCost=1;
        this.profit=1;
        this.tickCostAll=1;
        this.assets=asset
    }
    tickUpd():number{
        let cost:number=0;
        let rev:number=0;
  for (let i = 0; i < this.assets.length; i++) {
            cost += this.assets[i].tickCost*this.tickCost;
            rev += this.assets[i].profit*this.profitPer;
        }
        return (cost*this.tickCostAll)-(rev*this.profit);
    }

}
export class Business {
      readonly difficulty: number;
    money: number;
    employees: EmployeeManager;
    assets: AssetManager;
    events: EventManager;
    constructor(difficulty:number){
    this.difficulty=difficulty;
    this.money=data.startMoney/difficulty;
    this.employees=new EmployeeManager(difficulty);
    this.assets=new AssetManager(assetBase);
    this.events=new EventManager();}
 employeePromotion(num: number, startLevel: number) {//NEW
    if (startLevel < 0 || num < 0 || startLevel >= data.maxEmployeeLevel - 1) {
        throw new Error("number and or level of employee promotion is invalid@employeePromotion@Business");
    }
    if (this.employees.employees[startLevel] < num) {
        return -2;
    }
    var promArray = [...this.employees.employees];
    promArray[startLevel] -= num;
    promArray[startLevel + 1] += num;
    const cost = this.employees.predictEmployeeCost(promArray);
    if (cost <= 0 || cost > 999999999999) {
        throw new Error("invalid cost prediction...@employeePromotion@Business");
    }
    if (cost >= this.money) {
        return -4;
    }
    this.employees.remEmployees(num, startLevel);
    this.employees.addEmployees(num, startLevel + 1);
    this.money -= cost;
    this.tickUpdate();
    return 0;
}
    tickUpdate(): number {
    const ev = this.events.newEvent();

    if (ev.type.modified !== "NONE") {

        if (ev.type.modified === "TEST") {
            console.log(this);

        } else {
            const randomValue = tRandom([ev.type.strength[0], ev.type.strength[1]]);
            stringObjConvert(this, ev.type.modified, randomValue);
        }}

        // Update employee stats
        this.employees.profit = this.employees.calcEmployeeProfit();
        this.employees.cost = this.employees.calcEmployeeCost();

        // Calculate total profit
        let profitMade = this.employees.profit;

        this.assets.tickUpd();

        this.money += profitMade;

       
     return this.money;
}

newAsset(index:number):number{
    if(index<0||index>assetBase.length||assetBase[index].reqEmp.length!=this.employees.employees.length){throw new Error("Unexpected index length@newAsset@Business"); return -3;}
    if(assetBase[index].startCost>this.money){return -1;}else{ for(let i=0;i<assetBase[index].reqEmp.length;i++){
        if(this.employees.employees[i]<assetBase[index].reqEmp[i]){return -2;}
    }}
    this.money-=assetBase[index].startCost;
    this.assets.assets.push(assetBase[index]);
    return 0;
}



}




interface employeeModifiersI{
  promotion_cost:number;
  cost:number;
  profit:number;
  ppl:number[];
}
class employeeModifiers implements employeeModifiersI{
    promotion_cost: number;
    cost: number;
    profit: number;
    ppl: number[];
    constructor(){
        this.cost=1;
        this.promotion_cost=1;
        this.ppl=[1,1,1,1];
        this.profit=1;
    }
}
export class EmployeeManager{
    employees: number[];
    readonly difficulty: number;
    cost: number;
    profit: number;
   modifier:employeeModifiers;
    constructor(difficulty:number){
      this.modifier=new employeeModifiers();
if(!data.calcStartEmployees){
    this.employees=data.startEmployees;
}else{
    this.employees=[2*(4-difficulty),0,0,0]
}

this.difficulty=difficulty;
this.cost=this.calcEmployeeCost();
this.profit=this.calcEmployeeProfit();

}
predictEmployeeCost(prediction:number[]):number{
    let cost:number=0;
    for(let i=0;i<prediction.length;i++){
        cost+=((((6-Number(this.difficulty))/6)*Number(prediction[i])*Number(data.employeeCost*(i+1))));//changed
    }
    cost=cost*this.modifier.cost*this.modifier.promotion_cost;return Number(cost.toFixed(Number(data.roundPoint)));
}
calcEmployeeCost():number{
    let cost:number=0;
    for(let i=0;i<this.employees.length;i++){
        cost+=((((6-Number(this.difficulty))/6)*Number(this.employees[i])*Number(data.employeeCost*(i+1))));
    }cost=cost*this.modifier.cost;
    return Number(cost.toFixed(Number(data.roundPoint)));
}
calcEmployeeProfit():number{
  if(this.cost <=0){//removed isNaN(this.cost)||
    this.cost=this.calcEmployeeCost();
  }
  var profit:number=0;
   for(let i=0;i<this.employees.length;i++){
        profit+=(this.employees[i]*this.modifier.ppl[i]*data.employeeRev*(i+1));
    }
    profit=this.modifier.profit*(profit-Number(this.cost));
    return Number(profit.toFixed(Number(data.roundPoint)));
}
addEmployees(numberz:number,level:number):void{//deprecated the return -1
    this.employees[level]+=Number(numberz);
    this.calcEmployeeProfit();
    this.calcEmployeeCost();
}
remEmployees(numberz:number,level:number):void{//deprecated the return -1

    if(Number(this.employees[level])<Number(numberz)){throw new Error("Too many employees removed!@remEmployees"); }else{
    this.employees[level]-=Number(numberz);
    this.calcEmployeeProfit();
    this.calcEmployeeCost();}//changed to include the else
}
}

