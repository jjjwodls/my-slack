import axios from 'axios';

const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then((response) => response.data);
//fetcher = (url : string) => {} 과 그냥 순수하게 리턴하는것은 다르다.
export default fetcher;
