const conn = require('../config/mysql.js')
const router = require('express').Router()

// Create todo
router.post('/user/todo', (req, res) => {
   // req.body = {user_id, description}

   const sql = `INSERT INTO todos SET ?`
   const data = req.body

   conn.query(sql, data, (err, result) => {
      // Jika terjadi masalah ketika running sql nya.
      if(err) return res.send(err.sqlMessage)

      res.send({
         message : 'Todo baru berhasil dibuat',
         id : result.insertId
      })
   })
})

// Exercise
// Read todo

// Update todo
router.patch('/user/todo/:todoid', (req, res) => {
   const sql = `UPDATE todos SET ? WHERE id = ?`
   // Jika menggunakan tanda tanya (escape query) lebih dari satu, variable 'data' harus berupa array
   // Dimana array tersebut berisi data yang akan me-replace tanda tanya yang ada. Urutan itu diperhitungkan
   const data = [req.body, req.params.todoid]

   conn.query(sql, data, (err, result) => {
      if(err) return res.send(err.sqlMessage)

      res.send({
         message: "Todo berhasil di update"
      })
   })
})

// Delete todo
router.delete('/user/todo/:todoid', (req, res) => {
   const sql = `DELETE FROM todos WHERE id = ?`
   const data = req.params.todoid

   conn.query(sql, data, (err, result) => {
      if(err) return res.send(err.sqlMessage)

      res.send({
         message: "Todo berhasil di hapus"
      })
   })
})


module.exports = router