export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// JSON.parse() ref from https://www.w3schools.com/js/js_json_parse.asp
