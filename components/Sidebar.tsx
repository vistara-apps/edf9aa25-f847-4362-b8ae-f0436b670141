'use client';

import { useState } from 'react';
import { 
  Home, 
  TrendingUp, 
  BarChart3, 
  BookOpen, 
  Settings2, 
  User,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'trading', name: 'Trading', icon: TrendingUp },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'learn', name: 'Learn', icon: BookOpen },
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'settings', name: 'Settings', icon: Settings2 },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full glass-card border-r border-white border-opacity-10">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-white border-opacity-10">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">FlashTrade</h1>
              <p className="text-sm text-gray-400">Sim</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`nav-item w-full ${activeTab === item.id ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-white border-opacity-10">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white bg-opacity-5">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Demo User</p>
                <p className="text-xs text-gray-400">Virtual Trading</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
