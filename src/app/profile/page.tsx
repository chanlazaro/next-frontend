'use client';

import { useEffect, useState } from "react";
import api from "../../../utils/axios";
import { deleteCookie } from "cookies-next/client";
import "./../globals.css";
import { jwtDecode } from 'jwt-decode';

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

interface cookieData { 
  data: {
    id: number,
    username: string,
    email: string,
  }
}

export default function Profile() {
  const [res, setRes] = useState(false);
  const [user, setUser] = useState<cookieData | null>(null);

  const handleLogoutClick = () => {
    logoutUser().then((result) => {
      if(result === true)
        setRes(true); // Set state to trigger the useEffect for redirect
      else
        throw new Error('Failed, please try again.');
    });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (res) {
      timer = setTimeout(() => {
        // Redirect to login page after 2 seconds
        window.location.href = '/login';
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [res]);

  useEffect(() => {
    const token = getCookie('token');
    if(token) {
      const decodedCookie = jwtDecode(token);
      const userData = async () => {
        await api.get<cookieData>('users/get_user', { params: {
          id: decodedCookie.sub,
        }})
        .then(response => {
          setUser(response.data);
          console.log(response.data);
        })
        .catch(error => {
          console.error(error);
        });
      }

      userData();
    }
  }, []);


  return <div>
    <nav className="flex justify-between items-center bg-indigo-500 dark:text-white">
      <div className="flex flex-row p-2">
        <a href="#" className="text-2xl font-bold text-gray-800 pl-3 dark:text-white">
          Task Management
        </a>
      </div>
      <div className="mr-4">
        <ul className="flex flex-row space-x-4">
          <li>
            <span  className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white">Hello, {user ? (
              <div>{user.data.username}</div>
              ) : (
                <div>Loading...</div>
              )}
            </span>
          </li> 
          <li>
            <button  onClick={handleLogoutClick} className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Log out</button>
          </li>
        </ul>
      </div>
    </nav>
    
    {res &&
    (
      <div className="mt-5 bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded sm:mx-auto sm:w-full sm:max-w-sm" role="alert">
        <p className="font-bold">Logged out!</p>
        <span className="block sm:inline"> Redirecting you to login page.</span>
      </div>
    )}
  </div>
    
}

async function logoutUser(): Promise<boolean> {
  try {
    const response = await api.post('logout', {}, {
      withCredentials: true,  // This ensures cookies are included in the request
    });
    
    // Clear the token from cookies
    deleteCookie(`token`);

    console.log('Logged out successfully:', response.data);
    return true;
  } catch (error) {    
    console.error('Logout failed:', error);
    return false;
  }
}