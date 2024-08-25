'use client';

import axios from 'axios';

import { API_URL, APP_URL } from './constants';

export const $http = axios.create({
  baseURL: API_URL,
  headers: {
    'Access-Control-Allow-Origin': APP_URL,
  },
  withCredentials: true,
});

$http.interceptors.response.use(
  response => response,
  error => {
    // TODO: FIX 401 REDIRECT
    // check if URL is in an authenticated route and redirect to sign in
    // if (error.response.status === 401 && window.location.href.includes('/dashboard')) {
    //   window.location.href = '/auth/signin';
    // }
    return Promise.reject(error);
  },
);

export const addAccessTokenToHttpInstance = (token: string) => {
  console.log({ token });
  $http.interceptors.request.use(
    config => {
      config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );
};
