'use strict';
/**
 *It is core file of node application, all other application file start including here and built node server on defined port.
 **/
var app = require('./app'); //Require our app

app.set('port', process.env.PORT || 3004);

var server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + server.address().port);
});