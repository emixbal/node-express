var express = require('express');
var jwt = require('jsonwebtoken');

var app = express()

function ensureToken(req, res, next) {
  var bearerHeader = req.headers['authorization']
  if (typeof bearerHeader=='undefined'){
    console.log('undefined, gak ada token');
    res.status(403).send({
      'message':'token not provided'
    })
  } else {
    var bearerToken = bearerHeader.split(' ')
    var tokenBracket = bearerToken[0]
    var tokenProvided = bearerToken[1]

    if(tokenBracket !== 'JWT'){
      res.status(403).send({
        'message':'worng format header Authorization'
      })
    }

    jwt.verify(tokenProvided, 'privateKey', function(err, decoded) {
      if(err){
        console.log('not allowed');
        res.status(403).send({
          'message':'token is not valid'
        })
      }
    });
    next()
  }
}


app.post('/login', async function(req, res){
  var token = await jwt.sign({ foo: 'bar' }, 'privateKey');
  res.send({
    'token':token
  })
})

app.get('/unprotected', function(req, res){
  res.send({
    'message':'upnprotected'
  })
})

app.get('/protected', ensureToken, function(req, res){
  res.send({
    'message':'protected'
  })
})
var port = 3000
app.listen(port, function(){
  console.log(`run in port ${port}`);
})
