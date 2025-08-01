import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';

interface MainNavbarProps {
  activeSection: string | null;
  onSectionChange: (section: string) => void;
  onBackToNavigation?: () => void;
}

export const MainNavbar: React.FC<MainNavbarProps> = ({ activeSection, onSectionChange, onBackToNavigation }) => {
  const { logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { 
      id: 'ai', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      ), 
      label: 'AI' 
    },
    { 
      id: 'shapes', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        </svg>
      ), 
      label: 'Shapes' 
    },
    { 
      id: 'diagrams', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      ), 
      label: 'Diagrams' 
    },
    { 
      id: 'save', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
          <polyline points="17,21 17,13 7,13 7,21"/>
          <polyline points="7,3 7,8 15,8"/>
        </svg>
      ), 
      label: 'Save' 
    },
    { 
      id: 'export', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7,10 12,15 17,10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      ), 
      label: 'Export' 
    },
    { 
      id: 'share', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      ), 
      label: 'Share' 
    },
  ];

  const bottomItems = [
    { 
      id: 'back', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15,18 9,12 15,6"/>
        </svg>
      ), 
      label: 'Back' 
    },
    { 
      id: 'profile', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ), 
      label: 'Profile' 
    },
    { 
      id: 'logout', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16,17 21,12 16,7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      ), 
      label: 'Logout' 
    },
    { 
      id: 'collapse', 
      icon: isCollapsed ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9,18 15,12 9,6"/>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15,18 9,12 15,6"/>
        </svg>
      ), 
      label: 'Collapse' 
    },
  ];

  const handleItemClick = (itemId: string) => {
    if (itemId === 'logout') {
      logout();
    } else if (itemId === 'collapse') {
      setIsCollapsed(!isCollapsed);
    } else if (itemId === 'back' && onBackToNavigation) {
      onBackToNavigation();
    } else {
      onSectionChange(itemId);
    }
  };

  return (
    <div className={`${isCollapsed ? 'w-12' : 'w-16'} bg-gray-900 text-white flex flex-col transition-all duration-300`}>
      {/* Top Navigation Items */}
      <div className="flex-1 py-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={`w-full h-14 flex flex-col items-center justify-center hover:bg-gray-800 transition-colors border-l-4 ${
              activeSection === item.id ? 'border-blue-500 bg-gray-800 text-blue-400' : 'border-transparent'
            }`}
            title={item.label}
          >
            <div className="mb-1">{item.icon}</div>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Bottom Navigation Items */}
      <div className="pb-4 border-t border-gray-700">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className="w-full h-14 flex flex-col items-center justify-center hover:bg-gray-800 transition-colors"
            title={item.label}
          >
            <div className="mb-1">{item.icon}</div>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
