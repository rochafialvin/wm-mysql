const mysql = require('mysql')

const conn = mysql.createConnection({
   user: 'rochafi_teach',
   password: 'Mysql123',
   host: 'db4free.net',
   database: 'rochafi_bks',
   port: 3306
})

module.exports = conn