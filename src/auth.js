import React, { useEffect, useState } from 'react';
import firebaseApp from './firebase';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        firebaseApp.auth().onAuthStateChanged(setUser);
    }, []);

    return(
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
};