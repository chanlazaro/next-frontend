'use client';

import { useEffect, useState } from 'react';
import api from "../../../utils/axios";
import axios from 'axios';
import { setCookie } from 'cookies-next/client';
import "./../globals.css";


// This login page is adapted from the Tailwind+ templates
// https://tailwindcss.com/plus/ui-blocks/application-ui/forms/sign-in-forms

export default function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<null | string>(null);
  const [res, setRes] = useState<undefined | object>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('login', { username, password });
      console.log(response.data);
      console.log('Login successful');
      setRes(response.data);
      // Store access token to the cookies
      setCookie('token', response.data.data.token)
      // document.cookie = `token=${response.data.data.token}; path=/; secure; SameSite=Lax`; 
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message);
      }
    }
  };

  function closeErrAlert(event: React.MouseEvent) {
    const alertElement = event.target as HTMLElement;
    if (alertElement.parentNode) {
      (alertElement.parentNode as HTMLElement).remove();
    }
    setError(null);
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (res) {
      timer = setTimeout(() => {
        // Redirect to profile page after 2 seconds
        window.location.href = '/profile';
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [res]);

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-20 text-center text-2xl/9 font-bold tracking-tight">Sign in to your account</h2>
      </div>
      {error &&
      (
        <div id="failed-alert" className="mt-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded sm:mx-auto sm:w-full sm:max-w-sm" role="alert">
          <div className='flex'>
            <p className="font-bold">Login Failed!
            </p>
            <svg onClick={ closeErrAlert } className="w-4 h-4 fill-current ml-auto hover:opacity-80 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM359.5 133.7c-10.11-8.578-25.28-7.297-33.83 2.828L256 218.8L186.3 136.5C177.8 126.4 162.6 125.1 152.5 133.7C142.4 142.2 141.1 157.4 149.7 167.5L224.6 256l-74.88 88.5c-8.562 10.11-7.297 25.27 2.828 33.83C157 382.1 162.5 384 167.1 384c6.812 0 13.59-2.891 18.34-8.5L256 293.2l69.67 82.34C330.4 381.1 337.2 384 344 384c5.469 0 10.98-1.859 15.48-5.672c10.12-8.562 11.39-23.72 2.828-33.83L287.4 256l74.88-88.5C370.9 157.4 369.6 142.2 359.5 133.7z"/>
            </svg>
          </div>
          <span className="block sm"> Try again or check your credentials if correct.</span>
        </div>
      )}
      {res &&
      (
        <div className="mt-5 bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded sm:mx-auto sm:w-full sm:max-w-sm" role="alert">
          <p className="font-bold">Login Success!</p>
          <span className="block sm:inline"> Redirecting you to your user profile page.</span>
        </div>
      )}
      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={ handleSubmit } method="POST" className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium ">Username</label>
            <div className="mt-2">
              <input id="username" type="text" name="username" required autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-black/15 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium ">Password</label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">Forgot password?</a>
              </div>
            </div>
            <div className="mt-2">
              <input id="password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-black/15 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
            </div>
          </div>

          <div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Sign in</button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-400">
          Not a member?
          <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300"> Register here</a>
        </p>
      </div>
    </div>
  );
}