import axios from 'axios';
import { z, type ZodSchema } from '@onix/schemas';
import { asyncFaillable } from './utils';

const client = axios.create({ baseURL: 'http://localhost:4000' });

type RequestConfig<T extends ZodSchema> = {
  url: string;
  schema: T;
};

export async function request<T extends ZodSchema>(config: RequestConfig<T>): Promise<z.infer<T>> {
  const call = await asyncFaillable(client.get(config.url));
  if (call.failed) {
    throw new Error(`Request to ${config.url} failed`);
  }
  const data = config.schema.parse(call.result.data);
  return data;
}
