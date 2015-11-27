/**
 * Created by dinhquangtrung on 11/27/15.
 */
var express = require('express');

// Start express server
var server = express();

process.on('uncaughtException', function(err) {
  console.log(err);
});

// Serve static files at root url (React/Redux client)
server.use('/', express.static('.'));

var port = process.env.PORT || 5000;

// Start server
server.listen(port, function () {
  console.log('Express server listening on port ' + port);
});
