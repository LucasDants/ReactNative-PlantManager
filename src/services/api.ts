import axios from 'axios';

const api = axios.create({
  baseURL: 'http://ipv4:3333',
});

export default api;

//simular api com arquivos JSON
// json-server ./src/services/server.json --host ipv4 --port 3333
