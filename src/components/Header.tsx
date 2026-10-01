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
  switch (language) {
    case 'SV':
      switch (currentTab) {
        case 'home':
          return 'Hem';
        case 'menu':
          return 'Meny';
        case 'book-table':
          return 'Boka bord';
        case 'about':
          return 'Om oss';
        case 'contact':
          return 'Kontakt';
        default:
          return '';
      }

    case 'FA':
      switch (currentTab) {
        case 'home':
          return 'خانه';
        case 'menu':
          return 'منو';
        case 'book-table':
          return 'رزرو میز';
        case 'about':
          return 'درباره ما';
        case 'contact':
          return 'تماس';
        default:
          return '';
      }

    case 'TR':
      switch (currentTab) {
        case 'home':
          return 'Ana Sayfa';
        case 'menu':
          return 'Menü';
        case 'book-table':
          return 'Masa Ayırt';
        case 'about':
          return 'Hakkımızda';
        case 'contact':
          return 'İletişim';
        default:
          return '';
      }

    case 'EN':
    default:
      switch (currentTab) {
        case 'home':
          return 'Home';
        case 'menu':
          return 'Menu';
        case 'book-table':
          return 'Book Table';
        case 'about':
          return 'About';
        case 'contact':
          return 'Contact';
        default:
          return '';
      }
  }
};

const getLanguageLabel = () => {
  switch (language) {
    case 'SV':
      return 'Svenska';
    case 'FA':
      return 'فارسی';
    case 'TR':
      return 'Türkçe';
    case 'EN':
    default:
      return 'English';
  }
};

const getLanguageTitle = () => {
  switch (language) {
    case 'SV':
      return 'Språk';
    case 'FA':
      return 'زبان';
    case 'TR':
      return 'Dil';
    case 'EN':
    default:
      return 'Language';
  }
};

  return (
    <header className="fixed top-0 inset-x-0 w-full z-40 pt-safe bg-[#fbf9f7]/90 backdrop-blur-xl border-b border-[#c3c8c3]/25 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-lg md:max-w-2xl lg:max-w-5xl mx-auto h-16 px-4 md:px-6 lg:px-8 flex items-center justify-between gap-2">
        {/* Brand Identification */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            alt="Nordic Ember Logo"
            className="h-16 w-16 object-contain shrink-0"
            src={RESTAURANT_IMAGES.logo}
          />

          <div className="flex flex-col min-w-0">
            <span className="font-sans text-[15px] font-semibold text-[#091510] tracking-tight truncate leading-tight">
              Nordic Ember
            </span>

            <span className="font-sans text-[11px] text-[#725b38] uppercase tracking-widest truncate leading-none">
              {getSubTitle()}
            </span>
          </div>
        </div>

        {/* Right utility cluster */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Admin */}
          <a
            href="/admin"
            className="h-8 px-3 rounded-full bg-[#091510] text-white flex items-center justify-center gap-1.5 font-sans text-[11px] font-semibold tracking-wide active:scale-95 transition-transform shadow-sm"
            title="Admin Dashboard"
          >
            <span className="material-symbols-outlined text-[16px]">
              admin_panel_settings
            </span>
            <span>Admin</span>
          </a>

{/* Language Dropdown */}
<div
  className="relative flex items-center gap-1.5 bg-[#efeeeb] rounded-full px-3 h-9 min-w-[126px] border border-[#c3c8c3]/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden"
  dir={language === 'FA' ? 'rtl' : 'ltr'}
>
  <span className="font-sans text-[11px] font-semibold text-[#434845] tracking-wide whitespace-nowrap pointer-events-none">
    {getLanguageTitle()}
  </span>

  <span className="font-sans text-[12px] font-semibold text-[#091510] whitespace-nowrap pointer-events-none flex-1 text-center">
    {getLanguageLabel()}
  </span>

  <span className="material-symbols-outlined text-[17px] text-[#725b38] pointer-events-none shrink-0">
    expand_more
  </span>

  <select
    value={language}
    onChange={(event) =>
      onLanguageChange(event.target.value as Language)
    }
    aria-label={getLanguageTitle()}
    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
  >
    <option value="EN">English</option>
    <option value="SV">Svenska</option>
    <option value="FA">فارسی</option>
    <option value="TR">Türkçe</option>
  </select>
</div>


          {/* Guest Profile & Pass Button */}
          <button
            onClick={onOpenProfile}
            type="button"
            className="relative w-8 h-8 rounded-full bg-[#091510] flex items-center justify-center text-white active:scale-95 transition-transform shadow-sm"
            title="Guest Profile & Reservations"
          >
            <span className="material-symbols-outlined text-[18px]">
              person
            </span>

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
