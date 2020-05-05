const conn = require('../config/mysql.js')
const router = require('express').Router()
const verifSendEmail = require('../config/verifSendEmail')
const bcrypt = require('bcrypt')
const validator = require('validator')

// REGISTER USER
router.post('/register', (req, res) => {
   // req.body = {username, name, email, password}

   // Query insert data
   const sql = `INSERT INTO users SET ?`
   const data = req.body

   // Chek format email
   // valid = true or false
   let valid = validator.isEmail(data.email)
   if(!valid) return res.send('Email tidak valid')

   // Hash password
   data.password = bcrypt.hashSync(data.password, 8)
   
   
   // Running query
   conn.query(sql, data, (err, result) => {
      // Jika ada error kita akan kirim object errornya
      if(err) return res.send(err)

      // Kirim email verifikasi
      verifSendEmail(data.name, data.email, result.insertId)

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

// LOGIN USER
router.post('/user/login', (req, res) => {

})

module.exports = router


