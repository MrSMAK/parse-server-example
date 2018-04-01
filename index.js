// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;
var appId = process.env.APP_ID;
var masterKey = process.env.MASTER_KEY;
var serverURL = process.env.SERVER_URL;
var clientKey = process.env.CLIENT_KEY;
var restApiKey = process.env.REST_API_KEY;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

if (!appId) {
  console.log('APP_ID not specified, falling back to localhost.');
}

if (!masterKey) {
  console.log('MASTER_KEY not specified, falling back to localhost.');
}

if (!serverURL) {
  console.log('SERVER_URL not specified, falling back to localhost.');
}

if (!clientKey) {
  console.log('CLIENT_KEY not specified, falling back to localhost.');
}

if (!restApiKey) {
  console.log('REST_API_KEY not specified, falling back to localhost.');
}



var api = new ParseServer({
  // databaseURI: databaseUri || 'mongodb://social:social@ds125146.mlab.com:25146/social_journalism',
  databaseURI: databaseUri || 'mongodb://soch:soch123@ec2-34-229-101-24.compute-1.amazonaws.com:27017/soach',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || '1PakTftNl5Vc7tY6PAmzrBV3SrljjpwZJR3MTv2P',
  masterKey: process.env.MASTER_KEY || 'Pgv4rRvEyfmxwCDGXxJe2kdbfZO0xjdKtVQA8pOJ', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed,
  clientKey: process.env.CLIENT_KEY || 'N4TZF2B4y5bMtU6vj6phDH5PSwjVuPHzHUe44dvY',
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  },
  javascriptKey: process.env.JAVASCRIPT_KEY || "myJavascriptKey",
  restAPIKey: process.env.REST_API_KEY || 'Yg8cs4vK2hQZp5vw6hVbd4NA2tf53C9xgVq9zDVD'
});

// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

app.use(function (req, res, next) {
  res.set({ // since there is no res.header class in Parse, we use the equivalent to set the response headers
    'Access-Control-Allow-Origin': '*/*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, X-Parse-Session-Token'
  });
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Parse-Session-Token');
  next();
});

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('Now-App Backend v0.1');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('Now-app backend running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);

//This is a temperary comment