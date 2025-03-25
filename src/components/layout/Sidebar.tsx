
import { useState } from 'react';
import {
  BarChart2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  DollarSign,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  PlayCircle,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Store,
  User,
  Users,
  ClipboardList,
  Package2,
  Truck,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

export function Sidebar({ collapsed, toggleCollapse }: SidebarProps) {
  const location = useLocation();
  
  const navigationItems = [
    {
      name: 'Dashboard',
      icon: Home,
      path: '/',
    },
    {
      name: 'Calendar',
      icon: Calendar,
      path: '/calendar',
    },
    {
      name: 'Contacts',
      icon: Users,
      path: '/contacts',
    },
    {
      name: 'Leads',
      icon: User,
      path: '/leads',
    },
    {
      name: 'Quotes',
      icon: FileText,
      path: '/quotes',
    },
    {
      name: 'Invoices',
      icon: FileText,
      path: '/invoices',
    },
    {
      name: 'Customers',
      icon: Users,
      path: '/customers',
    },
    {
      name: 'Tasks',
      icon: ClipboardList,
      path: '/tasks',
    },
    {
      name: 'Products',
      icon: Package2,
      path: '/products',
    },
    {
      name: 'Purchase Orders',
      icon: ShoppingCart,
      path: '/purchase-orders',
    },
    {
      name: 'Messages',
      icon: MessageSquare,
      path: '/messages',
    },
    {
      name: 'Expenses',
      icon: DollarSign,
      path: '/expenses',
    },
    {
      name: 'Analytics',
      icon: BarChart2,
      path: '/analytics',
    },
    {
      name: 'Merch Stores',
      icon: Store,
      path: '/merch-stores',
    },
  ];

  const bottomItems = [
    {
      name: 'Settings',
      icon: Settings,
      path: '/settings',
    },
    {
      name: 'Logout',
      icon: LogOut,
      path: '/logout',
    },
  ];

  return (
    <aside className={`${collapsed ? 'w-[64px]' : 'w-[230px]'} border-r h-full flex flex-col bg-white transition-width duration-300`}>
      <div className={`p-4 flex items-center gap-2 border-b ${collapsed ? 'justify-center' : ''}`}>
        <PlayCircle size={24} className="text-inkiq-primary fill-inkiq-primary" />
        {!collapsed && <span className="font-semibold text-xl">InkIQ</span>}
      </div>
      
      <div className="relative">
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-4 bg-white border rounded-full p-1 shadow-md z-10 hover:bg-gray-50"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className={`space-y-1 ${collapsed ? 'px-1' : 'px-2'}`}>
          {navigationItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                title={collapsed ? item.name : undefined}
                className={`flex items-center gap-3 rounded-md text-sm font-medium transition-colors ${
                  collapsed ? 'justify-center p-2' : 'px-3 py-2'
                } ${
                  location.pathname === item.path
                    ? 'bg-inkiq-primary/10 text-inkiq-primary'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon size={18} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="border-t py-2">
        <ul className={`space-y-1 ${collapsed ? 'px-1' : 'px-2'}`}>
          {bottomItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                title={collapsed ? item.name : undefined}
                className={`flex items-center gap-3 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors ${
                  collapsed ? 'justify-center p-2' : 'px-3 py-2'
                } ${
                  location.pathname === item.path
                    ? 'bg-inkiq-primary/10 text-inkiq-primary'
                    : ''
                }`}
              >
                <item.icon size={18} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
