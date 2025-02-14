import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import Layout from './components/Layout'
import RegisterPage from './pages/RegisterPage'
import axios from "axios";
import { UserContextProvider } from './UserContext'
import ProfilePage from './pages/ProfilePage'
import PlacesPage from './pages/PlacesPage'
import PlacesFormPage from './pages/PlacesFormPage'
import PlacePage from './pages/PlacePage'
import BookingsPage from './pages/BookingsPage'
import BookingPage from './pages/BookingPage'

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  return (
    // UserContextProvider determines if a user is logged in or not.
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<IndexPage/>} />
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/register' element={<RegisterPage/>} />
          {/* Question mark makes subpage optional */}
          <Route path='/account' element={<ProfilePage/>}/>
          {/* action page occurs when button is action button is clicked on account page e.g. add new place */}
          <Route path='/account/places' element={<PlacesPage/>}/>
          <Route path='/account/places/new' element={<PlacesFormPage/>}/>
          <Route path='/account/places/:id' element={<PlacesFormPage/>}/>
          {/* Single place pages */}
          <Route path='/place/:id' element={<PlacePage/>}/>
          {/* All user bookings pages */}
          <Route path='/account/bookings' element={<BookingsPage/>}/>
          {/* Single user booked page */}
          <Route path='/account/bookings/:id' element={<BookingPage/>}/>
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
