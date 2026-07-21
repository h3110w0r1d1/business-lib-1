const fs = require('fs');

const raw = fs.readFileSync('./config.json', 'utf8');
const data = JSON.parse(raw);


const raw2 = fs.readFileSync('./businessBase.json', 'utf8');
const assetBases = JSON.parse(raw2);
const assetBase=assetBases.Base;//MOVE THIS TO A JSON FILE XD




class Business{
    constructor(difficulty){
    this.difficulty=difficulty;
    this.money=data.startMoney/difficulty;
    this.employees=new EmployeeManager(difficulty);
this.assets=[];
    }
    tickUpdate(){
        var profitMade=Number(this.employees.profit);
        for(let i=0;i<this.assets.length;i++){
            profitMade-=this.assets[i].tickCost;
            profitMade+=this.assets[i].profit;
        }
    this.money+=profitMade;
    return this.money;
    }
newAsset(index){
    if(index<0||index>assetBase.length){throw new Error("Unexpected index length@newAsset@Business")}
    if(assetBase[index].startCost>this.money){return -1;}else{ for(let i=0;i<assetBase[index].reqEmp.length;i++){
        if(this.employees.employees[i]<assetBase[index].reqEmp[i]){return -2;}
    }}
    this.money-=assetBase[index].startCost;
    this.assets.push(assetBase[index]);
    
}



}






class EmployeeManager{constructor(difficulty){
if(!data.calcStartEmployees){
    this.employees=data.startEmployees;
}else{
    this.employees=[2*(4-difficulty),0,0,0]
}

this.difficulty=difficulty;
this.cost=this.calcEmployeeCost();
this.profit=this.calcEmployeeProfit();

}
calcEmployeeCost(){
    var cost=0;
    for(let i=0;i<this.employees.length;i++){
        cost+=(((6-Number(this.difficulty))/6)*Number(this.employees[i])*Number(data.employeeCost*(i+1)));
    }return cost.toFixed(Number(data.roundPoint));
}
calcEmployeeProfit(){
  if(isNaN(this.cost)||this.cost <=0){
    this.cost=this.calcEmployeeCost();
  }
  var profit=0;
   for(let i=0;i<this.employees.length;i++){
        profit+=(this.employees[i]*data.employeeRev*(i+1));
    }
    profit=(profit-Number(this.cost));
    return profit.toFixed(Number(data.roundPoint));
}
addEmployees(number,level){
    if(isNaN(number)||isNaN(level)){throw new Error("number of employees and level must be numbers!@addEmployees");}
    this.employees[level]+=Number(number);
    this.calcEmployeeProfit();
    this.calcEmployeeCost();
}
remEmployees(number,level){
    if(isNaN(number)||isNaN(level)){throw new Error("number of employees and level must be numbers!@remEmployees");}
    if(Number(this.employees[level])<Number(number)){throw new Error("Too many employees removed!@remEmployees")}
    this.employees[level]-=Number(number);
    this.calcEmployeeProfit();
    this.calcEmployeeCost();
}
}
module.exports.EmployeeManager=EmployeeManager;
module.exports.Business=Business;