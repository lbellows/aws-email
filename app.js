var express = require('express');
var bodyParser = require('body-parser');
var aws = require('aws-sdk'); 
var config = require('config.json')

//aws.config.loadFromPath('client-config.json');
var ses = new aws.SES({apiVersion: '2010-12-01', region: 'us-east-1'});

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

app.listen(process.env.PORT || '8081');

function sendEmail(req, res){
  
  // this must relate to a verified SES account
  var from = config.fromEmail;

  // this sends the email
  // @todo - add HTML version
  ses.sendEmail( 
    { 
      Source: from, 
      Destination: { ToAddresses: [config.toEmail] },
      Message: {
        Subject: {
          Data: req.body.inSubject
        },
        Body: {
          Html: {
            Data: '<b>Name:</b> ' + req.body.inName 
            + '<br/><b>Email:</b> ' + req.body.inEmail
            + '<br/><b>Message:</b> ' + req.body.inMessage
            
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