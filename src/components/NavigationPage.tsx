import React from 'react';
import { useAuthStore } from '../store/authStore';

interface NavigationPageProps {
  onSectionSelect: (section: string) => void;
}

export const NavigationPage: React.FC<NavigationPageProps> = ({ onSectionSelect }) => {
  const { logout, user } = useAuthStore();

  const navItems = [
    { 
      id: 'ai', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      ), 
      label: 'AI',
      description: 'AI-powered diagram generation'
    },
    { 
      id: 'shapes', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        </svg>
      ), 
      label: 'Shapes',
      description: 'Shape library and AWS icons'
    },
    { 
      id: 'diagrams', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      ), 
      label: 'Diagrams',
      description: 'Manage your saved diagrams'
    },
    { 
      id: 'save', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
          <polyline points="17,21 17,13 7,13 7,21"/>
          <polyline points="7,3 7,8 15,8"/>
        </svg>
      ), 
      label: 'Save',
      description: 'Save and manage your work'
    },
    { 
      id: 'export', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7,10 12,15 17,10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      ), 
      label: 'Export',
      description: 'Export in multiple formats'
    },
    { 
      id: 'share', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      ), 
      label: 'Share',
      description: 'Collaborate and share'
    },
  ];

  const bottomItems = [
    { 
      id: 'profile', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ), 
      label: 'Profile',
      description: 'User settings'
    },
    { 
      id: 'logout', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16,17 21,12 16,7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      ), 
      label: 'Logout',
      description: 'Sign out'
    },
  ];

  const handleItemClick = (itemId: string) => {
    if (itemId === 'logout') {
      if (confirm('Are you sure you want to logout?')) {
        logout();
      }
    } else if (itemId === 'profile') {
      alert('Profile settings coming soon!');
    } else {
      onSectionSelect(itemId);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-gray-100">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-300 px-6 py-4 shadow-sm z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">DrawFlow</h1>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-sm text-gray-600">{user?.username || 'User'}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Sidebar */}
      <div className="w-20 bg-gray-900 text-white flex flex-col pt-20">
        {/* Top Navigation Items */}
        <div className="flex-1 py-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className="w-full h-16 flex flex-col items-center justify-center hover:bg-gray-800 transition-colors group"
              title={item.description}
            >
              <div className="mb-1 group-hover:text-blue-400 transition-colors">{item.icon}</div>
              <span className="text-xs font-medium group-hover:text-blue-400 transition-colors">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Bottom Navigation Items */}
        <div className="pb-4 border-t border-gray-700">
          {bottomItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className="w-full h-16 flex flex-col items-center justify-center hover:bg-gray-800 transition-colors group"
              title={item.description}
            >
              <div className="mb-1 group-hover:text-blue-400 transition-colors">{item.icon}</div>
              <span className="text-xs font-medium group-hover:text-blue-400 transition-colors">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Welcome Content */}
      <div className="flex-1 flex items-center justify-center pt-20">
        <div className="text-center max-w-2xl px-8">
          <div className="mb-8">
            <svg 
              className="mx-auto h-32 w-32 text-gray-400 mb-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to DrawFlow</h2>
            <p className="text-xl text-gray-600 mb-8">
              Professional diagram creation made simple. Choose a feature from the sidebar to get started.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleItemClick('ai')}
            >
              <div className="text-purple-600 mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Assistant</h3>
              <p className="text-gray-600 text-sm">Generate diagrams with AI-powered assistance</p>
            </div>

            <div 
              className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleItemClick('shapes')}
            >
              <div className="text-blue-600 mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Shape Library</h3>
              <p className="text-gray-600 text-sm">Access AWS icons and professional shapes</p>
            </div>

            <div 
              className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleItemClick('diagrams')}
            >
              <div className="text-green-600 mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">My Diagrams</h3>
              <p className="text-gray-600 text-sm">Manage and organize your saved work</p>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-gray-500 text-sm">
              Click on any feature in the sidebar or cards above to start creating your diagrams
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
