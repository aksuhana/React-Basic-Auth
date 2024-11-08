// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const AuthContext = createContext();

// Pre-generated hash of "mySecretKey:SECRET_SALT" stored as a constant
const HASHED_SECRET = "4bbbc26888b654e7655fa9562d811be3111ab3d7596de3f34a909894dcb8a606";
const SECRET_SALT = "SECRET_SALT_LOGISTIC"; // Salt used to hash the input on the frontend

export function AuthProvider({ children }) {
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));

    // Function to generate hash with user input + salt
    const generateHash = (inputSecret) => {
        return CryptoJS.SHA256(`${inputSecret}:${SECRET_SALT}`).toString();
    };

    // Login function that validates the input by hashing and comparing with HASHED_SECRET
    const login = (inputSecret) => {
        const token = generateHash(inputSecret); // Hash the input with the salt
        if (token === HASHED_SECRET) {  // Compare hashed input with pre-generated hash
            setAuthToken(token);
            localStorage.setItem('authToken', token); // Store token in localStorage
        } 
    };

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem('authToken'); // Clear token from localStorage
    };

    // isAuthenticated function to validate token on each access attempt
    const isAuthenticated = () => {
        const storedToken = localStorage.getItem('authToken');
        return storedToken === HASHED_SECRET; // Check if stored token matches HASHED_SECRET
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken !== HASHED_SECRET) {
            logout(); // Clear invalid token if it doesn't match the expected hash
        } else {
            setAuthToken(storedToken);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}