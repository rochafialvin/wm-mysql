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
   const {username, password} = req.body

   const sql = `SELECT * FROM users WHERE username = '${username}'`

   conn.query(sql, (err, result) => {
      // Cek error
      if(err) return res.send(err)

      // result = [ {} ]
      let user = result[0]
      // Jika username tidak ditemukan
      if(!user) return res.send('username tidak ditemukan')
      // Verifikasi password
      let validPassword = bcrypt.compareSync(password, user.password)
      // Jika user memasukkan password yang salah
      if(!validPassword) return res.send('password tidak valid')
      // Verikasi status verified
      if(!user.verified) return res.send('Anda belum terverifikasi')

      // Menghapus beberapa property
      delete user.password
      delete user.avatar
      delete user.verified

      res.send({
         message: 'Login berhasil',
         user
      })

   })
})

module.exports = router


