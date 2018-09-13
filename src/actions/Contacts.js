/* eslint-disable no-undef */

function submit(name,email,message,cb) {
  var url = window.location.protocol + "//" + window.location.hostname + "/api/api/v1/messages";

  var body = "name="+name+"&email="+email+"&message="+message; 
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body
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

const Contacts = {submit};
export default Contacts;

