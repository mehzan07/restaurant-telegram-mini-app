import React from 'react';
import { TabView, Language } from '../types';

interface NavigationProps {
  currentTab: TabView;
  onTabChange: (tab: TabView) => void;
  language: Language;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  language,
}) => {
  const tabs = [
    {
      id: 'home' as TabView,
      label: language === 'SV' ? 'Hem' : 'Home',
      icon: 'cottage',
    },
    {
      id: 'menu' as TabView,
      label: language === 'SV' ? 'Meny' : 'Menu',
      icon: 'restaurant_menu',
    },
    {
      id: 'book-table' as TabView,
      label: language === 'SV' ? 'Boka bord' : 'Book Table',
      icon: 'table_restaurant',
      isAccent: true,
    },
    {
      id: 'about' as TabView,
      label: language === 'SV' ? 'Om oss' : 'About',
      icon: 'auto_stories',
    },
    {
      id: 'contact' as TabView,
      label: language === 'SV' ? 'Kontakt' : 'Contact',
      icon: 'location_on',
    },
  ];

  return (
    <nav
      id="main-bottom-navigation"
      className="fixed bottom-0 inset-x-0 w-full z-40 pb-safe bg-[#fbf9f7]/95 backdrop-blur-xl border-t border-[#c3c8c3]/30 shadow-[0_-2px_12px_rgba(30,42,36,0.04)]"
    >
      <div className="max-w-lg mx-auto h-16 px-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              type="button"
              className={`flex flex-col items-center justify-center min-w-[54px] min-h-[48px] px-1 py-1 transition-all active:scale-95 ${
                isActive
                  ? 'text-[#091510] font-semibold'
                  : 'text-[#434845] hover:text-[#091510]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className={`material-symbols-outlined text-[22px] transition-transform ${
                    isActive ? 'scale-110' : ''
                  }`}
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {tab.icon}
                </span>
                {tab.isAccent && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#725b38]"></span>
                )}
              </div>
              <span
                className={`text-[11px] mt-0.5 tracking-tight font-sans ${
                  isActive ? 'text-[#091510] font-semibold' : 'text-[#434845]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
