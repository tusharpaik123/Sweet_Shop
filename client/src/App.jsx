import { useState } from 'react';
import { Outlet } from 'react-router-dom';


const Header = () => <header className="bg-gray-800 p-4 text-white">Header Placeholder</header>;
const Footer = () => <footer className="bg-gray-800 p-4 text-white mt-auto">Footer Placeholder</footer>;
function App() {
    return (
        <div className='min-h-screen flex flex-col bg-gradient-primary'>
            <Header />
            <main className='w-full pt-8 flex-grow'>
                <div className='container mx-auto px-4'>
                    {/* Keep the test-passing element for now */}
                    <h1>Sweet Shop Management System</h1> 
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default App;


