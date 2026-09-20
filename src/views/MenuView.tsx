import React, { useState, useMemo } from 'react';
import { Dish, Language, TabView } from '../types';
import { DISHES } from '../data/restaurantData';
import { TastingMenuModal } from '../components/TastingMenuModal';

interface MenuViewProps {
  language: Language;
  onSelectDish: (dish: Dish) => void;
  onNavigate: (tab: TabView) => void;
  onShowToast: (msg: string) => void;
}

export const MenuView: React.FC<MenuViewProps> = ({
  language,
  onSelectDish,
  onNavigate,
  onShowToast,
}) => {
  const isSv = language === 'SV';

  const [activeCategory, setActiveCategory] = useState<'starters' | 'mains' | 'desserts' | 'drinks'>('mains');
  const [activeDietFilter, setActiveDietFilter] = useState<'all' | 'local' | 'gf' | 'vg'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTastingModalOpen, setIsTastingModalOpen] = useState(false);

  const filteredDishes = useMemo(() => {
    return DISHES.filter((dish) => {
      // Category filter (if search is empty, respect category; if user searches, search across all or current)
      if (searchQuery.trim() === '' && dish.category !== activeCategory) {
        return false;
      }

      // Dietary filter
      if (activeDietFilter !== 'all' && !dish.tags.includes(activeDietFilter)) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = dish.title.toLowerCase().includes(query) || dish.titleSv.toLowerCase().includes(query);
        const matchesSub = dish.sub.toLowerCase().includes(query) || dish.subSv.toLowerCase().includes(query);
        const matchesDesc = dish.desc.toLowerCase().includes(query) || dish.descSv.toLowerCase().includes(query);
        const matchesPairing = dish.pairing.toLowerCase().includes(query);
        return matchesTitle || matchesSub || matchesDesc || matchesPairing;
      }

      return true;
    });
  }, [activeCategory, activeDietFilter, searchQuery]);

  const categoryTitles = {
    starters: isSv ? 'Förrätter' : 'Starters',
    mains: isSv ? 'Varmrätter' : 'Mains',
    desserts: isSv ? 'Efterrätter' : 'Desserts',
    drinks: isSv ? 'Dryck & Vin' : 'Drinks & Wine',
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Search Input Bar */}
      <div className="flex flex-col gap-3 mb-6 pt-1">
        <div className="relative w-full flex items-center border-b border-[#c3c8c3]/40 pb-2 transition-colors focus-within:border-[#091510]">
          <span className="material-symbols-outlined text-[#434845]/70 text-[18px] mr-2.5 font-light">
            search
          </span>
          <input
            id="menuSearchInput"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isSv
                ? 'Sök röding, kantarell, renkalv, hjortron...'
                : 'Search Arctic Char, Chanterelle, Cloudberry...'
            }
            className="w-full bg-transparent font-sans text-[14px] text-[#091510] placeholder:text-[#434845]/50 focus:outline-none tracking-wide"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              type="button"
              className="text-[#434845]/60 hover:text-[#091510] p-1"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Dietary Filters */}
        <div className="flex items-center gap-3 overflow-x-auto py-1 no-scrollbar text-[12px]">
          <button
            onClick={() => setActiveDietFilter('all')}
            className={`transition-all shrink-0 pb-0.5 ${
              activeDietFilter === 'all'
                ? 'text-[#091510] font-semibold border-b-2 border-[#091510]'
                : 'text-[#434845]/70 hover:text-[#091510]'
            }`}
          >
            {isSv ? 'Alla rätter' : 'All Courses'}
          </button>

          <button
            onClick={() => setActiveDietFilter('local')}
            className={`transition-all shrink-0 pb-0.5 flex items-center gap-1.5 ${
              activeDietFilter === 'local'
                ? 'text-[#091510] font-semibold border-b-2 border-[#091510]'
                : 'text-[#434845]/70 hover:text-[#091510]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#725b38]"></span>
            <span>{isSv ? 'Lokalt & Vildplockat' : 'Local & Foraged'}</span>
          </button>

          <button
            onClick={() => setActiveDietFilter('gf')}
            className={`transition-all shrink-0 pb-0.5 ${
              activeDietFilter === 'gf'
                ? 'text-[#091510] font-semibold border-b-2 border-[#091510]'
                : 'text-[#434845]/70 hover:text-[#091510]'
            }`}
          >
            {isSv ? 'Naturligt glutenfritt' : 'Naturally Gluten-Free'}
          </button>

          <button
            onClick={() => setActiveDietFilter('vg')}
            className={`transition-all shrink-0 pb-0.5 ${
              activeDietFilter === 'vg'
                ? 'text-[#091510] font-semibold border-b-2 border-[#091510]'
                : 'text-[#434845]/70 hover:text-[#091510]'
            }`}
          >
            {isSv ? 'Vegetarisk flora' : 'Vegetarian Flora'}
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="relative w-full mb-6 overflow-x-auto no-scrollbar border-b border-[#c3c8c3]/30 pb-1">
        <div className="flex items-center gap-6 min-w-max">
          {(['starters', 'mains', 'desserts', 'drinks'] as const).map((cat) => {
            const isActive = activeCategory === cat;
            const subs = {
              starters: isSv ? '(Förrätter)' : '(Starters)',
              mains: isSv ? '(Varmrätter)' : '(Mains)',
              desserts: isSv ? '(Efterrätter)' : '(Desserts)',
              drinks: isSv ? '(Vinkällare)' : '(Cellar)',
            };
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchQuery('');
                }}
                className={`flex items-baseline gap-1.5 pb-2 transition-all ${
                  isActive
                    ? 'text-[#091510] border-b-2 border-[#091510] font-semibold'
                    : 'text-[#434845]/60 hover:text-[#091510]'
                }`}
              >
                <span className="font-sans text-[12px] uppercase tracking-widest">
                  {categoryTitles[cat]}
                </span>
                <span className="font-sans text-[11px] italic opacity-60">
                  {subs[cat]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Header */}
      <div className="flex items-end justify-between mb-6 px-0.5 border-b border-[#c3c8c3]/30 pb-3">
        <div className="flex flex-col">
          <span className="font-sans text-[11px] text-[#725b38] uppercase tracking-widest font-semibold">
            {isSv ? 'Höstskörd · Avsmakningsmeny' : 'Autumn Harvest · Tasting Ledger'}
          </span>
          <h2 className="font-serif text-[24px] text-[#091510] mt-1 font-normal">
            {categoryTitles[activeCategory]} &amp; {isSv ? 'Säsong' : 'Season'}
          </h2>
        </div>
        <span className="font-sans text-[12px] text-[#434845]/80 italic">
          {filteredDishes.length} {isSv ? 'Utvalda rätter' : 'Curated courses'}
        </span>
      </div>

      {/* Dishes List */}
      <div className="flex flex-col gap-6" id="dishesList">
        {filteredDishes.map((dish) => (
          <article
            key={dish.id}
            onClick={() => onSelectDish(dish)}
            className="group relative flex flex-col cursor-pointer pb-6 border-b border-[#c3c8c3]/30 active:scale-[0.99] transition-transform"
          >
            {dish.imageUrl && (
              <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl bg-[#efeeeb] mb-3.5 shadow-sm border border-[#c3c8c3]/30">
                <img
                  alt={dish.title}
                  src={dish.imageUrl}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[#091510] font-sans text-[10px] tracking-widest uppercase border border-[#c3c8c3]/30 font-medium">
                    {isSv ? (dish.tagLabelSv || 'Signatur') : (dish.tagLabel || 'Signature')}
                  </span>
                  {dish.tags.includes('gf') && (
                    <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[#725b38] font-sans text-[10px] tracking-widest uppercase border border-[#c3c8c3]/30 font-medium">
                      GF
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-serif text-[20px] text-[#091510] group-hover:text-[#725b38] transition-colors">
                    {isSv ? dish.titleSv : dish.title}
                  </h3>
                  {dish.isSignature && (
                    <span className="font-sans text-[11px] italic text-[#725b38]">
                      {isSv ? 'Signatur' : 'Signature'}
                    </span>
                  )}
                  {dish.tags.includes('gf') && !dish.imageUrl && (
                    <span className="font-sans text-[9px] uppercase tracking-widest text-[#434845]/70 border border-[#c3c8c3] px-1.5 py-0.5 rounded">
                      GF
                    </span>
                  )}
                  {dish.tags.includes('vg') && (
                    <span className="font-sans text-[9px] uppercase tracking-widest text-[#434845]/70 border border-[#c3c8c3] px-1.5 py-0.5 rounded">
                      VG
                    </span>
                  )}
                </div>
                <div className="font-sans text-[16px] text-[#091510] shrink-0 font-medium tracking-tight">
                  {dish.price} SEK{' '}
                  <span className="font-sans text-[11px] text-[#434845]/60 font-normal">
                    / ~${Math.round(dish.price / 10.8)}
                  </span>
                </div>
              </div>

              <p className="font-sans text-[11px] text-[#725b38] tracking-wide uppercase font-semibold">
                {isSv ? dish.subSv : dish.sub}
              </p>

              <p className="font-sans text-[13px] text-[#434845] leading-relaxed mt-1">
                {isSv ? dish.descSv : dish.desc}
              </p>

              {/* Pairing Preview */}
              <div className="mt-2 pt-1 flex items-center justify-between text-[#434845]">
                <div className="flex items-center gap-1.5 font-sans text-[11px] text-[#725b38]">
                  <span className="material-symbols-outlined text-[15px]">wine_bar</span>
                  <span className="italic">
                    {isSv ? 'Matchning:' : 'Pairing:'} {dish.pairing}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-sans text-[11px] text-[#434845]/80 group-hover:text-[#091510]">
                  <span className="tracking-wider uppercase text-[10px]">
                    {isSv ? 'Detaljer' : 'Details'}
                  </span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Autumn Tasting Menu Banner Card */}
      <div className="mt-8 p-5 rounded-2xl border border-[#c3c8c3]/40 bg-[#f5f3f1] flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[#725b38]/40 text-[#725b38] flex items-center justify-center shrink-0 bg-white">
            <span className="material-symbols-outlined text-[20px]">
              temp_preferences_custom
            </span>
          </div>
          <div>
            <p className="font-serif text-[17px] text-[#091510] font-medium">
              {isSv ? 'Höstens 6-Rätters Avsmakning' : 'Autumn 6-Course Tasting'}
            </p>
            <p className="font-sans text-[11px] text-[#434845] mt-0.5">
              {isSv ? 'Kvällsservering · 1 150 SEK per gäst' : 'Nightly seating · 1,150 SEK per guest'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsTastingModalOpen(true)}
          type="button"
          className="px-4 py-2.5 rounded-full border border-[#091510] bg-[#091510] text-white hover:bg-[#1e2a24] font-sans uppercase tracking-wider text-[11px] font-semibold shrink-0 transition-all shadow-sm active:scale-95"
        >
          {isSv ? 'Visa avsmakningsmeny' : 'View Tasting Menu'}
        </button>
      </div>

      {/* 6-Course Tasting Menu Modal Sheet */}
      <TastingMenuModal
        isOpen={isTastingModalOpen}
        onClose={() => setIsTastingModalOpen(false)}
        language={language}
        onBookTastingMenu={() => {
          setIsTastingModalOpen(false);
          onNavigate('book-table');
          onShowToast(isSv ? '6-rätters avsmakning vald!' : 'Selected 6-course tasting menu!');
        }}
      />
    </div>
  );
};
