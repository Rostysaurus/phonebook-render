require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()


app.use(express.static('dist'))

morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body.content) : '')

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())

app.get('/api/persons', (request, response) => {
  Person.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
 Person.deleteOne({_id: request.params.id}).then(person => {
   response.json(person)
 })
})

app.post('/api/persons', (request, response) => {
  if (!request.body) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const {name, number} = request.body

  const person = new Person({
    name,
    number,
  })

  person.save().then(newPerson => {
    response.json(newPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
