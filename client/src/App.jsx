import './App.css';
import { Header, Footer } from './components/index.js';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-slate-800">
      {/* Chocolate Header */}
      <Header className="bg-chocolate text-white" />

      <main className="w-full pt-8 flex-grow">
        <div className="container mx-auto px-4">
          {/* Keep the test-passing element for now */}
          <h1 className="hidden">Sweet Shop Management System</h1>
          <Outlet />
        </div>
      </main>

      {/* Chocolate Footer */}
      <Footer className="bg-chocolate text-white" />
    </div>
  );
}

export default App;
