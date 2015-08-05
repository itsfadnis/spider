var cheerio = require('cheerio'),
  request = require('request'),
  Promise = require('bluebird'),
  express = require('express'),
  morgan = require('morgan'),
  cors = require('cors'),
  app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.set('port', process.env.PORT || 8080);

app.get('/', function(req, res, next){
  res.sendFile(__dirname+'/public/index.html');
})

app.get('/api/:text', function(req, res, next){
  var Spider = require('./spider.js')(Promise, cheerio, request, 'https://www.google.com/search?q='+req.params.text);
  Spider.startSpider().then(function(data){
    res.json(data);
  })
})

app.listen(app.get('port'), function(){
  console.log('Express server listening at port '+app.get('port'));
})