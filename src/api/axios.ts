import axios from 'axios'

const SERVER = 'https://api.odeploy.work'

const api = axios.create({
  baseURL: SERVER,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('jwt')
  }
})

export { api }
