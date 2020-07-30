import ky from 'ky';

const ApiUrl = 'https://www.placeholder.com/api';
const api = ky.create({ prefixUrl: ApiUrl });

export default api;
