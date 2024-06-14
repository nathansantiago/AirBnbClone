import axios from "axios";
import { useState } from "react";

export default function PhotosUploader ({addedPhotos, onChange}) {
    const[photoLink, setPhotoLink] = useState('');

    // Takes photo from state variable and uploads photo to api
    async function addPhotoByLink(ev) {
        ev.preventDefault();
        // Calls api to upload image from link to directory
        const {data: filename} = await axios.post('/upload-by-link', {link:photoLink}); // photoLink is state variable
        // Sets addedPhotos to all previous values plus the new one
        onChange(prev => {
            return [...prev, filename];
        }); 
        setPhotoLink('');
    } 
    // Called when uploading local files
    function uploadPhoto(ev) {
        const files = ev.target.files;
        const data = new FormData();
        // For each photo being uploaded append it to the data array using the index
        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }
        // Sends files to api
        axios.post('/upload', data, {
            headers: {'Content-type':'multipart/form-data'}
        }).then(response => { // then is same as async await
            const {data: filenames} = response;
            onChange(prev => {
                console.log([...prev, ...filenames]); // ...filename splits multiple uploaded photos into individual items
                return [...prev, ...filenames];
            }); 
        })
    }

    return(
        <>
            <div className="flex gap-2">
                <input value={photoLink} 
                    onChange={ev => setPhotoLink(ev.target.value)} 
                    type="text" placeholder={'Add using a link ....jpg'}/>
                <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add&nbsp;photo</button>
            </div>
            {/* Contains added photos and new photos button */}
            <div className="mt-2 grid gap-2 grid-cols-3 lg:grid-cols-6 md:grid-cols-4">
                {/* If addedPhotos length > 0 then create a div with the link for each value in the array */}
                {addedPhotos.length > 0 && addedPhotos.map(link => (
                    <div className="h-32 flex" key={link}>
                        <img src={"http://localhost:4000/uploads/"+link} alt={link} className="rounded-2xl w-full object-cover"/>
                    </div>
                ))}
                <label className="h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
                    <input type="file" multiple className="hidden" onChange={uploadPhoto}/>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                    </svg>
                    Upload
                </label>
            </div>
        </>
    );
}