var db_json;
var current_item;

var ip = "http://10.100.34.207";

function init_db() {
  request_db();
  setInterval(request_db, 1000);
}

function request_db() {
  $.getJSON( ip + ":8080/", {} )
    .done(function( json ) {
      db_json = json;
      console.log( "JSON Data: " + json[0].title );

      var cnt = 0;
      console.log("dblength " + db_json.length);
      for(var i = 0; i < db_json.length; i++) {
        if (db_json[i].in_store) {
          cnt ++;
        }
      }
      $('#storage_counter').text(cnt + "");

      current_item = db_json[db_json.length - 1].idproducts + 1;
    })
    .fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      console.log( "Request Failed: " + err );
  });
}

function set_next_rfid() {
  $.post( ip + ":8080/", { query: 'SETNEXT' } );
}

function update_db(id, field, data) {
  var q = 'UPDATE products SET `'+field+'` = "'+data+'" WHERE `idproducts` = "'+id+'"';
  $.post( ip + ":8080/", { query: q } );
}
