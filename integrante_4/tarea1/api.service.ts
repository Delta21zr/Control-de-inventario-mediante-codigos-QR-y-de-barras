import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const BASE_URL_KEY = 'api_base_url';
const DEFAULT_BASE_URL = 'http://192.168.1.75/inventarioqr/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private axiosClient!: AxiosInstance;
  private currentBaseUrl: string = '';

  constructor() {
    this.initBaseUrl();
  }

  /**
   * Inicializa la URL base leyendo de localStorage o usando el valor por defecto.
   */
  private initBaseUrl(): void {
    const savedUrl = localStorage.getItem(BASE_URL_KEY);
    this.currentBaseUrl = savedUrl ? savedUrl : DEFAULT_BASE_URL;
    this.createAxiosInstance();
  }

  /**
   * Crea o reconfigura la instancia de Axios con la URL base actual.
   */
  private createAxiosInstance(): void {
    this.axiosClient = axios.create({
      baseURL: this.currentBaseUrl,
      timeout: 12000, // Timeout de 12 segundos
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Establece una nueva URL base y la persiste en localStorage.
   */
  public setBaseUrl(url: string): void {
    // Normalizar quitando la barra final si existe
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    this.currentBaseUrl = cleanUrl;
    localStorage.setItem(BASE_URL_KEY, cleanUrl);
    this.createAxiosInstance();
  }

  /**
   * Obtiene la URL base actualmente configurada.
   */
  public getBaseUrl(): string {
    return this.currentBaseUrl;
  }

  /**
   * Realiza una petición GET tipada.
   */
  public async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosClient.get<T>(endpoint, config);
    return response.data;
  }

  /**
   * Realiza una petición POST enviando un payload en JSON.
   */
  public async postJson<T>(endpoint: string, payload: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosClient.post<T>(endpoint, payload, config);
    return response.data;
  }

  /**
   * Formatea errores de Axios o JS genéricos a un mensaje explicativo y legible.
   */
  public explainError(error: unknown): string {
    if (axios.isAxiosError(error)) {
      // 1. El servidor respondió con un código de estado fuera del rango 2xx
      if (error.response) {
        const status = error.response.status;
        const url = error.config?.url || 'endpoint desconocido';
        const apiMessage = error.response.data?.error || error.response.data?.message || error.message;

        return `HTTP ${status} | ${url} | ${apiMessage}`;
      }

      // 2. La petición fue realizada pero no se recibió respuesta (Timeout / Servidor no disponible)
      if (error.request) {
        return `Error de conexión (HTTP 503 / Timeout). Servidor no disponible en ${this.getBaseUrl()}`;
      }

      // 3. Ocurrió un error al configurar la petición de Axios
      return `Error de Axios: ${error.message}`;
    }

    // 4. Errores genéricos JavaScript
    if (error instanceof Error) {
      return error.message;
    }

    return 'Ocurrió un error desconocido.';
  }
}