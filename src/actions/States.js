/* eslint-disable no-undef */

function search(type,cb) {
  var url = window.location.protocol + "//" + window.location.hostname + "/api/api/v1/states";
  //var url = 'https://www.voter-information.com/api/api/v1/states';
  if (type === "list")
    url = url + "?type=list";
  else if (type === "min")
    url = url + "?type=min"
  
  return fetch(url, {
    accept: 'application/json',
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

function checkStatus(response){
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error)
  throw error;
}

function parseJSON(response){
  return response.json();
}

const States = {search};
export default States;

