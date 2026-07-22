const { Business }: { Business: any } = require('./business.ts');
const example=new Business(2);
console.log("1"+'\n'+JSON.stringify(example));
example.employees.addEmployees(10,1);
console.log("2"+'\n'+JSON.stringify(example));
example.newAsset(1);
example.tickUpdate();
example.employees.remEmployees(10,1);
console.log("3"+'\n'+JSON.stringify(example));
