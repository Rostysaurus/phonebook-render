require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body.content) : '')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const getPersonsCount = (persons) => persons.length === 1 ? `${persons.length} person` : `${persons.length} people`

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (request, response) => {
  Person.find({})
    .then(people => {
      const now = new Date()
      return response.send(`<h3>Phonebook has info for ${getPersonsCount(people)}</h3><h3>${now}</h3>`)
    })
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(people => {
      response.json(people)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  if (!request.body) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const { name, number } = request.body

  const person = new Person({
    name,
    number,
  })
  person.save()
    .then(newPerson => {
      response.json(newPerson)
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  if (!request.body) {
    return response.status(400).json({ error: 'name or number missing' })
  }
  const { name, number } = request.body
  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save()
        .then(newPerson => {
          response.json(newPerson)
        })
    })
    .catch(error => next(error))
})


app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
