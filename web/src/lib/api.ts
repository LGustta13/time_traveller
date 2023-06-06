import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.BASE_URL
    ? process.env.BASE_URL
    : 'http://192.168.100.55:3333', // Antes tava localhost
})
