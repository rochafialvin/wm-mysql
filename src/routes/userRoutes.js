const conn = require('../config/mysql.js')
const router = require('express').Router()
const verifSendEmail = require('../config/verifSendEmail')

// REGISTER USER
router.post('/register', (req, res) => {
   const {username, name, email, password} = req.body
   // Query insert data
   const sql = `INSERT INTO users(username, name, email, password) VALUES ('${username}', '${name}', '${email}', '${password}')`


   // Running query
   conn.query(sql, (err, result) => {
      // Jika ada error kita akan kirim object errornya
      if(err) return res.send(err)

      // Kirim email verifikasi
      verifSendEmail(name, email, result.insertId)

      // Jika berhasil, kirim object
      res.send({
         message: 'Register berhasil'
      })

   })

})

// VERIFY EMAIL
router.get('/verify/:userid', (req, res) => {
   const sql = `UPDATE users SET verified = true WHERE id = ${req.params.userid}`

   conn.query(sql, (err, result) => {
      if(err) return res.send(err.sqlMessage)

      res.send('<h1>Verikasi Berhasil</h1>')
   })
})

module.exports = router


