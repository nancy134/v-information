/* eslint-disable no-undef */

function index(q, cb) {
  var url = 'https://www.voter-information.com/api/api/v1/campaigns?' + q
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

const Campaigns = {index};
export default Campaigns;
