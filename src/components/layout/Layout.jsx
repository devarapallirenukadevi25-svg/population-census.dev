import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 relative overflow-hidden pt-4 transition-all duration-300 md:pl-24">
        <div className="h-full w-full max-w-7xl mx-auto px-3 pb-28 sm:px-6 md:pb-8 lg:px-8">
          <div className="h-full min-h-[calc(100vh-2rem)]">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
