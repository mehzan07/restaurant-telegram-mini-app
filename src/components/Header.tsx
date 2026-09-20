import React from 'react';
import { TabView, Language } from '../types';
import { RESTAURANT_IMAGES } from '../data/restaurantData';

interface HeaderProps {
  currentTab: TabView;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenProfile: () => void;
  savedNotesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  language,
  onLanguageChange,
  onOpenProfile,
  savedNotesCount = 0,
}) => {
  const getSubTitle = () => {
    if (language === 'SV') {
      switch (currentTab) {
        case 'home': return 'Hem';
        case 'menu': return 'Meny';
        case 'book-table': return 'Boka bord';
        case 'about': return 'Om oss';
        case 'contact': return 'Kontakt';
      }
    } else {
      switch (currentTab) {
        case 'home': return 'Home';
        case 'menu': return 'Menu';
        case 'book-table': return 'Book Table';
        case 'about': return 'About';
        case 'contact': return 'Contact';
      }
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 w-full z-40 pt-safe bg-[#fbf9f7]/90 backdrop-blur-xl border-b border-[#c3c8c3]/25 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-lg mx-auto h-16 px-4 flex items-center justify-between gap-2">
        {/* Brand Identification */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            alt="Test Restaurang Logo"
            className="h-8 w-auto object-contain shrink-0"
            src={RESTAURANT_IMAGES.logo}
          />
          <div className="flex flex-col min-w-0">
            <span className="font-sans text-[15px] font-semibold text-[#091510] tracking-tight truncate leading-tight">
              Test Restaurang
            </span>
            <span className="font-sans text-[11px] text-[#725b38] uppercase tracking-widest truncate leading-none">
              {getSubTitle()}
            </span>
          </div>
        </div>

        {/* Right utility cluster */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Language Switcher Capsule */}
          <div className="bg-[#efeeeb] rounded-full p-0.5 flex items-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] border border-[#c3c8c3]/30">
            <button
              onClick={() => onLanguageChange('EN')}
              type="button"
              className={`px-2.5 h-7 rounded-full font-sans text-[11px] font-semibold transition-all flex items-center justify-center ${
                language === 'EN'
                  ? 'bg-white text-[#091510] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                  : 'text-[#434845] hover:text-[#091510]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('SV')}
              type="button"
              className={`px-2.5 h-7 rounded-full font-sans text-[11px] font-semibold transition-all flex items-center justify-center ${
                language === 'SV'
                  ? 'bg-white text-[#091510] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                  : 'text-[#434845] hover:text-[#091510]'
              }`}
            >
              SV
            </button>
          </div>

          {/* Guest Profile & Pass Button */}
          <button
            onClick={onOpenProfile}
            type="button"
            className="relative w-8 h-8 rounded-full bg-[#091510] flex items-center justify-center text-white active:scale-95 transition-transform shadow-sm"
            title="Guest Profile & Reservations"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            {savedNotesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#725b38] text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow">
                {savedNotesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
