import React from 'react';
import { useUserContext } from '../context/UserContext';

export default function UserToggle() {
  const { userRole, setUserRole } = useUserContext();

  return (
    <div className="flex items-center space-x-3">
      <span className={`text-sm font-medium transition-colors duration-200 ${
        userRole === 'buyer' 
          ? 'text-white' 
          : 'text-gray-400 dark:text-gray-500'
      }`}>
        Buyer
      </span>
      
      <button
        onClick={() => setUserRole(userRole === 'buyer' ? 'seller' : 'buyer')}
        className="relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        style={{
          backgroundColor: userRole === 'buyer' 
            ? 'rgb(99, 102, 241)' 
            : 'rgb(79, 70, 229)'
        }}
        role="switch"
        aria-checked={userRole === 'seller'}
      >
        <span className="sr-only">Toggle user role</span>
        <span
          className={`pointer-events-none relative inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            userRole === 'seller' ? 'translate-x-7' : 'translate-x-0'
          }`}
        >
          <span
            className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
              userRole === 'seller' ? 'opacity-0' : 'opacity-100'
            }`}
            aria-hidden="true"
          >
            <svg className="h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z"/>
              <path d="M12 17L12 7M7 12L17 12" strokeWidth="2" stroke="currentColor" fill="none"/>
            </svg>
          </span>
          <span
            className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
              userRole === 'seller' ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          >
            <svg className="h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z"/>
              <path d="M15 12L9 12M12 9L12 15" strokeWidth="2" stroke="currentColor" fill="none"/>
            </svg>
          </span>
        </span>
      </button>
      
      <span className={`text-sm font-medium transition-colors duration-200 ${
        userRole === 'seller' 
          ? 'text-white' 
          : 'text-gray-400 dark:text-gray-500'
      }`}>
        Seller
      </span>
    </div>
  );
}