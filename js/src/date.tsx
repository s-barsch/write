function fill(str: string): string {
  if (str.length < 2) {
    return "0" + str;
  }
  return str;
};

export function timestamp(): string {
  let d = new Date();
  return d.getFullYear().toString().substr(2) +
    fill((d.getMonth() + 1).toString()) +
    fill(d.getDate().toString()) +
    "_" + 
    fill(d.getHours().toString()) +
    fill(d.getMinutes().toString()) +
    fill(d.getSeconds().toString());
}

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
  return "/local/text/" + makeMonth(timestamp) + "/" + makeFilename(timestamp);
}
