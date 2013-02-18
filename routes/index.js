
/*
 * GET home page.
 */
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  charset: 'utf8',
  database: 'phone_system'
});

exports.index = function(req, res){
//  res.render('index', { title: 'Express' });

  var sql = 'SELECT * FROM phone_log';
  connection.query(sql, function(err, rows, fields){
    if (err) throw err;
    res.render('index', {datas: rows});
  });
};

exports.send_data = function(req, res){
  var name = req.body.names;
  var phone = req.body.phone;
  var region = req.body.region;
  var content = req.body.contents;
  var object = req.body.objects;
  var time = req.body.times;
  var statuss = req.body.statuss;

  var sql = 'INSERT INTO phone_log (name, phone, region, content, object, time, status) VALUES ("'
        +name+'", "'+phone+'", "'+region+'", "'+content+'", "'+object+'", "'+time+'", "'+statuss+'")';
  connection.query(sql, function(err, rows, fields){
    if (err) throw err;
    console.log('This solution is:', rows);
  });
};