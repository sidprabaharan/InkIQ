
import { useState } from 'react';
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-yellow-100">
      <Sidebar collapsed={sidebarCollapsed} toggleCollapse={toggleSidebar} />
      <div className="flex flex-col flex-1 overflow-hidden bg-purple-100">
        <TopBar />
        <main className="flex-1 overflow-auto bg-orange-100">
          {children}
        </main>
      </div>
    </div>
  );
}
