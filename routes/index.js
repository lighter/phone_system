
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

var now   = new Date();
var year  = now.getFullYear();
var month = now.getMonth()+1;
var date  = now.getDate();
var today = year+"-"+month+"-"+date;

exports.index = function(req, res){
  //  res.render('index', { title: 'Express' });

  var sql = 'SELECT * FROM phone_log WHERE CAST(time AS DATE) = "'+today+'"',
      sql_object0 = 'SELECT COUNT(*) AS num FROM phone_log WHERE object = 0',
      sql_object1 = 'SELECT COUNT(*) AS num FROM phone_log WHERE object = 1',
      sql_object2 = 'SELECT COUNT(*) AS num FROM phone_log WHERE object = 2',
      data_rows = '',
      object0 = '',
      object1 = '',
      object2 = '';
  connection.query(sql_object0, function(err, rows, fields){
    if (err) throw err;
    object0 = rows[0];  //get the data from array 0
  });
  connection.query(sql_object1, function(err, rows, fields){
    if (err) throw err;
    object1 = rows[0];
  });
  connection.query(sql_object2, function(err, rows, fields){
    if (err) throw err;
    object2 = rows[0];
  });
  connection.query(sql, function(err, rows, fields){
    if (err) throw err;
    res.render('index', {
      datas: rows,
      obj0: object0.num, //get thd num form array 0, and use the fields name to get the value
      obj1: object1.num,
      obj2: object2.num
    });
  });
};

exports.send_data = function(req, res){
  var name    = req.body.names;
  var phone   = req.body.phone;
  var region  = req.body.region;
  var content = req.body.contents;
  var object  = req.body.objects;
  var time    = req.body.times;
  var statuss = req.body.statuss;
  var sql = 'INSERT INTO phone_log (name, phone, region, content, object, time, status) VALUES ("'
        +name+'", "'+phone+'", "'+region+'", "'+content+'", "'+object+'", "'+time+'", "'+statuss+'")';
  connection.query(sql, function(err, rows, fields){
    if (err) throw err;
    // console.log('This solution is:', rows);

    // if sql inert success send 'ok'
    res.send('ok');
  });
};

//update status
exports.update_data = function(req, res){
  var data_id = req.body.data_id;
  var status  = req.body.status;
  if(status == '0') {
    var sql = "UPDATE phone_log SET status = '1' WHERE id = '" + data_id + "'";
  } else {
    var sql = "UPDATE phone_log SET status = '0' WHERE id = '" + data_id + "'";
  }
  connection.query(sql, function(err, rows, fields){
    if(err) throw err;
    res.send('ok');
  });
}