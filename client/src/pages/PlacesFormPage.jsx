import { useEffect, useState } from "react";
import PhotosUploader from "../components/PhotosUploader";
import Perks from "../components/Perks";
import AccountNav from "../components/AccountNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";

export default function PlacesFormPage() {
    // State for the form inputs
    const {id} = useParams(); // Grabs page id
    const[title, setTitle] = useState('');
    const[address, setAddress] = useState('');
    const[addedPhotos, setAddedPhotos] = useState([]); // Array of added photos
    const[description, setDescription] = useState('');
    const[extraInfo, setExtraInfo] = useState('');
    const[perks, setPerks] = useState([]);
    const[checkIn, setCheckIn] = useState('');
    const[checkOut, setCheckOut] = useState('');
    const[maxGuests, setMaxGuests] = useState(1);
    const[price, setPrice] = useState(100);
    const[redirect, setRedirect] = useState(false);

    // Using id tries to call api with place id
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/places/' + id).then(response => {
            const {data} = response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price)
        });
    }, [id]);
    
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
    async function savePlace(ev) {
        ev.preventDefault();  // Prevents reload
        const placeData = {
            title, address, addedPhotos, 
            description, perks, extraInfo, 
            checkIn, checkOut, maxGuests, price,
        }
        // Check if we have id
        if (id) {
            // update
            await axios.put('/places', {  
                // All data that should be sent to api when updating place
                id, ...placeData
            });
            setRedirect(true);
        } else {
            // new place
            await axios.post('/places', {  
                // All data that should be sent to api when creating new place
                ...placeData
            });
            setRedirect(true);
        }
    }

    // Redirects when the save button is clicked
    if (redirect) {
        return <Navigate to={'/account/places'}/>
    }

    return (
        <div>
            <AccountNav/>
            <form onSubmit={savePlace}>
                {preInput('Title', 'Title for your place. Should be short and catchy.')}
                <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title, for example: My lovely apartment"/>
                {preInput('Address', 'Address of this place.')}
                <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="address"/>
                {preInput('Photos', 'More is better.')}
                {/* For upload photos by link */}
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
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
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
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
                    <div>
                        <h3 className="mt-2 -mb-1">Price per night</h3>
                        <input type="number" value={price} 
                            onChange={ev => setPrice(ev.target.value)}/>
                    </div>
                </div>
                <button className="primary my-4">Save</button>
            </form>
        </div>
    );
}