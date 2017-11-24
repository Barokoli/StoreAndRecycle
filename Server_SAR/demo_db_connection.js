var mysql = require('mysql');

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
    if (err) throw err;
    console.log(result);
  });
});
