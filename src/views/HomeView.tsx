import React, { useState } from 'react';
import { TabView, Language, Dish } from '../types';
import { RESTAURANT_IMAGES } from '../data/restaurantData';

interface HomeViewProps {
  onNavigate: (tab: TabView) => void;
  language: Language;
  onOpenDishModal: (dishId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  language,
  onOpenDishModal,
}) => {
  const [showPairingNotes, setShowPairingNotes] = useState(false);
  const isSv = language === 'SV';

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Availability Status Pill */}
      <div
        onClick={() => onNavigate('book-table')}
        className="flex items-center justify-between py-2.5 px-4 bg-[#efeeeb] rounded-full mb-5 shadow-sm active:scale-[0.99] transition-transform cursor-pointer border border-[#c3c8c3]/30"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#725b38] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#725b38]"></span>
          </span>
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#1b1c1b]">
            {isSv ? 'Ikväll: Fåtal bord lediga' : 'Tonight: Limited tables'}
          </span>
        </div>
        <span className="font-sans text-[11px] text-[#725b38] font-medium">
          {isSv ? '20:30 • 2-4 platser' : '8:30 PM • 2-4 seats'}
        </span>
      </div>

      {/* Hero Visual Framing Card */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-md bg-[#e9e8e6] mb-6 aspect-[16/10] sm:aspect-[16/9]">
        <img
          alt="Intimate Scandinavian dining room interior at Skeppsbron"
          src={RESTAURANT_IMAGES.homeHero}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#091510]/85 via-[#091510]/35 to-transparent flex flex-col justify-end p-5">
          <span className="font-sans text-[11px] text-[#fedeb2] tracking-widest uppercase mb-1 font-medium">
            Stockholm Waterfront • Skeppsbron
          </span>
          <p className="font-serif text-[24px] sm:text-[28px] text-white leading-tight font-medium">
            {isSv
              ? 'Välkommen till Nordic Ember'
              : 'Welcome to Nordic Ember'}
          </p>
        </div>
      </div>

      {/* Editorial Headline & Narrative Block */}
      <div className="flex flex-col mb-6">
        <h1 className="font-serif text-[26px] sm:text-[30px] text-[#091510] font-normal tracking-tight mb-2 leading-snug">
          {isSv
            ? 'Nordisk gastronomi förankrad i vild natur och stilla hantverk.'
            : 'Nordic gastronomy rooted in wild nature and quiet craft.'}
        </h1>
        <p className="font-sans text-[14px] text-[#434845] leading-relaxed">
          {isSv
            ? 'Ledd av de svenska årstidernas rytm skördar vårt kök strandbotanik, kalla havsfångster och kultursäd. Varsamt tillagat över glöd med rofylld precision.'
            : 'Guided by the rhythm of Swedish seasons, our kitchen forages coastal botanicals, cold-water seafood, and heritage grains. Prepared over embers with serene precision.'}
        </p>
      </div>

      {/* Primary Interactive Actions */}
      <div className="flex flex-col gap-2.5 mb-6">
        <button
          onClick={() => onNavigate('book-table')}
          type="button"
          className="w-full h-14 bg-[#091510] text-white rounded-xl flex items-center justify-between px-5 shadow-sm active:scale-[0.98] transition-transform min-h-[48px] group"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[22px] text-[#fedeb2]">
              table_restaurant
            </span>
            <div className="flex flex-col items-start leading-none text-left">
              <span className="font-sans text-[15px] font-semibold">
                {isSv ? 'Boka bord' : 'Book a Table'}
              </span>
              <span className="font-sans text-[11px] text-[#849289] mt-0.5">
                {isSv ? 'Omedelbar bekräftelse' : 'Instant confirmation'}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[20px] text-white group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>

        <button
          onClick={() => onNavigate('menu')}
          type="button"
          className="w-full h-12 bg-[#efeeeb] text-[#091510] hover:bg-[#e4e2e0] rounded-xl flex items-center justify-between px-5 active:scale-[0.98] transition-transform min-h-[48px] border border-[#c3c8c3]/30"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px] text-[#434845]">
              restaurant_menu
            </span>
            <span className="font-sans text-[14px] font-semibold">
              {isSv ? 'Utforska säsongsmenyn' : 'Explore Seasonal Menu'}
            </span>
          </div>
          <span className="font-sans text-[11px] text-[#434845] uppercase tracking-wider font-semibold">
            {isSv ? 'Se meny' : 'View Menu'}
          </span>
        </button>
      </div>

      {/* Telegram Native Experience Banner */}
      <div className="flex items-center gap-3 p-3.5 bg-[#fedeb2]/35 border border-[#fedeb2]/60 rounded-xl mb-6">
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm text-[#725b38]">
          <span className="material-symbols-outlined text-[20px]">bolt</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-sans text-[13px] font-semibold text-[#78603e] leading-tight">
            {isSv ? 'Integrerad Telegram Mini App' : 'Telegram Mini App Integrated'}
          </span>
          <span className="font-sans text-[11px] text-[#725b38] leading-snug mt-0.5 truncate">
            {isSv
              ? 'Smidig direktbokning & notifikationer från sommelier'
              : 'Seamless instant table reservations & sommelier updates'}
          </span>
        </div>
      </div>

      {/* Quick Gastronomy Pillars / Micro Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div
          onClick={() => onNavigate('menu')}
          className="flex flex-col items-center text-center p-3 rounded-xl bg-[#f5f3f1] border border-[#c3c8c3]/30 shadow-sm active:scale-95 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#725b38] text-[22px] mb-1">
            nest_eco_leaf
          </span>
          <span className="font-sans text-[12px] font-semibold leading-tight text-[#091510]">
            {isSv ? 'Avsmakning' : 'Tasting Menu'}
          </span>
          <span className="font-sans text-[10px] text-[#434845] mt-0.5">
            {isSv ? '7 • 11 Rätter' : '7 • 11 Courses'}
          </span>
        </div>

        <div
          onClick={() => onNavigate('about')}
          className="flex flex-col items-center text-center p-3 rounded-xl bg-[#f5f3f1] border border-[#c3c8c3]/30 shadow-sm active:scale-95 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#725b38] text-[22px] mb-1">
            wine_bar
          </span>
          <span className="font-sans text-[12px] font-semibold leading-tight text-[#091510]">
            {isSv ? 'Naturviner' : 'Natural Wines'}
          </span>
          <span className="font-sans text-[10px] text-[#434845] mt-0.5">
            {isSv ? 'Små Odlare' : 'Small Growers'}
          </span>
        </div>

        <div
          onClick={() => onNavigate('contact')}
          className="flex flex-col items-center text-center p-3 rounded-xl bg-[#f5f3f1] border border-[#c3c8c3]/30 shadow-sm active:scale-95 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#725b38] text-[22px] mb-1">
            water_drop
          </span>
          <span className="font-sans text-[12px] font-semibold leading-tight text-[#091510]">
            {isSv ? 'Sjöläge' : 'Harbor View'}
          </span>
          <span className="font-sans text-[10px] text-[#434845] mt-0.5">
            Skeppsbron 14
          </span>
        </div>
      </div>

      {/* Chef's Recommendation Section */}
      <div className="flex flex-col mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-widest text-[#725b38] font-semibold">
              {isSv ? 'Köksmästarens val' : "Chef's Selection"}
            </span>
            <h2 className="font-serif text-[20px] font-medium text-[#091510]">
              {isSv ? 'Kockens signaturrätt' : "Chef's Signature Feature"}
            </h2>
          </div>
          <span className="font-sans text-[11px] text-[#434845] bg-[#efeeeb] px-2.5 py-1 rounded-full border border-[#c3c8c3]/30">
            {isSv ? 'Sensommar & Höst' : 'Late Summer & Autumn'}
          </span>
        </div>

        {/* Feature Dish Card */}
        <div className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-[#c3c8c3]/40 flex flex-col">
          <div className="relative w-full h-44 overflow-hidden bg-[#efeeeb]">
            <img
              alt="Roasted Arctic Char with dill foam"
              src={RESTAURANT_IMAGES.charFeature}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-[#091510]/90 backdrop-blur-md px-2.5 py-1 rounded-full text-white font-sans text-[13px] font-semibold">
              325 SEK
            </div>
            <div className="absolute bottom-2.5 left-3 flex gap-1.5">
              <span className="px-2 py-0.5 rounded bg-white/90 backdrop-blur-sm text-[#091510] font-sans text-[10px] tracking-wider uppercase font-semibold">
                GF
              </span>
              <span className="px-2 py-0.5 rounded bg-white/90 backdrop-blur-sm text-[#091510] font-sans text-[10px] tracking-wider uppercase font-semibold">
                {isSv ? 'Lokalfångst' : 'Local Catch'}
              </span>
            </div>
          </div>

          <div className="p-4 flex flex-col">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-serif text-[18px] font-medium text-[#091510]">
                {isSv ? 'Röding & Krondill' : 'Arctic Char & Crown Dill'}
              </h3>
              <span className="font-sans text-[11px] text-[#725b38] font-semibold uppercase tracking-wider">
                {isSv ? 'Röding' : 'Arctic Char'}
              </span>
            </div>
            <p className="font-sans text-[13px] text-[#434845] mb-3 leading-relaxed">
              {isSv
                ? 'Rökt över björkbark, emulsion på konserverad fläderblom, havtornspärlor och vildplockade granskott.'
                : 'Smoked over birch bark, preserved elderflower emulsion, sea buckthorn pearls, and wild pickled spruce shoots.'}
            </p>

            <button
              onClick={() => setShowPairingNotes(!showPairingNotes)}
              type="button"
              className="w-full min-h-[44px] py-2.5 bg-[#efeeeb] hover:bg-[#e4e2e0] rounded-lg flex items-center justify-center gap-2 text-[#091510] font-sans text-[13px] font-medium transition-colors"
            >
              <span>
                {showPairingNotes
                  ? isSv ? 'Dölj sommeliernotis' : 'Hide Pairing Notes'
                  : isSv ? 'Utforska sommeliernotis' : 'Explore Pairing Notes'}
              </span>
              <span className="material-symbols-outlined text-[18px]">
                {showPairingNotes ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Expandable Sommelier Note */}
            {showPairingNotes && (
              <div className="flex flex-col mt-3 pt-3 bg-[#f5f3f1] p-3 rounded-lg border border-[#c3c8c3]/30 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 mb-1 text-[#725b38]">
                  <span className="material-symbols-outlined text-[16px]">local_bar</span>
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-wider">
                    {isSv ? 'Sommelierens matchning' : 'Sommelier Pairing'}
                  </span>
                </div>
                <p className="font-sans text-[12px] text-[#1b1c1b] leading-relaxed">
                  {isSv
                    ? '2021 Gut Oggau \'Theodora\', Burgenland. Biodynamisk Grüner Veltliner & Welschriesling med krispig sälta som skär genom den rökta rödingens fetma.'
                    : '2021 Gut Oggau \'Theodora\', Burgenland. Biodynamic Grüner Veltliner & Welschriesling with crystalline salinity cut through the rich smoked char.'}
                </p>
                <button
                  onClick={() => onOpenDishModal('char')}
                  className="mt-2 text-[11px] font-semibold text-[#725b38] underline text-left self-start hover:opacity-80"
                >
                  {isSv ? 'Öppna fullständig rättsspecifikation →' : 'View full course detail →'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Opening Hours & Service Rhythm */}
      <div className="p-4 rounded-xl bg-[#efeeeb] border border-[#c3c8c3]/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#725b38] text-[18px]">
              schedule
            </span>
            <span className="font-sans text-[13px] font-semibold text-[#091510]">
              {isSv ? 'Bordsbokning & Service' : 'Table Reservations & Service'}
            </span>
          </div>
          <span className="font-sans text-[11px] text-[#434845]">
            {isSv ? 'Tis – Sön' : 'Tue – Sun'}
          </span>
        </div>

        <div className="flex justify-between font-sans text-[13px] text-[#434845]">
          <span>{isSv ? 'Matsal (Kvällsservering)' : 'Dining Room (Dinner Service)'}</span>
          <span className="font-semibold text-[#091510]">17:30 – 23:00</span>
        </div>
        <div className="flex justify-between font-sans text-[13px] text-[#434845] mt-1">
          <span>{isSv ? 'Vinbar & Smårätter' : 'Wine Bar & Small Plates'}</span>
          <span className="font-semibold text-[#091510]">{isSv ? '16:00 – Sent' : '16:00 – Late'}</span>
        </div>
      </div>
    </div>
  );
};
