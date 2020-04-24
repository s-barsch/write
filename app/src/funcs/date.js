const fill = str => {
  return str.length < 2 ? "0" + str : str
};

export const timestamp = () => {
  let d = new Date();
  return d.getFullYear().toString().substr(2) +
    fill((d.getMonth() + 1).toString()) +
    fill(d.getDate().toString()) +
    "_" + 
    fill(d.getHours().toString()) +
    fill(d.getMinutes().toString()) +
    fill(d.getSeconds().toString());
}

export const makeKey = timestamp => {
    return parseInt(timestamp.substr(0, 6) + timestamp.substr(7), 10)
}


/*
export function makeMonth(timestamp: string): string {
    return timestamp.substr(0, 2) + "-" + timestamp.substr(2, 4)
}

export function makeFilename(timestamp: string): string {
  return timestamp + ".txt";
}

export function makeNumber(timestamp: string): number {
    return parseInt(timestamp.substr(0, 6) + timestamp.substr(7), 10)
}

export function makePath(timestamp: string): string {
    return makeFilename(timestamp)
  //return "/local/text/" + makeMonth(timestamp) + "/" + makeFilename(timestamp);
}
*/
