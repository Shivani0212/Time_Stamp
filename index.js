// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// Middleware to handle date parsing
function parseDate(req, res, next) {
  const { date } = req.query;
  if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate)) {
          req.timestamp = parsedDate.getTime();
          req.utcDate = parsedDate.toUTCString();
          next();
      } else {
          res.status(400).json({ error: "Invalid Date" });
      }
  } else {
      req.timestamp = new Date().getTime();
      req.utcDate = new Date().toUTCString();
      next();
  }
}

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get('/api/:date?', parseDate, (req, res) => {
  const { date } = req.params;

  const generateResponse = (unix, utc) => {
    return { unix, utc };
  };

  if (!date) {
    const now = new Date();
    res.json(generateResponse(now.getTime(), now.toUTCString()));
  } else {
    const parsedUnix = parseInt(date);
    const parsedDate = isNaN(parsedUnix) ? new Date(date) : new Date(parsedUnix);

    if (isNaN(parsedDate.getTime())) {
      res.status(400).json({ error: 'Invalid Date' });
    } else {
      res.json(generateResponse(parsedDate.getTime(), parsedDate.toUTCString()));
    }
  }
});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
