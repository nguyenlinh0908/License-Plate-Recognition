window.$ = window.jQuery = require("jquery");
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: null,
  database: "db_nckh",
});
connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected to your database");
});
