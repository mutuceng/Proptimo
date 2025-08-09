import axios, { AxiosError, type AxiosResponse } from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
      const { data, status } = error.response as AxiosResponse;
      const errorMessage = data?.message || data?.title || "Bilinmeyen bir hata oluştu";
      const errorDetails = data?.errors || data?.detail || "";
      
      switch (status) {
        case 400:
          toast.error(`Hatalı istek: ${errorMessage} ${errorDetails ? `\nDetaylar: ${errorDetails}` : ''}`);
          break;
        case 401:
          toast.error(`Giriş yapmanız gerekiyor: ${errorMessage}`);
          break;
        case 403:
          toast.error(`Bu işlemi yapmaya yetkiniz yok: ${errorMessage}`);
          break;
        case 404:
          toast.error(`Kaynak bulunamadı: ${errorMessage}`);
          break;
        case 500:
          toast.error(`Sunucu hatası: ${errorMessage}`);
          break;
        default:
          toast.error(`Bilinmeyen bir hata: ${errorMessage}`);
      }
      return Promise.reject(error);
    }
  );

const queries = {

    getAll : (url: string) => 
        axios.get(url)
            .then( (response: AxiosResponse) => response.data),

    getWithParams: (url: string, params: any) =>
        axios.get(url, {params})
            .then( (response: AxiosResponse) => response.data),
    
    getById: (url: string, id: string) =>
        axios.get(`${url}/${id}`)
            .then( (response: AxiosResponse) => response.data),

    post: (url: string, body: {}) => 
        axios.post(url, body)
            .then((response: AxiosResponse) => response.data),

    put: (url: string, body: {}) => 
        axios.put(url, body)
            .then((response: AxiosResponse) => response.data),

    delete: (url: string, id: number) => 
        axios.delete(`${url}/${id}`)
            .then((response: AxiosResponse) => response.data),

}

const Currency = 
{
    createCurrency: async ( createCurrenyDto :{}) =>
    {
        try{
            const response = await queries.post("currency", createCurrenyDto);
            console.log("sendMessage yanıtı:", response);
        } catch (err) {
            throw err;
        }
    },

    getAllCurrencies : async () =>
    {
        await queries.getAll("currency");
    }

}


const requests = 
{
    Currency
}

export default requests;