var cheerio = require('cheerio'),
  request = require('request'),
  Promise = require('bluebird');

var getSearchString = function(){
  var args = process.argv.slice(2);
  if(args.length === 0){
    console.log('No search string entered, try again')
    return;
  } else {
    var searchString = '';
    for(var i = 0; i < args.length; i++){
      searchString += args[i]+'+';
    }
    return (searchString.substring(0, searchString.length-1));
  }
}

var url = 'https://www.google.com/search?q='+getSearchString();

var trash = ['image', 'true', 'false', 'iframe', 'used', 'these', 'such', 'their', 'isbn', 'said', 'other', 'span', 'were', 'read', 'href', 'this', 'that', 'what', 'with', 'will', 'have', 'they', 'function', 'make', 'from', 'more', 'which', 'when', 'been', 'after', 'else', 'about', 'your', 'also']

var WordCount = function(word, count){
  this.word = word;
  this.count = count;
}

var crawlSearch = function(){
  return new Promise(function(resolve, reject){
    request(url, function(err, res, body){
      if(err){
        reject(err);
        throw err;
      } else{
        var links = new Array();
        var $ = cheerio.load(body);
        $('.r a').filter(function(){
          var link = $(this).attr('href').replace("/url?q=", "").split("&")[0];
          if(link.charAt(0) === '/'){
            ; // Skip url
          } else{
            links.push(link);
          }
        })
        resolve(links);
      }
    })
  })
}

var crawlLinks = function(links){
  var words = new Object();
  var numLinks = links.length - 1;
  var itr = 0;
  return new Promise(function(resolve, reject){
    links.forEach(function(link){
      request(link, function(err, res, body){
        if(err){
          reject(err);
          throw err;
        } else{
          var $ = cheerio.load(body);
          var text = $('body').text().replace(/\s+/g, " ").replace(/[^a-zA-Z ]/g, "").toLowerCase();
          text.split(' ').forEach(function(word){
            if(word.length < 4 || word.length > 20 || trash.indexOf(word) != -1){
              ;
            } else if(words[word]){
              words[word]++;
            } else{
              words[word] = 1;
            }
          })
          if(itr === numLinks){
            resolve(words)
          } else{
            itr++;
          }
        }
      })
    }) 
  })
}

var startSpider = function(){
  var countArray = new Array();
  crawlSearch().then(function(links){
    crawlLinks(links).then(function(words){
      for(var word in words){
        countArray.push(new WordCount(word, words[word]))
      }
      countArray.sort(function(a, b){
        return b.count - a.count;
      })
      console.log(countArray.slice(0, 50))
    })
  })
}

startSpider();