import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { HealthCompanion } from '../components/HealthCompanion';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50/50 dark:bg-slate-950">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm xl:hidden"
        />
      )}

      {/* Main App Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header Bar */}
        <TopNav onMenuToggle={toggleSidebar} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-6 py-6 max-w-7xl w-full mx-auto flex flex-col justify-between">
          <div className="flex-1 pb-10">
            {children}
          </div>
          <Footer />
        </main>
      </div>

      {/* Floating Mascot Widget */}
      <HealthCompanion />
    </div>
  );
};
