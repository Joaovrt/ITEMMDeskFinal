import React, { createContext, useContext, useState, useEffect } from 'react';
import { database } from '../config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser deve ser usado dentro de um UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [userName, setUserName] = useState(null);
    const [userId, setUserId] = useState(null);  
    
    const handleLogin = async (email) => {
        setUserEmail(email);

        // Verificando se é um Admin
        try {
            const q = query(collection(database, "Admin"), where("email", "==", email));
            const querySnapshot = await getDocs(q);
            setIsAdmin(!querySnapshot.empty);
        } catch (error) {
            console.error("Error fetching admin:", error);
            setIsAdmin(false);
        }

        // Verificando se é um Cliente
        try {
            const clientRef = collection(database, "Clientes");
            const q = query(clientRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setIsClient(true);
                const clientData = querySnapshot.docs[0].data();
                const clientId = querySnapshot.docs[0].id; 
                setUserId(clientId);  
                setUserName(clientData.nome);
            } else {
                setIsClient(false);
                setUserName(null);
                setUserId(null); 
            }
        } catch (error) {
            console.error("Error fetching client:", error);
            setIsClient(false);
        }
    };

    return (
        <UserContext.Provider value={{ 
            userEmail, setUserEmail, isAdmin, isClient, userName, setUserName, userId, setUserId, handleLogin 
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;