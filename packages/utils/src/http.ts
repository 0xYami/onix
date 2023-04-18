import axios from 'axios';
import type { Axios, AxiosRequestConfig, CreateAxiosDefaults } from 'axios';
import type { z, ZodSchema } from 'zod';
import { asyncFaillable } from './helpers';

type GetRequest<TParams extends ZodSchema, TResponse extends ZodSchema> = {
  url: string;
  options: Omit<AxiosRequestConfig, 'params'> & { params: z.infer<TParams> };
  validation: {
    params: TParams;
    response: TResponse;
  };
};

type GetRequestWithResponseValidation<TResponse extends ZodSchema> = {
  url: string;
  options?: AxiosRequestConfig;
  validation: {
    response: TResponse;
  };
};

type PostRequest<TData extends object, TResponse extends ZodSchema> = {
  url: string;
  data: TData;
  options?: AxiosRequestConfig;
  validation: {
    response: TResponse;
  };
};

export class HttpClient {
  #http: Axios;

  constructor(config?: CreateAxiosDefaults) {
    this.#http = axios.create(config);
  }

  async get<TParams extends ZodSchema, TResponse extends ZodSchema>(
    config: GetRequest<TParams, TResponse>,
  ): Promise<z.infer<TResponse>>;

  async get<TResponse extends ZodSchema>(
    config: GetRequestWithResponseValidation<TResponse>,
  ): Promise<z.infer<TResponse>>;

  async get<TParams extends ZodSchema, TResponse extends ZodSchema>(
    config: GetRequest<TParams, TResponse> | GetRequestWithResponseValidation<TResponse>,
  ): Promise<z.infer<TResponse>> {
    if ('params' in config.validation) {
      config.validation.params.parse(config.options?.params);
    }
    const call = await asyncFaillable<{ data: z.infer<TResponse> }>(
      this.#http.get(config.url, config.options),
    );
    if (call.failed) {
      throw new Error(`GET: request to ${config.url} failed`);
    }
    return config.validation.response.parse(call.result.data);
  }

  async post<TData extends object, TResponse extends ZodSchema = ZodSchema>(
    config: PostRequest<TData, TResponse>,
  ): Promise<z.infer<TResponse>> {
    const call = await asyncFaillable<{ data: z.infer<TResponse> }>(
      this.#http.post(config.url, config.data, config.options),
    );
    if (call.failed) {
      throw new Error(`POST: request to ${config.url} failed`);
    }
    return config.validation.response.parse(call.result.data);
  }
}
