var db_json;
var current_item;

var ip = "http://10.100.34.207";

function init_db() {
  request_db();
}

function request_db() {
  $.getJSON( ip + ":8080/", {} )
    .done(function( json ) {
      db_json = json;
      console.log( "JSON Data: " + json[0].title );
    })
    .fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      console.log( "Request Failed: " + err );
  });

  current_item = db_json[db_json.length - 1].idproducts + 1;
}

function set_next_rfid() {
  $.post( ip + ":8080/", { query: 'SETNEXT' } );
}

function update_db(id, field, data) {
  var q = 'UPDATE products SET `'+field+'` = "'+data+'" WHERE `idproducts` = "'+id+'"';
  $.post( ip + ":8080/", { query: q } );
}
