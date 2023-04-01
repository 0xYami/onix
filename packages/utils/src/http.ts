import axios from 'axios';
import type { Axios, AxiosRequestConfig, CreateAxiosDefaults } from 'axios';
import type { z, ZodSchema } from 'zod';
import { asyncFaillable } from './helpers';

type RequestConfig<T extends ZodSchema> = {
  url: string;
  options?: AxiosRequestConfig;
  schema: T;
};

export class HttpClient {
  #http: Axios;

  constructor(config: CreateAxiosDefaults) {
    this.#http = axios.create(config);
  }

  async request<T extends ZodSchema>(config: RequestConfig<T>): Promise<z.infer<T>> {
    const call = await asyncFaillable(this.#http.get(config.url));
    if (call.failed) {
      throw new Error(`Request to ${config.url} failed`);
    }
    const data = config.schema.parse(call.result.data);
    return data;
  }
}
