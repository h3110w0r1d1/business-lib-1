const fs = require('fs');

const raw = fs.readFileSync('./config.json', 'utf8');
const data = JSON.parse(raw);



class Business{
    constructor(difficulty){
    this.difficulty=difficulty;
    this.money=data.startMoney/difficulty;
    this.employees=new EmployeeManager(difficulty);
        
    }
}
class EmployeeManager{constructor(difficulty){
if(!data.calcStartEmployees){
    this.employees=data.startEmployees;
}else{
    this.employees=[3/difficulty,0,0,0]
}
this.cost=this.calcEmployeeCost();
this.profit=this.calcEmployeeProfit();
}
calcEmployeeCost(){
    var cost=0;
    for(let i=0;i<this.employees.length;i++){
        cost+=(this.employees[i]*data.employeeCost*(i+1));
    }return cost;
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
    return profit;
}

}
module.exports.EmployeeManager=EmployeeManager;
module.exports.Business=Business;