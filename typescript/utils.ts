////SHIP_VERIFIED 
const fs=require('fs');
const data=JSON.parse(fs.readFileSync('./config.json', 'utf8'));
export function weightedRandom(events:Array<any>): number {
  const total = events.reduce((sum, e) => sum + e.chance, 0);
  const r = Math.random() * total;

  let acc = 0;
  for (let i = 0; i < events.length; i++) {
    acc += events[i].chance;
    if (r <= acc) return i;
  }

  return events.length - 1; // fallback
}

export function tRandom(args:number[]){
    return (Math.random() * ((args[1]??0) - (args[0]??0)) +  (args[0]??0)).toFixed(data.roundPoint);
}
export function betwRandom(args:number[]){
    return Math.floor(Math.random() * ((args[1]??0) - (args[0]??0)) +  (args[0]??0));
}
export function stringObjConvert(object: any, path: string, value: any) {
    const parts = path.split(".");
    let target = object;

    for (let i = 0; i < parts.length - 1; i++) {
        target = target[parts[i]];
    }

    const last = parts[parts.length - 1];
    target[last] = value;
    return target[last];
}


