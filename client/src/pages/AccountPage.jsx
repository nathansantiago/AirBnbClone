import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";

export default function AccountPage() {
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

    // Assigns basic style to all links.
    // Changes active link to primary color
    function linkClasses (type=null) {
        let classes = 'py-2 px-6'; // Assigns basic styling
        if (type === subpage) { // Assigns active link styling if the subpage is the active link path
            classes += ' bg-primary text-white rounded-full';
        }
        return classes
    }

    // redirects before page can load if logged out
    if (redirect) {
        return <Navigate to={redirect}/>
    }

    return (
        <>
            <nav className="w-full flex justify-center mt-8 gap-2 mb-8">
                <Link className={linkClasses('profile')} to={'/account'}>My Profile</Link>
                <Link className={linkClasses('bookings')} to={'/account/bookings'}>My Bookings</Link>
                <Link className={linkClasses('places')} to={'/account/places'}>My Accommodations</Link>
            </nav>
            {/* If subpage is profile return div with user name and email */}
            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email}) <br/>
                    <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
                </div>
            )}
        </>
    );
}