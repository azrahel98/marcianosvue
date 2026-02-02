import axios from 'axios'

const SERVER = 'https://azrahel98-apimarciano-58.deno.dev'

const api = axios.create({
  baseURL: SERVER,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('jwt')
  }
})

export { api }
