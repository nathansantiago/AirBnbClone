import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "../components/Perks";
import axios from "axios";

export default function PlacesPage () {
    // Grabs domain of current subpage
    const {action} = useParams();
    // State for the form inputs
    const[title, setTitle] = useState('');
    const[address, setAddress] = useState('');
    const[addedPhotos, setAddedPhotos] = useState([]); // Array of added photos
    const[photoLink, setPhotoLink] = useState('');
    const[description, setDescription] = useState('');
    const[extraInfo, setExtraInfo] = useState('');
    const[perks, setPerks] = useState([]);
    const[checkIn, setCheckIn] = useState('');
    const[checkOut, setCheckOut] = useState('');
    const[maxGuests, setMaxGuests] = useState(1);

    // Functions to simplify code
    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }
    function inputDescription(text) {
        return(
            <p className="text-gray-500 text-sm">{text}</p>
        );
    }
    function preInput(header, description) {
        return(
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }
    // Takes photo from state variable and uploads photo to api
    async function addPhotoByLink(ev) {
        ev.preventDefault();
        await axios.post('/upload-by-link', {link:photoLink}); // photoLink is state variable
    }

    return (
        <>
            {/* Only displays add new place button if you aren't on the new subpage */}
            {action !== 'new' && (
                <div className="text-center">
                    <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                        </svg>
                        Add new place
                    </Link>
                </div>
            )}
            {action === 'new' && (
                <div>
                    <form>
                        {preInput('Title', 'Title for your place. Should be short and catchy.')}
                        <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title, for example: My lovely apartment"/>
                        {preInput('Address', 'Address of this place.')}
                        <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="address"/>
                        {preInput('Photos', 'More is better.')}
                        {/* For upload photos by link */}
                        <div className="flex gap-2">
                            <input value={photoLink} 
                                onChange={ev => setPhotoLink(ev.target.value)} 
                                type="text" placeholder={'Add using a link ....jpg'}/>
                            <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add&nbsp;photo</button>
                        </div>
                        {/* Contains added photos and new photos button */}
                        <div className="mt-2 grid grid-cols-3 lg:grid-cols-6 md:grid-cols-4">
                            <button className="flex gap-1 justify-center border bg-transparent rounded-2xl p-8 text-2xl text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                                </svg>
                                Upload
                            </button>
                        </div>
                        <h2 className="text-2xl mt-4">Description</h2>
                        <p className="text-gray-500 text-sm">Description of the place.</p>
                        <textarea value={description} onChange={ev => setDescription(ev.target.value)}/>
                        {/* Checkbox list of all possible perks. */}
                        {preInput('Perks', 'Select all the perks of your place.')}
                        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                            {/* Component containg all perks selected perks are passed to component */}
                            <Perks selected={perks} onChange={setPerks}/>
                        </div>
                        {preInput('Extra info', 'House rules, etc.')}
                        <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
                        {preInput('Check in & out times', 'Add check in and check out times, remember to leave time for cleaning between guests.')}
                        <div className="grid gap-2 sm:grid-cols-3">
                            <div>
                                <h3 className="mt-2 -mb-1">Check in time</h3>
                                <input type="text" 
                                    value={checkIn} 
                                    onChange={ev => setCheckIn(ev.target.value)} 
                                    placeholder="14"/>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Check out time</h3>
                                <input type="text" 
                                    value={checkOut} 
                                    onChange={ev => setCheckOut(ev.target.value)} 
                                    placeholder="11"/>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Max number of guests</h3>
                                <input type="number" value={maxGuests} 
                                    onChange={ev => setMaxGuests(ev.target.value)}/>
                            </div>
                        </div>
                        <button className="primary my-4">Save</button>
                    </form>
                </div>
            )}
        </>
    )
}