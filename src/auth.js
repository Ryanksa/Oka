import React, { useEffect, useState } from 'react';
import { firebaseAuth } from './firebase';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(firebaseAuth.currentUser);

    useEffect(() => {
        firebaseAuth.onAuthStateChanged(setUser);
    }, []);

    return(
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
};