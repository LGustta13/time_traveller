import axios from 'axios'

export const api = axios.create({
    // baseURL: "http://localhost:3333" funciona somente para IOS
    baseURL: 'http://192.168.100.55:3333', // Dessa forma, colocando o endereço do computador, para Androdi funciona
})
