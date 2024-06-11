import './App.css'

function App() {
  return (
    <>
      <div>
        <header className='p-4 flex justify-between'>
          <a href='' className='flex items-center gap-1'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 -rotate-90">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
            <span className='font-bold text-xl'>airbnb</span>
          </a>

          <div className='flex gap-2 border border-color-gray-300 rounded-full py-2 px-4 shadow-md shodow-gray-300'>
            <div>Anywhere</div>
            <div className='border-l border-gray-300'></div>
            <div>Any week</div>
            <div className='border-l border-gray-300'></div>
            <div>Add guests</div>
            <button className='bg-primary text-white p-1 rounded-full'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </div>

          <div className='flex gap-2 border border-color-gray-300 rounded-full py-2 px-4 shadow-md shodow-gray-300'></div>
        </header>
      </div>
    </>
  )
}

export default App
