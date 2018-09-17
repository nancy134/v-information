// in my-app/server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const fs = require('fs');
const httprequest = require('request');
const https = require('https');

function replaceMeta(data,body,request){
  url = 'http://'+request.headers.host;
  console.log("url: "+request.headers.host+request.originalUrl);
  console.log("body.region: "+body.region);
  data = data.replace(/\$PAGE_TITLE/g, 'Voter Information');
  data = data.replace(/\$PAGE_DESCRIPTION/g, 'Information source for the 2018 Midterm Elections');
  data = data.replace(/\$TWITTER_HANDLE/g, '@voterinfo777');
  data = data.replace(/\$TWITTER_IMAGE/g, url+'/midtermsTwitter.jpg');
  data = data.replace(/\$PAGE_URL/g, url+request.originalUrl);
  data = data.replace(/\$SITE_NAME/g, 'Voter Information');
  data = data.replace(/\$STATE/g, body.region);

  return data;
}

app.get('/', function(request, response){
  url = 'https://ipinfo.io/'+request.headers['x-forwarded-for'] + '/geo';
  httprequest(url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    const filePath = path.resolve(__dirname, './build', 'index.html');
    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) {
        return console.log(err);
      }
      result = replaceMeta(data,body,request);
      response.send(result);
    });
  });
});

app.get('/voter', function(request, response){
  url = 'https://ipinfo.io/'+request.headers['x-forwarded-for'] + '/geo';
  httprequest(url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    const filePath = path.resolve(__dirname, './build', 'index.html');
    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) {
        return console.log(err);
      }
      result = replaceMeta(data,body,request);
      response.send(result);
    });
  });
});

app.get('/senate', function(request, response){
  url = 'https://ipinfo.io/'+request.headers['x-forwarded-for'] + '/geo';
  console.log("x-forwarded-for: "+request.headers['x-forwarded-for']);
  httprequest(url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    const filePath = path.resolve(__dirname, './build', 'index.html');
    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) {
        return console.log(err);
      }
      result = replaceMeta(data,body,request);
      response.send(result);
    });
  });
});

app.get('/house', function(request, response){
  url = 'https://ipinfo.io/'+request.headers['x-forwarded-for'] + '/geo';
  httprequest(url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    const filePath = path.resolve(__dirname, './build', 'index.html');
    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) {
        return console.log(err);
      }
      result = replaceMeta(data,body,request);
      response.send(result);
    });
  });
});

app.use(express.static(path.resolve(__dirname, 'build')));

app.get('*', function(request, response) {
  console.log("app.get(*) ");
  url = 'https://ipinfo.io/'+request.headers['x-forwarded-for'] + '/geo';
  httprequest(url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log("body.region: "+body.region);

  const filePath = path.resolve(__dirname, 'build', 'index.html');
  response.sendFile(filePath);
  });
});


app.listen(port, () => console.log(`Listening on port ${port}`));
