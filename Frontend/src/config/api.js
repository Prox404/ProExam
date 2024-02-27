import axios from 'axios'
export default axios.create({
    baseURL: 'http://localhost:8080',
    headers: { 'ngrok-skip-browser-warning': 'true',
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Allow-Origin": "*",}
})