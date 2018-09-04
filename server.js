// in my-app/server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const fs = require('fs');
const httprequest = require('request');
const https = require('https');

app.get('/', function(request, response){
  console.log("app.get(/)");
  url = 'https://ipinfo.io/'+request.headers['x-real-ip'] + '/geo';
  httprequest(url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log("body.region: "+body.region);

    const filePath = path.resolve(__dirname, './build', 'index.html');

    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) {
        return console.log(err);
      }
      data = data.replace(/\$PAGE_TITLE/g, 'Home');
      //data = data.replace(/\$PAGE_DESCRIPTION/g, 'Information for voters');
      data = data.replace(/\$TWITTER_HANDLE/g, '@voterinfo777');
      data = data.replace(/\$TWITTER_IMAGE/g, 'http://www.voter-information.com/CheckRegistration.jpg');
      data = data.replace(/\$PAGE_URL/g, 'http://www.voter-information.com/');
      result = data.replace(/\$SITE_NAME/g, 'Voter Information');
      result = data.replace(/\$STATE/g, body.region);
      response.send(result);
    });
  });
});
app.get('/voter', function(request, response){
  console.log('app.get(/registration)');
  url = 'https://ipinfo.io/'+request.headers['x-real-ip'] + '/geo';
  httprequest(url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log("body.region: "+body.region);
    const filePath = path.resolve(__dirname, './build', 'index.html');

    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) {
        return console.log(err);
      }
      data = data.replace(/\$PAGE_TITLE/g, 'Check your voter registration');
      //data = data.replace(/\$PAGE_DESCRIPTION/g, 'Supreme Court says states can remove voters who skip elections, ignore warnings');
      data = data.replace(/\$TWITTER_HANDLE/g, '@voterinfo777');
      data = data.replace(/\$TWITTER_IMAGE/g, 'http://www.voter-information.com/CheckRegistration.jpg');
      data = data.replace(/\$PAGE_URL/g, 'http://www.voter-information.com/registration');
      result = data.replace(/\$SITE_NAME/g, 'Voter Information');
      result = data.replace(/\$STATE/g, body.region);
      //response.redirect('/registration/'+body.region);
      response.send(result);
    });
  });
});


app.get('/voter/*', function(request, response){
  console.log('app.get(/registration/*)');
  url = 'https://ipinfo.io/'+request.headers['x-real-ip'] + '/geo';
  httprequest(url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log("body.region: "+body.region);
    const filePath = path.resolve(__dirname, './build', 'index.html');

    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) {
        return console.log(err);
      }
      data = data.replace(/\$PAGE_TITLE/g, 'Check your voter registration');
      //data = data.replace(/\$PAGE_DESCRIPTION/g, 'Supreme Court says states can remove voters who skip elections, ignore warnings');
      data = data.replace(/\$TWITTER_HANDLE/g, '@voterinfo777');
      data = data.replace(/\$TWITTER_IMAGE/g, 'http://www.voter-information.com/CheckRegistration.jpg');
      data = data.replace(/\$PAGE_URL/g, 'http://www.voter-information.com/registration');
      result = data.replace(/\$SITE_NAME/g, 'Voter Information');
      response.send(result);
    });
  });
});

app.use(express.static(path.resolve(__dirname, 'build')));

app.get('*', function(request, response) {
  console.log("app.get(*) ");
  url = 'https://ipinfo.io/'+request.headers['x-real-ip'] + '/geo';
  httprequest(url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log("body.region: "+body.region);

  const filePath = path.resolve(__dirname, 'build', 'index.html');
  response.sendFile(filePath);
  });
});


app.listen(port, () => console.log(`Listening on port ${port}`));
