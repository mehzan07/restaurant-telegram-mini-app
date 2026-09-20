import React from 'react';
import { Language } from '../types';
import { TASTING_MENU_COURSES } from '../data/restaurantData';

interface TastingMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onBookTastingMenu: () => void;
}

export const TastingMenuModal: React.FC<TastingMenuModalProps> = ({
  isOpen,
  onClose,
  language,
  onBookTastingMenu,
}) => {
  if (!isOpen) return null;

  const isSv = language === 'SV';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#091510]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Sheet */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#fbf9f7] rounded-t-3xl shadow-2xl z-10 flex flex-col p-6 pb-12 border-t border-[#c3c8c3]/40 animate-in slide-in-from-bottom duration-300">
        {/* Drag handle */}
        <div className="w-12 h-1 rounded-full bg-[#c3c8c3] mx-auto mb-4 shrink-0" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-[#e4e2e0]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#fedeb2] text-[#281800] font-sans text-[11px] font-semibold tracking-wider uppercase">
                {isSv ? '6 Serveringar' : '6 Courses'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#efeeeb] text-[#434845] font-sans text-[11px] font-medium uppercase">
                {isSv ? 'Höstsäsong' : 'Autumn Season'}
              </span>
            </div>
            <h2 className="font-serif text-[24px] font-medium text-[#091510] leading-tight">
              {isSv ? 'Höstens 6-Rätters Avsmakningsmeny' : 'Autumn 6-Course Tasting Menu'}
            </h2>
            <p className="font-sans text-[13px] text-[#725b38] font-medium mt-1">
              {isSv
                ? 'Kvällsservering · 1 150 SEK per gäst · Vinpaket 680 SEK'
                : 'Nightly service · 1,150 SEK per guest · Wine flight 680 SEK'}
            </p>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-full bg-[#efeeeb] flex items-center justify-center text-[#1b1c1b] hover:bg-[#e4e2e0] transition-colors shrink-0"
            title={isSv ? 'Stäng' : 'Close'}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Narrative introduction */}
        <div className="p-3.5 rounded-xl bg-[#f5f3f1] border border-[#c3c8c3]/30 mb-6">
          <p className="font-sans text-[13px] text-[#434845] leading-relaxed">
            {isSv
              ? 'En stilla gastronomisk resa genom Sveriges kalla hav, vilda tallhedar och subarktiska myrar. Samtliga rätter tillagas över glöd med rofyllt nordiskt hantverk.'
              : 'A serene gastronomic sequence across Sweden’s cold waters, primeval pine forests, and subarctic marshes. Every course is crafted over embers with quiet Nordic precision.'}
          </p>
        </div>

        {/* 6 Courses List */}
        <div className="space-y-4 mb-6">
          {TASTING_MENU_COURSES.map((course) => (
            <div
              key={course.courseNumber}
              className="p-4 rounded-2xl bg-white border border-[#c3c8c3]/40 shadow-sm flex flex-col gap-2 relative"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-sans text-[11px] font-bold text-[#725b38] uppercase tracking-wider">
                  {isSv ? course.categorySv : course.category}
                </span>
                <span className="w-6 h-6 rounded-full bg-[#efeeeb] text-[#091510] text-[12px] font-bold flex items-center justify-center shrink-0">
                  {course.courseNumber}
                </span>
              </div>

              <h3 className="font-serif text-[17px] font-medium text-[#091510] leading-snug">
                {isSv ? course.nameSv : course.name}
              </h3>

              <p className="font-sans text-[13px] text-[#434845] leading-relaxed">
                {isSv ? course.descSv : course.desc}
              </p>

              {/* Pairing note */}
              <div className="mt-1 pt-2 border-t border-[#efeeeb] flex items-start gap-2 text-[12px] text-[#725b38]">
                <span className="material-symbols-outlined text-[15px] shrink-0 mt-0.5">
                  wine_bar
                </span>
                <span className="font-sans leading-tight">
                  <strong className="font-semibold text-[#091510]">
                    {isSv ? 'Vinmatchning: ' : 'Wine Pairing: '}
                  </strong>
                  {isSv ? course.pairingSv : course.pairing}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 pt-2 border-t border-[#e4e2e0]">
          <button
            onClick={() => {
              onClose();
              onBookTastingMenu();
            }}
            type="button"
            className="flex-1 h-13 py-3 px-4 rounded-xl bg-[#091510] text-white font-sans text-[14px] font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-[#1e2a24] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[20px] text-[#fedeb2]">
              table_restaurant
            </span>
            <span>
              {isSv ? 'Boka bord för avsmakningsmeny' : 'Book Table for Tasting Menu'}
            </span>
          </button>

          <button
            onClick={onClose}
            type="button"
            className="h-13 py-3 px-5 rounded-xl bg-[#efeeeb] text-[#1b1c1b] font-sans text-[14px] font-medium hover:bg-[#e4e2e0] active:scale-[0.98] transition-all"
          >
            {isSv ? 'Stäng' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
