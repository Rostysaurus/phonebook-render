import {useEffect, useState} from 'react'
import PersonForm from "./components/PersonForm.jsx";
import Persons from "./components/Persons.jsx";
import Filter from "./components/Filter.jsx";
import personsService from "./services/persons"
import Notification from "./components/Notification.jsx";

const newPersonInitState = {
    name: '',
    number: '',
}

const App = () => {
    const [persons, setPersons] = useState(null)
    const [newPerson, setNewPerson] = useState(newPersonInitState)
    const [filter, setFilter] = useState('')
    const [message, setMessage] = useState(null)

    const personsToShow = filter ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())) : persons

    useEffect(() => {
        personsService.getAll()
            .then(initPersons => {
                console.log('initPersons', initPersons)
                setPersons(initPersons)
            })
    }, [])

    const triggerMessage = ({text, type}) => {
        setMessage({text, type})
        setTimeout(() => setMessage(null), 5000)
    }

    const handleChange = (e) => {
        console.log(e.target.value);
        setNewPerson({
            ...newPerson,
            [e.target.name]: e.target.value
        })
    }

    const addNewPerson = (e) => {
        e.preventDefault();
        console.log(newPerson);
        const existingPerson = persons.find(person => person.name === newPerson.name)
        if (existingPerson) {
            if (window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with the new one?`))
                personsService.update(existingPerson.id, {...existingPerson, number: newPerson.number})
                    .then((updatedPerson) => {
                        triggerMessage({
                            text: `New number: ${updatedPerson.number} added for ${newPerson.name}`,
                            type: 'success',
                        })
                        setTimeout(() => setMessage(null), 5000)
                        setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person))
                    })
                    .catch(err => {
                        console.log(err)
                        triggerMessage({
                            text: `the person ${existingPerson.name} was already deleted from server`,
                            type: 'error',
                        })
                        setPersons(persons.filter(person => person.id !== existingPerson.id))
                    });

            return
        }
        personsService.create(newPerson)
            .then(addedPerson => {
                triggerMessage({
                    text: `New person: ${newPerson.name} added to phonebook`,
                    type: 'success',
                })
                setPersons([
                    ...persons,
                    addedPerson
                ])
                setNewPerson(newPersonInitState)
            })
            .catch(err => console.log(err));
    }

    const handleFilterChange = (e) => {
        console.log(e.target.value)
        setFilter(e.target.value)
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            personsService.remove(id)
                .then(deletedPerson => {
                    triggerMessage({
                        text: `Deleted: ${deletedPerson.id}`,
                        type: 'success',
                    })
                    setPersons(persons.filter(person => person.id !== deletedPerson.id))
                })
                .catch(err => {
                    console.log(err)
                    const existingPerson = persons.find(person => person.id === id)
                    triggerMessage({
                        text: `the person ${existingPerson.name} was already deleted from server`,
                        type: 'error',
                    })
                    setPersons(persons.filter(person => person.id !== existingPerson.id))
                });
        }
    }

    if (!persons) {
        console.log('Initial render: No persons found')
        return null
    }

    return (
        <div>
            <Notification message={message}/>
            <h2>Phonebook</h2>
            <Filter
                value={filter}
                label='filter shown with'
                onChange={handleFilterChange}
            />
            <h2>add a new</h2>
            <PersonForm
                newPerson={newPerson}
                onChange={handleChange}
                onSubmit={addNewPerson}
            />
            <h2>Numbers</h2>
            <Persons
                persons={personsToShow}
                onDelete={handleDelete}
            />
        </div>
    )
}

export default App
