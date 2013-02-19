
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

  //update online number
  client.emit('update_conn_number', conn_num);

  //broadcast update online number
  client.broadcast.emit('update_conn_number', conn_num);
  //client send the data
  client.on('send_data', function(){
    console.log('send data');
  });

  //update table
  client.on('update_table', function(box, tr_index){
    client.emit('update_client_table', box, tr_index);
    client.broadcast.emit('update_client_table', box, tr_index);
  });

  //update insert table content
  client.on('insert_data_to_table', function(name_value, region_value, phone_value, object_value){
    client.emit('insert_client_data_to_table', name_value, region_value, phone_value, object_value);
    client.broadcast.emit('insert_client_data_to_table', name_value, region_value, phone_value, object_value);
  });


  //disconnect
  client.on('disconnect', function(){
    conn_num--;
  });
});


