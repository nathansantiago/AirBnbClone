import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../components/AccountNav";

export default function ProfilePage() {
    const[redirect, setRedirect] = useState(null);
    // Grab user context
    const {ready, user, setUser} = useContext(UserContext);

    // Determines what subpage currently on
    let {subpage} = useParams();
    // Sets undefined to profile because /account has no subpages
    if (subpage === undefined) {
        subpage = 'profile';
    }

    // Logout api call
    async function logout() {
        await axios.post('/logout');
        // After api call set the disired path to index page
        setRedirect('/');
        // Sets the user context so the header updates
        setUser(null);
    }

    // Displays loading until user info is loaded.
    if (!ready) {
        return 'Loading...';
    }

    // Prevent unlogged in user access
    if (ready && !user && !redirect) {
        return <Navigate to={'/login'}/>
    }

    // redirects before page can load if logged out
    if (redirect) {
        return <Navigate to={redirect}/>
    }

    return (
        <>
            <AccountNav/>
            {/* If subpage is profile return div with user name and email */}
            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email}) <br/>
                    <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
                </div>
            )}
            {/* Render my Accommodations page */}
            {subpage === 'places' && (
                <PlacesPage/>
            )}
        </>
    );
}