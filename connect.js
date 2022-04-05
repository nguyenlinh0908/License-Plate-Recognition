window.$ = window.jQuery = require('jquery');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : null,
    database : 'csdl_nckh' 
});