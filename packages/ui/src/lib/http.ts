import { HttpClient } from '@onix/utils';
import { config } from './config';

export const httpClient = new HttpClient({ baseURL: config.baseURL });
