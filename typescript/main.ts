// SLATED_REMOVAL

import { Business }from'./business';
import { randomEvent} from './customFunctions';
var a=new Business(1)
console.log(a.money);
//a.tickUpdate();
a.newAsset(0);
console.log(JSON.stringify(a.assets.assets));


