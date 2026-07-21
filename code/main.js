const {Business}=require('./business.js');
const example=new Business(2);
console.log("1"+'\n'+JSON.stringify(example));
example.tickUpdate();
console.log("2"+'\n'+JSON.stringify(example));
example.newAsset(1);
example.tickUpdate();
console.log("3"+'\n'+JSON.stringify(example));
