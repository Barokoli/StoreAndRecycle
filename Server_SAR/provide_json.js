var http = require('http');
var fs = require('fs');
var querystring = require('querystring');
var server = http.createServer(function (req, res) {
  fs.readFile('/tmp/data.json', function(err, data) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
}).listen(8080);

server.on('request', function (req, res) {
    if (req.method == 'POST') {
        var body = '';
    }

    req.on('data', function (data) {
      console.log(data);
        body += data;
    });

    req.on('end', function () {
        var post = querystring.parse(body);
        console.log(post);
        //res.writeHead(200, {'Content-Type': 'text/plain'});
        //res.end('Hello World\n');
    });
});
