import axios from 'axios'

const SERVER = 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: SERVER,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('jwt')
  }
})

export { api }
