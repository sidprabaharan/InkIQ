
import {
  BarChart2,
  Calendar,
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
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const location = useLocation();
  
  const navigationItems = [
    {
      name: 'Dashboard',
      icon: Home,
      path: '/dashboard',
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
      name: 'Products',
      icon: ShoppingBag,
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
      name: 'Tasks',
      icon: FileText,
      path: '/tasks',
    },
    {
      name: 'Payments',
      icon: CreditCard,
      path: '/payments',
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
    <aside className="w-[230px] border-r h-full flex flex-col bg-white">
      <div className="p-4 flex items-center gap-2 border-b">
        <PlayCircle size={24} className="text-inkiq-primary fill-inkiq-primary" />
        <span className="font-semibold text-xl">InkIQ</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-1 px-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-inkiq-primary/10 text-inkiq-primary'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="border-t py-2">
        <ul className="space-y-1 px-2">
          {bottomItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
