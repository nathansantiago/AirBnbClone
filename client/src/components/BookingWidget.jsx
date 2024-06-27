import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function BookingWidget({place}) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [redirect, setRedirect] = useState('');
    const {user} = useContext(UserContext);

    useEffect(() =>{
        if (user) {
            setName(user.name);
        }
    }, [user]);

    let numberOfNights = 0;
    if(checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(checkOut, checkIn);
    }

    async function bookThisPlace() {
        // Sends booking to api
        const response = await axios.post('/bookings', {
            checkIn, checkOut, numberOfGuests, name, phone,
            place: place._id,
            price: numberOfNights * place.price,
        });
        // Grabs booking id from response
        const bookingId = response.data._id;
        // sets the redirect address
        setRedirect(`/account/bookings/${bookingId}`);
    }

    // If booked, redirect to user booking page
    if(redirect) {
        return <Navigate to={redirect}/>
    }

    return (
        <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">
                Price: ${place.price} / per night
            </div>
            {/* Check-in Check-out and number of guests inputs */}
            <div className="border rounded-2xl mt-4">
                {/* check in check out inputs */}
                <div className="flex">
                    {/* Check In */}
                    <div className="py-3 px-4 ">
                        <label>Check in: </label>
                        <input type="date" 
                            value={checkIn} 
                            onChange={ev => setCheckIn(ev.target.value)}/>
                    </div>
                    {/* Check out */}
                    <div className="py-3 px-4 border-l">
                        <label>Check out: </label>
                        <input type="date" 
                            value={checkOut} 
                            onChange={ev => setCheckOut(ev.target.value)}/>
                    </div>
                </div>
                {/* Number of guests */}
                <div className="py-3 px-4 border-t">
                    <label>Number of guests: </label>
                    <input type="number" 
                        value={numberOfGuests} 
                        onChange={ev => setNumberOfGuests(ev.target.value)}/>
                </div>
                {/* Only displays if valid dates are filled */}
                {numberOfNights > 0 && (
                    <div className="py-3 px-4 border-t">
                        {/* Name field */}
                        <label>Full name: </label>
                        <input type="text" 
                            value={name} 
                            onChange={ev => setName(ev.target.value)}/>
                        {/* Phone number field */}
                        <label>Phone number: </label>
                        <input type="tel" 
                            value={phone} 
                            onChange={ev => setPhone(ev.target.value)}/>
                    </div>
                )}
            </div>
            <button onClick={bookThisPlace} className="primary mt-4">
                Book this place
                {/* Only displays price if dates are filled in */}
                {numberOfNights > 0 && (
                    <span> ${numberOfNights * place.price}</span>
                )}
            </button>
        </div>
    );
}