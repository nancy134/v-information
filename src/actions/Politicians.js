/* eslint-disable no-undef */

function search(cb) {
  var url = window.location.protocol + "//" + window.location.hostname + "/api/api/v1/politicians/search";

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
  throw error;
}

function parseJSON(response){
  return response.json();
}

const Politicians = {search};
export default Politicians;
