var mysql = require('mysql');
var jsonfile = require('jsonfile');
var file = '/tmp/data.json'
var data;

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Recycle"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("USE sys");
  con.query("SELECT * FROM products", function (err, result, fields) {
    if (err) {
      throw err;
    } else {
      data = result;
      //console.log(result);
    }
    write_json();
  });
});

function write_json() {
  //var obj = {name: 'JP'}

  jsonfile.writeFile(file, data, function (err) {
    console.error(err)
  })
}
