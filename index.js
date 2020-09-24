const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

const jwtSecret = 'jinsuSang'
const tokenBox = []
const breads = ['chocolate', 'muffin', 'milk']

app.get('/bakery', (req, res) => {
  const token = jwt.sign({ bakery: 'cookie' }, jwtSecret)
  tokenBox.push(token)
  console.log(tokenBox)
  res.cookie('token', token, { maxAge: new Date(Date.now() + 90000), httpOnly: true });
  res.send({})
})

const auth = (req, res, next) => {
  try {
    const token = req.cookies['token']
    // const decoded = jwt.verify(token, jwtSecret)
    if (!tokenBox.includes(token)) {
      throw new Error()
    }
    next()
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' })
  }
}

app.get('/breads', auth, (req, res) => {
  res.status(200).send(breads)
})

app.post('/newBread', auth, (req, res) => {
  const { newBread } = req.body
  breads.push(newBread)
  res.status(200).send()
})

app.listen(3001, () => {
  console.log('Port 3001 Server is running')
})