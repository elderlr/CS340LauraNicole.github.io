var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_stroikn',
  password        : '0904',
  database        : 'cs340_stroikn'
});
module.exports.pool = pool;
