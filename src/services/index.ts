import ky from 'ky';

// since dotenv and process its not working
const ApiUrl = process.env.REACT_APP_API_URL || 'http://192.168.100.24:8000';
const api = ky.create({ prefixUrl: ApiUrl });

export default api;
