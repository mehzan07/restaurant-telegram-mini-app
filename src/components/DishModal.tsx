import React from 'react';
import { Dish, Language } from '../types';

interface DishModalProps {
  dish: Dish | null;
  onClose: () => void;
  language: Language;
  onAddToTastingNotes: (dish: Dish) => void;
  isSaved?: boolean;
}

export const DishModal: React.FC<DishModalProps> = ({
  dish,
  onClose,
  language,
  onAddToTastingNotes,
  isSaved = false,
}) => {
  if (!dish) return null;

  const isSv = language === 'SV';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#091510]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Sheet */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#fbf9f7] rounded-t-3xl shadow-2xl z-10 flex flex-col p-6 pb-10 border-t border-[#c3c8c3]/40 animate-in slide-in-from-bottom duration-300">
        {/* Handle */}
        <div className="w-12 h-1 rounded-full bg-[#e4e2e0] mx-auto mb-4 shrink-0" />

        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#fedeb2] text-[#281800] font-sans text-[11px] font-semibold tracking-wider uppercase">
                {dish.tagLabel || (isSv ? 'Nordisk Klassiker' : 'Nordic Classic')}
              </span>
              {dish.tags.includes('gf') && (
                <span className="px-2 py-0.5 rounded-full bg-[#efeeeb] text-[#434845] font-sans text-[11px] font-medium uppercase">
                  GF
                </span>
              )}
            </div>
            <h3 className="font-serif text-[24px] font-medium text-[#091510] leading-tight">
              {isSv ? dish.titleSv : dish.title}
            </h3>
            <p className="font-sans text-[13px] text-[#725b38] mt-0.5">
              {isSv ? dish.subSv : dish.sub}
            </p>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-full bg-[#efeeeb] flex items-center justify-center text-[#1b1c1b] hover:bg-[#e4e2e0] transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 mb-4 pb-3 border-b border-[#e4e2e0]">
          <span className="font-serif text-[20px] text-[#091510] font-medium">
            {dish.price} SEK
          </span>
          <span className="font-sans text-[12px] text-[#434845]">
            {isSv ? 'Inklusive moms och köksservice' : 'Tax and kitchen service included'}
          </span>
        </div>

        {/* Narrative & Culinary Details */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <h4 className="font-sans text-[11px] text-[#434845] uppercase tracking-wider font-semibold">
              {isSv ? 'Kulinarisk Filosofi' : 'Culinary Philosophy'}
            </h4>
            <p className="font-sans text-[14px] text-[#1b1c1b] leading-relaxed">
              {isSv ? dish.descSv : dish.desc}
            </p>
          </div>

          {/* Sommelier Pairing Card */}
          <div className="p-4 rounded-xl bg-[#f5f3f1] border border-[#c3c8c3]/30 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[#725b38]">
              <span className="material-symbols-outlined text-[18px]">wine_bar</span>
              <h4 className="font-sans text-[12px] uppercase tracking-wider font-semibold">
                {isSv ? 'Sommelierens Vinrekommendation' : 'Sommelier Pairing'}
              </h4>
            </div>
            <p className="font-sans text-[14px] font-semibold text-[#091510]">
              {dish.pairing}
            </p>
            <p className="font-sans text-[13px] text-[#434845] leading-relaxed">
              {isSv ? dish.pairingNotesSv : dish.pairingNotes}
            </p>
          </div>

          {/* Dietary & Allergens */}
          <div className="flex items-center gap-3 p-3 px-4 rounded-xl bg-[#efeeeb] border border-[#c3c8c3]/30">
            <span className="material-symbols-outlined text-[#434845] text-[20px]">
              health_and_safety
            </span>
            <div className="flex flex-col">
              <span className="font-sans text-[11px] text-[#434845] uppercase tracking-wide">
                {isSv ? 'Allergener & Kosthållning' : 'Dietary & Allergens'}
              </span>
              <span className="font-sans text-[13px] text-[#091510] font-medium">
                {isSv ? dish.allergensSv : dish.allergens}
              </span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onAddToTastingNotes(dish)}
            type="button"
            className="flex-1 h-12 rounded-xl bg-[#091510] text-white font-sans text-[13px] font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-[#1e2a24] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSaved ? 'check' : 'bookmark_add'}
            </span>
            <span>
              {isSaved
                ? isSv ? 'Sparad i provsmakningslistan' : 'Saved to tasting notes'
                : isSv ? 'Lägg till i bordsönskemål' : 'Add to Reservation Tasting Note'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
