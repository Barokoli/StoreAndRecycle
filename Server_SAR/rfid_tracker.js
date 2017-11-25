var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://mqtt.intelligentpackaging.online');
var mysql = require('mysql');
var last_tag_read = "";

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Recycle"
});

client.on('connect', function () {
  client.subscribe('location/Junction.2017.1/+');
  //client.subscribe('location/Junction.2017.2/+');
  client.subscribe('location/Junction.2017.3/+');
  //client.subscribe('location/Junction.2017.4/+');
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic.toString() + "  " + message.toString());
  storage_action(topic, message);
})

function storage_action(t , m) {
  var tag = t.toString().split("/")[1];
  if (tag == "Junction.2017.2" || tag == "Junction.2017.4") {
    return;
  }
  /*con.connect(function(err) {
    if (err) {
      throw err;
    };*/
    con.query("USE sys");
    con.query("SELECT * FROM products WHERE `tag` = '" + m.toString() + "' ", function (err, result, fields) {
      if (err) {
        throw err;
      }
      if (result.length > 0) {
        if (last_tag_read = "") {
          last_tag_read = tag;
        } else if (last_tag_read != tag){
          if (tag == "Junction.2017.1") {
            console.log("Item left storage. first tag: " + last_tag_read + " second tag");
            update_db(tag, true);
          } else {
            console.log("Item entered storage.");
            update_db(tag, false);
          }
        }
      } else {
        console.log("Unregistered RFID tag moved in the storage area.");
      }
    });
  //});
}

function update_db(t, went_in) {
  console.log("update db!");
  con.query("USE sys");
  con.query("UPDATE products SET `in_store` = " + went_in + " WHERE `tag` = '" + t + "' ", function (err, result, fields) {
    if (err) {
      throw err;
    }
  });
}
