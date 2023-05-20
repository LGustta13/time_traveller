import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://192.168.100.55:3333', // Antes tava localhost, alterado para o IP do PC pois no server foi colocado app.listen host 0.0.0.0
})
