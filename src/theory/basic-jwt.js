const jwt = require('jsonwebtoken')

let basicJwt = () => {
   let token = jwt.sign({ id: 20 }, 'fresh-rain890')
   console.log(token)

   let decoded = jwt.verify(token, 'fresh-rain890')
   console.log(decoded)

   let tokenCreated = new Date(decoded.iat * 1000)
   console.log(`${tokenCreated.getHours()} : ${tokenCreated.getMinutes()}`)
}

basicJwt()