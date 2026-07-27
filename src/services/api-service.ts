import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import JwtService from '@/services/jwt-service'
import { convertCamelToSnake, convertSnakeToCamel } from '@/utils/case-converter'

export default class ApiService {
  public static init(): void {
    ApiService.setDefaultConfig()
    ApiService.setDefaultHeaders()
    ApiService.setInterceptor()
  }

  public static async get<Request = unknown, Response = unknown>(
    url: string,
    params?: Request,
    config?: AxiosRequestConfig,
  ): Promise<Response> {
    return axios.get(url, { params, ...config })
  }

  public static async post<Request = unknown, Response = unknown>(
    url: string,
    data?: Request,
    config?: AxiosRequestConfig,
  ): Promise<Response> {
    return axios.post(url, data, config)
  }

  public static async put<Request = unknown, Response = unknown>(
    url: string,
    data?: Request,
    config?: AxiosRequestConfig,
  ): Promise<Response> {
    return axios.put(url, data, config)
  }

  public static async patch<Request = unknown, Response = unknown>(
    url: string,
    data?: Request,
    config?: AxiosRequestConfig,
  ): Promise<Response> {
    return axios.patch(url, data, config)
  }

  public static async delete<Response = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<Response> {
    return axios.delete(url, config)
  }

  private static setDefaultHeaders(): void {
    axios.defaults.headers.common['Accept'] = 'application/json'
    axios.defaults.headers.common['Content-Type'] = 'application/json'
    axios.defaults.withCredentials = true
  }

  private static setDefaultConfig(): void {
    const baseUrl = import.meta.env.VITE_APP_API_URL
    if (!baseUrl) {
      throw new Error('VITE_APP_API_URL is not set')
    }
    axios.defaults.baseURL = baseUrl
  }

  private static setInterceptor(): void {
    axios.interceptors.request.use(
      (config) => {
        const token = JwtService.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        const isFormData = config.data instanceof FormData
        config.headers.Accept = 'application/json'

        if (!isFormData) {
          config.headers['Content-Type'] = 'application/json'
        } else {
          delete config.headers['Content-Type']
        }

        if (config.data && !isFormData) {
          config.data = convertCamelToSnake(config.data)
        }
        if (config.params) {
          config.params = convertCamelToSnake(config.params)
        }

        return config
      },
      (error) => Promise.reject(error),
    )

    axios.interceptors.response.use(
      (response: AxiosResponse) => {
        if (response.data) {
          response.data = convertSnakeToCamel(response.data)
        }

        if (response.status >= 200 && response.status < 300) {
          return Promise.resolve(response.data)
        }

        return Promise.reject(response.data)
      },
      async (error) => {
        if (error.response) {
          const { status } = error.response

          if (status === 401) {
            const { setUnauthenticated } = useAuthStore()
            await setUnauthenticated()
            await router.push({ name: 'login' })
          }
        }

        return Promise.reject(error)
      },
    )
  }

  private static convertParams(params?: unknown): URLSearchParams {
    const searchParams = new URLSearchParams()
    if (!params || typeof params !== 'object') {
      return searchParams
    }

    for (const key of Object.keys(params)) {
      const value = (params as { [key: string]: unknown })[key]
      if (value === null || value === undefined) continue

      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item === null || item === undefined) return
          searchParams.append(`${key}[]`, String(item))
        })
      } else if (typeof value === 'object') {
        searchParams.append(key, JSON.stringify(value))
      } else {
        searchParams.set(key, String(value))
      }
    }

    return searchParams
  }
}
