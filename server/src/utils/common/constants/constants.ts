import { config } from 'dotenv';

config();

export const IS_PROD = process.env.NODE_ENV === 'production';
export const IS_DEV = process.env.NODE_ENV === 'development';
export const SESSION_MAX_AGE = 1000 * 60 * 45;
export const REFRESH_TOKEN_MAX_AGE = 1000 * 60 * 30;
export const ACCESS_TOKEN_MAX_AGE = 1000 * 60 * 2;
export const READ_DATA_PERMISSION = 'READ_DATA';
export const UPDATE_DATA_PERMISSION = 'UPDATE_DATA';
export const DELETE_DATA_PERMISSION = 'DELETE_DATA';
export const QUANTITY_MOCK_USERS = 20;
