const express = require('express')
const app = express()
const port = 2020

app.get('/', (req, res) => {
   res.send(`<h1>API Running at ${port}</h1>`)
})

app.listen(port, () => console.log(`API Running at ${port}`))