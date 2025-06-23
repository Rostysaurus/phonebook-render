const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.static('dist'))

morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body.content) : '')

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

const getPersonsCount = () => persons.length === 1 ? `${persons.length} person` : `${persons.length} people`

app.get('/info', (request, response) => {
  const now = new Date();
  return response.send(`<h3>Phonebook has info for ${getPersonsCount()}</h3><h3>${now}</h3>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const foundPerson = persons.find(person => person.id === id)

  if (foundPerson) {
    response.json(foundPerson)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.send(204).end()
})

app.post('/api/persons', (request, response) => {
  const newPerson = request.body.content
  if (!newPerson) {
    return response.status(400).json({
      error: 'content is missing'
    })
  }
  const {name, number} = newPerson

  if (!name || !number) {
    let error = ''
    if (!name && !number) {
      error = 'name and number are required'
    } else if (!name) {
      error = 'name is required'
    } else if (!number) {
      error = 'number is required'
    }
    return response.status(400).json({
      error
    })
  }

  const existingPerson = persons.find(person => person.name === newPerson.name)

  if (existingPerson) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  newPerson.id = String(maxId + 1)
  persons.concat(newPerson)

  response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
