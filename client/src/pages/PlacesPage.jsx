import { Link} from "react-router-dom";
import AccountNav from "../components/AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PlacesPage () {
    // // Grabs domain of current subpage
    // const {action} = useParams();

    const [places, setPlaces] = useState([]);
    useEffect(() => {
        axios.get('/places').then(({data}) => {
            setPlaces(data)
        });
    }, []);
    
    return (
        <>
            <AccountNav/>
            {/* Only displays add new place button if you aren't on the new subpage */}
            <div className="text-center">
                <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                    Add new place
                </Link>
            </div>
            <div className="mt-4">
                {/* If places.length > 0 then map */}
                {places.length > 0 && places.map(place => (
                    // When clicked goes to place id subpage
                    <Link to={'/account/places/'+place._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
                        <div className="flex bg-gray-300 w-32 h-32 grow shrink-0">
                            {/* If photos length > 0 display the first one */}
                            {place.photos.length > 0 && (
                                <img className='object-cover' src={'http://localhost:4000/uploads/' + place.photos[0]} alt=""/>
                            )}
                        </div>
                        <div className="grow-0 shrink">
                            <h2 className="text-xl">{place.title}</h2>
                            <p className="text-sm mt-2">{place.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    )
}