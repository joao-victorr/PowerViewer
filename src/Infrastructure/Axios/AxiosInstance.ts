// src/Infrastructure/Http/axiosInstance.ts

import { AppError } from 'Domain/Errors/AppErrors';
import axios from 'axios';

export const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      console.error('Erro de requisição Axios:', error.response?.data || error.message);

      let errorMessage = 'Ocorreu um erro desconhecido na requisição externa.';
      let errorCode = 500;

      if (error.response) {
        errorMessage = error.response.data?.error_description || error.response.data?.error || error.message;
        errorCode = error.response.status;
      } else if (error.request) {
        errorMessage = 'Nenhuma resposta foi recebida do servidor externo.';
        errorCode = 503;
      } else {
        errorMessage = error.message;
      }

      throw new AppError(`Falha na comunicação externa: ${errorMessage}`, errorCode);
    }
    return Promise.reject(error); // Rejeita qualquer outro tipo de erro
  }
);
