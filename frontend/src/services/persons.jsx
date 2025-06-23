import axios from "axios";

const baseUrl = 'api/persons'
const getPersonUrl = id => `${baseUrl}/${id}`

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = (newPerson) => {
    const request = axios.post(baseUrl, newPerson)
    return request.then(response => response.data)
}

const update = (id, updatedPerson) => {
    const request = axios.put(getPersonUrl(id), updatedPerson)
    return request.then(response => response.data)
}

const remove = (id) => {
    const request = axios.delete(getPersonUrl(id))
    return request.then(response => response.data)
}

export default {getAll, create, update, remove}
