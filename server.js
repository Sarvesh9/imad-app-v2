var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
    user: 'sarvesh9',
    database: 'sarvesh9',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: 'db-sarvesh9-50143'
};


var app = express();
app.use(morgan('combined'));

var articles = {
    'article-one': {
            title : 'Article One | Sarvesh Narkar',
            heading : 'Article One',
            date : 'Sept 5, 2016',
            content : `
                        <p>This is the content of article-one.This is the content of article-one.This is the content of article-one.This is the content of article-one.This is the content of article-one.This is the content of article-one.This is the content of article-one.This is the content of article-one.
                       </p>
                       <p>This is the content of article-one.This is the content of article-one.This is the content of article-one.This is the content of article-one.This is the content of article-one.This is the content of article-one.This is the content of article-one.This is the content of article-one.
                       </p>
                       <p>This is the content of article-one.This is the content of article-one.This is the content of article-one.This is the content of article-one.This is the content of article-one.This is the content of article-one.This is the content of article-one.This is the content of article-one.
                       </p>`
        },
    'article-two': {
            title : 'Article Two | Sarvesh Narkar',
            heading : 'Article Two',
            date : 'Sept 10, 2016',
            content : `
                        <p>
                            This is the content of article-two.This is the content of article-two.This is the content of article-two.
                       </p>`
    },
    'article-three':{
        title : 'Article Three | Sarvesh Narkar',
        heading : 'Article Three',
        date : 'Sept 15, 2016',
        content : `
                    <p>
                        This is the content of article-three.This is the content of article-three.This is the content of article-three.
                   </p>`
    }
};


function createTemplate (data){
    var title=data.title;
    var heading=data.heading;
    var date=data.date;
    var content=data.content;
    var htmlTemplate = `
    <html>
    <head>
        <title>
            ${title}
        </title>
        <meta name="viewport" content="width-devce-width, initial-scale=1" />
        <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <body>
        <div class="container">
           <div>
               <a href="/">Home</a>
           </div>
           <hr/>
           <h3>
               ${heading}
           </h3>
           <div>
               ${date}
           </div>
           <div>
               ${content}
           </div> 
        </div>   
    </body>    
</html>
`;
return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);
app.get('/test-db', function (req, res) {
    //make a select request
    //return a respones with the results
    pool.query('SELECT * FROM test', function(err,result) {
        if (err) {
            res.status(500).send(err.toString());
        } else {
         res.send(JSON.stringify(result));   
        }
    });
});
app.get('/articles/:articleName', function (req, res) {
    //articleName == article-one
    //articles[articleName] == {} content object for article one
  
  pool.query("SELECT * FROM article WHERE title = '" + req.params.articleName + "'", function(err,result) { 
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(404).send('Article not found');
          } else {
              var articleData = result.rows[0];
              res.send(createTemplate(articleData));
          }
      }
  });
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
