
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Settings, 
  List, 
  Calendar, 
  FileText,
  User
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Equipment', href: '/equipment', icon: List },
    { name: 'Rentals', href: '/rentals', icon: Calendar },
    { name: 'Maintenance', href: '/maintenance', icon: Settings },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold">ENTNT Rentals</h1>
        <p className="text-sm text-slate-400 mt-1">Equipment Management</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 px-3 py-2">
          <User className="w-8 h-8 text-slate-400" />
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-slate-400">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
