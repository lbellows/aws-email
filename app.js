var express = require('express');
var bodyParser = require('body-parser');
var aws = require('aws-sdk'); 

aws.config.loadFromPath('client-config.json');
var ses = new aws.SES({apiVersion: '2010-12-01'});

var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/sendEmail', function (req, res) {
  sendEmail(req, res);
});

app.listen(4444);

function sendEmail(req, res){
  
  // this must relate to a verified SES account
  var from = 'website@4leafelectric.com';

  // this sends the email
  // @todo - add HTML version
  ses.sendEmail( 
    { 
      Source: from, 
      Destination: { ToAddresses: ['lbellows@gmail.com'] },
      Message: {
        Subject: {
          Data: req.body.inSubject
        },
        Body: {
          Html: {
            Data: 'Name: ' + req.body.inName 
            + '<br/>Email: ' + req.body.inEmail
            + '<br/>Message' + req.body.inMessage
            
          }
        }
      }
    }
  , function(err, data) {
      if(err){
        //console.error(err);
        res.status(500).send(err);
      }
    
      //console.log(JSON.stringify(data));
      //res.statusCode = 200;
      res.end();
  });
}