const express = require('express')
const cors = require('cors')
const app = express()
const port = 2020

// Routes
const userRouter = require('./routes/userRoutes')
const todoRouter = require('./routes/todoRoutes')

app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(todoRouter)


app.get('/', (req, res) => {
   res.send(`<h1>API Running at ${port}</h1>`)
})

// T O M B O L   A J A I B

// GET
app.get('/tombolget/:tombolid', (req, res) => {
   res.send({
      // Auth Token
      authorization : req.header('Authorization'),
      // { username : "Karen" } 
      query : req.query,
      // { tombolid : 15 }                           
      params: req.params                          
   })
})

// POST
app.post('/tombolget/:tombolid', (req, res) => {
   res.send({
      // Auth Token
      authorization : req.header('Authorization'),
      // { username : "Karen" } 
      query : req.query,
      // { tombolid : 15 }                           
      params: req.params,
      // { description : "Winter Soldier" }
      body: req.body                          
   })
})

// PATCH
app.patch('/tombolget/:tombolid', (req, res) => {
   res.send({
      // Auth Token
      authorization : req.header('Authorization'),
      // { username : "Karen" } 
      query : req.query,
      // { tombolid : 15 }                           
      params: req.params,
      // { description : "Winter Soldier" }
      body: req.body                          
   })
})

// DELETE
app.delete('/tombolget/:tombolid', (req, res) => {
   res.send({
      // Auth Token
      authorization : req.header('Authorization'),
      // { username : "Karen" } 
      query : req.query,
      // { tombolid : 15 }                           
      params: req.params,
      // { description : "Winter Soldier" }
      body: req.body                          
   })
})

// STATUS
app.get('/status', (req, res) => {
   // 2xx
   // res.status(200).send({ message : 'Berhasil' })

   // 4xx / 3xx
   res.status(404).send({ message : 'Gagal' })
})










app.listen(port, () => console.log(`API Running at ${port}`))