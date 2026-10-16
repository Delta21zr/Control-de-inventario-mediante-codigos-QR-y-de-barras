import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiResponse } from '../models/api-response.model';

const BASE_URL_KEY = 'api_base_url';
const DEFAULT_BASE_URL = 'http://192.168.1.75/inventario-qr/api';

/**
 * Servicio centralizado de Axios.
 * La URL base se guarda en localStorage y se configura desde la pantalla de Configuración.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private axiosClient!: AxiosInstance;
  private currentBaseUrl = '';

  constructor() {
    this.currentBaseUrl = localStorage.getItem(BASE_URL_KEY) || DEFAULT_BASE_URL;
    this.createAxiosInstance();
  }

  private createAxiosInstance(): void {
    this.axiosClient = axios.create({
      baseURL: this.currentBaseUrl,
      timeout: 12000, // 12 segundos
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  /** Normaliza la URL (sin espacios ni diagonales finales). */
  public normalizeUrl(url: string): string {
    return url.trim().replace(/\/+$/, '');
  }

  /** Establece una nueva URL base y la persiste en localStorage. */
  public setBaseUrl(url: string): void {
    this.currentBaseUrl = this.normalizeUrl(url);
    localStorage.setItem(BASE_URL_KEY, this.currentBaseUrl);
    this.createAxiosInstance();
  }

  public getBaseUrl(): string {
    return this.currentBaseUrl;
  }

  public async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosClient.get<T>(endpoint, config);
    return response.data;
  }

  public async postJson<T>(endpoint: string, payload: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosClient.post<T>(endpoint, payload, config);
    return response.data;
  }

  /**
   * Prueba health.php contra una URL SIN guardarla todavía.
   * Lanza el error de Axios si el servidor no responde.
   */
  public async checkHealth(baseUrl: string): Promise<ApiResponse<{ php: string; mysql: string }>> {
    const response = await axios.get<ApiResponse<{ php: string; mysql: string }>>(
      `${this.normalizeUrl(baseUrl)}/health.php`,
      { timeout: 8000 },
    );
    return response.data;
  }

  /** Convierte errores de Axios o JS en un mensaje legible: método, URL, estado HTTP y detalle. */
  public explainError(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const metodo = (error.config?.method || 'GET').toUpperCase();
      const url = `${error.config?.baseURL ?? ''}/${error.config?.url ?? ''}`.replace(/([^:])\/\/+/g, '$1/');

      // 1. El servidor respondió con un código fuera del rango 2xx
      if (error.response) {
        const data = error.response.data as { error?: string; message?: string } | undefined;
        const detalle = data?.error || data?.message || error.message;
        return `${metodo} ${url} | HTTP ${error.response.status} | ${detalle}`;
      }

      // 2. Se envió la petición pero no hubo respuesta (timeout / servidor apagado / IP incorrecta)
      if (error.request) {
        return `${metodo} ${url} | Sin respuesta (timeout o servidor no disponible). Revisa la IP en Configuración y que XAMPP esté activo.`;
      }

      return `Error de Axios: ${error.message}`;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Ocurrió un error desconocido.';
  }
}
