import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "../components/BookingWidget";
import PlaceGallery from "../components/PlaceGallery";
import AddressLink from "../components/AddressLink";

export default function PlacePage() {
    const {id} = useParams();
    const [place, setPlace] = useState(null);

    // Runs useEffect each time id changes
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/places/${id}`).then(response => {
            setPlace(response.data);
        });
    }, [id]);

    if (!place) return '';

    return(
        <div className="mt-4 bg-gray-100 -m-8 px-8 pt-8" >
            {/* Place Title */}
            <h1 className="text-3xl">{place.title}</h1>
            {/* Address */}
            <AddressLink>
                {place.address}
            </AddressLink>
            {/* Photos grid */}
            <PlaceGallery place={place}/>
            {/* Extra Info */}
            {/* fr controls column sizes */}
            <div className="mt-8 gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]">
                {/* Left column */}
                <div>
                    {/* Place description */}
                    <div className="my-4">
                        <h2 className="font-semibold text-2xl">Description</h2>
                        {place.description}
                    </div>
                    Check-in: {place.checkIn}<br/>
                    Check-out: {place.checkOut}<br/>
                    Max number of guests: {place.maxGuests}
                </div>
                {/* Right column */}
                <div>
                    <BookingWidget place={place}/>
                </div>
            </div>
            {/* Underneath columms */}
            <div className="bg-white -mx-8 p-8 mt-8 border-t">
                <div>
                    <h2 className="font-semibold text-2xl">Extra info</h2>
                </div>
                <div className="text-sm text-gray-700 leading-5 mt-2 mb-4">
                    {place.extraInfo}
                </div>
            </div>
        </div>
    )
}