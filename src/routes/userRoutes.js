const conn = require('../config/mysql.js')
const router = require('express').Router()
const verifSendEmail = require('../config/verifSendEmail')
const bcrypt = require('bcrypt')
const validator = require('validator')
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')


const upload = multer({
   limits: {
       fileSize: 10000000 // Byte , default 1MB
   },
   fileFilter(req, file, cb) {
       if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ // will be error if the extension name is not one of these
           return cb(new Error('Please upload image file (jpg, jpeg, or png)')) 
       }

       cb(undefined, true)
   }
})

const filesDirectory = path.join(__dirname, '../files')

// UPLOAD AVATAR
router.post('/user/avatar', upload.single('avatar'), async (req, res) => {

   try {
      // const fileName = `${req.body.username}-avatar.png`
      // const sql = `UPDATE users SET avatar = '${avatar}' WHERE username = '${req.body.username}'`

      const fileName = `${req.body.username}-avatar.png`
      const sql = `UPDATE users SET avatar = ? WHERE username = ?`
      const data = [fileName, req.body.username]

      // Menyimpan foto di folder
      await sharp(req.file.buffer).resize(300).png().toFile(`${filesDirectory}/${fileName}`)

      // Simpan nama avata di kolom 'avatar'
      conn.query(sql, data, (err, result) => {
         // Jika ada error saat running sql
         if(err) return res.send(err)

         // Simpan nama fotonya di database
         res.send({ message: 'Berhasil di upload' })
      })

      
   } catch (err) {
      res.send(err.message)
   }

}, (err, req, res, next) => {
   // Jika terdapat masalah terhadap multer, kita akan kirimkan error
   res.send(err)
})

// GET AVATAR
router.get('/user/avatar/:username', (req, res) => {
   // Menyimpan username pada variable
   const username = req.params.username

   // Cari nama file di database
   const sql = `SELECT avatar FROM users WHERE username = '${username}'`

   // Kirim file ke client
   conn.query(sql, (err, result) => {

      // Jika ada error saat running sql
      if(err) return res.send(err)

      // Nama file avatar
      const fileName = result[0].avatar
      // Object options yang menentukan dimana letak avatar disimpan
      const options = {
         root: filesDirectory
      }

      // Mengirim file sebagai respon
      res.sendFile(fileName, options, (err) => {
         // Mengirim object error jika terjadi masalah
         if(err) return res.send(err)

         console.log('berhasil terkirim')
      })
   })
})


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


