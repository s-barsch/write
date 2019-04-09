let fill = function addLeadingZero(str) {
  if (str.length < 2) {
    return "0" + str;
  }
  return str;
};

let now = function() {
  let d = new Date();
  return d.getFullYear().toString().substr(2) +
    fill((d.getMonth() + 1).toString()) +
    fill(d.getDate().toString()) +
    "_" + 
    fill(d.getHours().toString()) +
    fill(d.getMinutes().toString()) +
    fill(d.getSeconds().toString());
}

let nowMonth = function() {
  let d = new Date();
  return d.getFullYear().toString().substr(2) + "-" +
         fill((d.getMonth() + 1).toString());
}

let nowFile = function() {
  return now() + ".txt"
}

export function newPath() {
  return "/local/text/" + nowMonth() + "/" + nowFile();
}
