const mosca = require('mosca');
const socketIOclient = require('socket.io-client');
var mysql = require('mysql');

var http = require('http');

//json comm
var fs = require('fs');
var querystring = require('querystring');
var js_server = http.createServer(function (req, res) {
  fs.readFile('/tmp/data.json', function(err, data) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
}).listen(8080);

js_server.on('request', function (req, res) {
    if (req.method == 'POST') {
        var body = '';
    }

    req.on('data', function (data) {
      console.log("some data: " + data);
        body += data;
    });

    req.on('end', function () {
        var post = querystring.parse(body);
        //console.log(post);
				parse_post_data(post);
        //res.writeHead(200, {'Content-Type': 'text/plain'});
        //res.end('Hello World\n');
    });
});
//end json comm

const client = socketIOclient('http://balabanovo.westeurope.cloudapp.azure.com');
const server = new mosca.Server({
	port: 1883,
	backend: {
		type: 'memory'
	}
});

const location_mappings = {
	'00:16:25:12:16:4F': {
		1: 'Junction.2017.1',
		2: 'Junction.2017.2',
		3: 'Junction.2017.3',
		4: 'Junction.2017.4'
	}
};

var presences = new Map();

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

function emit_tag_event(event, location, tid) {
	console.log(`location/${location}/${event}: ${tid}`);
	server.publish({
		topic: `location/${location}/${event}`,
		payload: tid
	});
}

client.on('inventory', (msg) => {
	var mac_address = msg['macAddress'];
	if(!(mac_address in location_mappings)) return;

	var new_presences = new Map();

	for(let record of msg['orderedRecords']) {
		if(record['peak_rssi'] >= 0) continue;

		antenna_port = record['antenna_port'];
		let location = location_mappings[mac_address][antenna_port];
		let tid = record['tid'];
		if(!tid) continue;

		if(!(location in new_presences)) new_presences.set(location, new Set());
		let new_location_presences = new_presences.get(location);
		new_location_presences.add(tid);
	}

	var all_locations = new Set([...presences.keys(), ...new_presences.keys()]);
	for(let location of all_locations.values()) {
		let location_presences = presences.get(location) || new Set();
		let new_location_presences = new_presences.get(location) || new Set();

		for(let tid of new Set([...location_presences].filter(tid => !new_location_presences.has(tid)))) {
			emit_tag_event('tagLeft', location, tid);
			storage_action(location, tid);
		}
		for(let tid of new Set([...new_location_presences].filter(tid => !location_presences.has(tid)))) {
			emit_tag_event('tagEntered', location, tid);
			storage_action(location, tid);
		}
	}

	presences = new_presences;
});

var last_tag_read = "";
var registering_tag = -1;
var registered_tag_cb;

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Recycle"
});

function storage_action(t , m) {
  var tag = t.toString();
	console.log("storeaction:(" + t + "," + m + ")  last tag: " + last_tag_read + ";");

  if (tag == "Junction.2017.2" || tag == "Junction.2017.4") {
    return;
  }

  if (registering_tag > -1) {
    con.query("USE sys");
    con.query("UPDATE products SET `tag` = " + tag + " WHERE `idproducts` = '" + p_id + "' ", function (err, result, fields) {
      if (err) { throw err;}
    });

    registering_tag = -1;
    registered_tag_cb();
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
        if (last_tag_read == "") {
          last_tag_read = tag;
					return;
        } else if (last_tag_read != tag){
          if (tag == "Junction.2017.1") {
            console.log("Item left storage. first tag: " + last_tag_read + " second tag");
            update_db(tag, true);
						last_tag_read = "";
          } else {
            console.log("Item entered storage.");
            update_db(tag, false);
						last_tag_read = "";
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

function wait_for_tag(p_id) {
  console.log("Waiting for tag to be scanned.")
  registering_tag = p_id;
}

function parse_post_data(data) {
	if (data) {
		if (data.query) {
			con.query("USE sys");
		  con.query(data.query.toString(), function (err, result, fields) {
		    if (err) {
		      throw err;
		    }
		  });
		}
	}
}

var data_set;
var jsonfile = require('jsonfile');
var file = '/tmp/data.json'

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Recycle"
});

function refresh_ind (err) {
  if (err) throw err;
  con.query("USE sys");
  con.query("SELECT * FROM products", function (err, result, fields) {
    if (err) {
      throw err;
    } else {
      data_set = result;
      //console.log(result);
    }
    write_json();
  });
}


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("USE sys");
  con.query("SELECT * FROM products", function (err, result, fields) {
    if (err) {
      throw err;
    } else {
      data_set = result;
      //console.log(result);
    }
    write_json();
		setInterval(refresh_ind, 1000);
  });
});

function write_json() {
  jsonfile.writeFile(file, data_set, function (err) {
    //console.error(err)
  })
}
