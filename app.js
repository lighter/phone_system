
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/send_data', routes.send_data);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

//socket.io
var socket = io.listen(server);
var conn_num = 0;
socket.on('connection', function(client){
  conn_num++;

  //更新線上人數
  client.emit('update_conn_number', conn_num);

  //廣播所有連線的人更新線上人數
  client.broadcast.emit('update_conn_number', conn_num);
  //client send the data
  client.on('send_data', function(){
    console.log('send data');
  });

  client.on('update_table', function(box, tr_index){
    client.emit('update_client_table', box, tr_index);
    client.broadcast.emit('update_client_table', box, tr_index);
  });

  //disconnect
  client.on('disconnect', function(){
    conn_num--;
  });
});


