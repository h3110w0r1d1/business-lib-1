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
class EmployeeManager{constructor(difficulty){this.test=true;}}
module.exports.EmployeeManager=EmployeeManager;
module.exports.Business=Business;