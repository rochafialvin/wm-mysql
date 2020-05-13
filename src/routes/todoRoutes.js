const conn = require('../config/database')
const router = require('express').Router()
const auth = require('../config/auth')

// Create todo
router.post('/todo', auth, (req, res) => {
   // req.body = {description}

   const sql = `INSERT INTO todos SET ?`
   const data = { user_id : req.user.id , description : req.body.description}

   conn.query(sql, data, (err, result) => {
      // Jika terjadi masalah ketika running sql nya.
      if(err) return res.send(err.sqlMessage)

      res.send({
         message : 'Todo baru berhasil dibuat',
         id : result.insertId
      })
   })
})


// Read all todo
router.get('/todo', auth, (req, res) => {
   const sql = `SELECT * FROM todos WHERE user_id = ?`
   const data = req.user.id

   conn.query(sql, data, (err, result) => {
      if(err) return res.send(err.sqlMessage)

      res.send(result)
   })
})

// Update todo
router.patch('/todo/:todoid', auth, (req, res) => {
   const sql = `UPDATE todos SET ? WHERE id = ? AND user_id = ?`
   // Jika menggunakan tanda tanya (escape query) lebih dari satu, variable 'data' harus berupa array
   // Dimana array tersebut berisi data yang akan me-replace tanda tanya yang ada. Urutan itu diperhitungkan
   const data = [req.body, req.params.todoid, req.user.id]

   conn.query(sql, data, (err, result) => {
      if(err) return res.send(err.sqlMessage)

      res.send({
         message: "Todo berhasil di update"
      })
   })
})

// Delete todo
router.delete('/todo/:todoid', auth, (req, res) => {
   const sql = `DELETE FROM todos WHERE id = ? AND user_id = ?`
   const data = [req.params.todoid, req.user.id]

   conn.query(sql, data, (err, result) => {
      if(err) return res.send(err.sqlMessage)

      res.send({
         message: "Todo berhasil di hapus"
      })
   })
})


module.exports = router