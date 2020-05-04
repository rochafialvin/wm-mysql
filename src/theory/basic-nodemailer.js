const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

const verifSendEmail = () => {
   // Config
   const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth : {
         type: 'OAuth2',
         user: 'rochafi.teach@gmail.com',
         clientId : process.env.CLIENT_ID,
         clientSecret : process.env.CLIENT_SECRET,
         refreshToken : process.env.REFRESH_TOKEN
      }
   })

   // Mail
   const mail = {
      from : 'Rochafi Teach <rochafi.teach@gmail.com',
      to: 'rochafi.dev@gmail.com',
      subject: 'Testing Nodemailer',
      html: '<h1>Alhamdulillah berhasil</h1>'
   }

   // Send Email
   transporter.sendMail(mail, (err, result) => {
      if(err) return console.log({errornich: err.message})

      console.log('Email terkirim')
   })
}

module.exports = verifSendEmail