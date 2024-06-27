// Used to determine if a user is logged in when displaying information

import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const[user, setUser] = useState(null);
    const[ready, setReady] = useState(false); // Makes sure the account info is loaded before redirect on account page
    // Gets user info each refresh while logged in
    useEffect(() => {
        if(!user) {
            axios.get('/profile').then(({data}) => {
                setUser(data);
                setReady(true);
            });
        }
    }, []);
    return(
        // passing user and setUser allows it to be exported to other files
        <UserContext.Provider value={{user, setUser, ready}}>
            {children}
        </UserContext.Provider>
    );
}