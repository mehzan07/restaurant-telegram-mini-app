import React from 'react';
import { ConfirmedBooking, Dish, Language } from '../types';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  confirmedBookings: ConfirmedBooking[];
  savedDishes: Dish[];
  onRemoveDish: (id: string) => void;
  onNavigateToBooking: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  language,
  confirmedBookings,
  savedDishes,
  onRemoveDish,
  onNavigateToBooking,
}) => {
  if (!isOpen) return null;

  const isSv = language === 'SV';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#091510]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-[#fbf9f7] h-full shadow-2xl z-10 flex flex-col pt-safe pb-safe overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-[#c3c8c3]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#091510] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </div>
            <div>
              <h3 className="font-serif text-[18px] font-medium text-[#091510]">
                {isSv ? 'Gästprofil & Pass' : 'Guest Pass & Profile'}
              </h3>
              <p className="font-sans text-[11px] text-[#725b38] uppercase tracking-wider">
                Test Restaurang Stockholm
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-full bg-[#efeeeb] flex items-center justify-center text-[#1b1c1b] hover:bg-[#e4e2e0]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-6">
          {/* Active Reservations */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[11px] font-semibold text-[#725b38] uppercase tracking-widest">
                {isSv ? 'Aktiva Bordsbokningar' : 'Active Reservations'}
              </span>
              <span className="font-sans text-[12px] text-[#434845]">
                {confirmedBookings.length} {isSv ? 'bokning' : 'pass'}
              </span>
            </div>

            {confirmedBookings.length === 0 ? (
              <div className="p-5 rounded-xl bg-[#f5f3f1] border border-[#c3c8c3]/30 text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-[#725b38] text-[28px]">
                  table_restaurant
                </span>
                <p className="font-sans text-[13px] text-[#434845]">
                  {isSv
                    ? 'Inga aktiva reservationer ännu. Boka ett bord i vår matsal ikväll.'
                    : 'No active reservations yet. Secure an intimate table for tonight.'}
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToBooking();
                  }}
                  className="mt-1 px-4 py-2 rounded-lg bg-[#091510] text-white font-sans text-[12px] font-medium active:scale-95 transition-all"
                >
                  {isSv ? 'Reservera bord nu' : 'Reserve a Table'}
                </button>
              </div>
            ) : (
              confirmedBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl bg-white border border-[#c3c8c3]/40 shadow-sm flex flex-col gap-2 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-[#efeeeb] pb-2">
                    <span className="font-mono text-[12px] font-bold text-[#091510]">
                      {b.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#fedeb2]/70 text-[#78603e] font-sans text-[10px] font-semibold uppercase">
                      {isSv ? 'Bekräftad' : 'Confirmed'}
                    </span>
                  </div>
                  <div className="text-[13px] text-[#1b1c1b] font-medium flex justify-between">
                    <span>{b.guests} {typeof b.guests === 'number' && b.guests === 1 ? (isSv ? 'Gäst' : 'Guest') : (isSv ? 'Gäster' : 'Guests')}</span>
                    <span>{b.date} · {b.time}</span>
                  </div>
                  <div className="text-[12px] text-[#434845] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-[#725b38]">
                      deck
                    </span>
                    <span>{b.seatingArea}</span>
                  </div>
                  <div className="text-[11px] text-[#737874] italic">
                    {b.fullName} ({b.phone})
                  </div>
                </div>
              ))
            )}
          </section>

          {/* Tasting Wishlist / Notes */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[11px] font-semibold text-[#725b38] uppercase tracking-widest">
                {isSv ? 'Mina Provsmakningsnoteringar' : 'Curated Tasting Wishlist'}
              </span>
              <span className="font-sans text-[12px] text-[#434845]">
                {savedDishes.length} {isSv ? 'rätter' : 'dishes'}
              </span>
            </div>

            {savedDishes.length === 0 ? (
              <p className="font-sans text-[13px] text-[#434845] italic p-3 bg-[#f5f3f1] rounded-lg">
                {isSv
                  ? 'Klicka på valfri rätt i menyn för att spara den till dina personliga bordsönskemål.'
                  : 'Tap any course in the menu to add it to your dining tasting notes.'}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {savedDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="p-3 rounded-xl bg-white border border-[#c3c8c3]/30 flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="font-serif text-[14px] font-medium text-[#091510] truncate">
                        {isSv ? dish.titleSv : dish.title}
                      </span>
                      <span className="font-sans text-[11px] text-[#725b38] truncate">
                        {dish.pairing}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-sans text-[13px] font-semibold text-[#091510]">
                        {dish.price} SEK
                      </span>
                      <button
                        onClick={() => onRemoveDish(dish.id)}
                        className="text-[#737874] hover:text-[#ba1a1a] p-1"
                        title="Remove note"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Telegram Concierge */}
          <div className="p-4 rounded-xl bg-[#fedeb2]/40 border border-[#fedeb2] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0 text-[#725b38] shadow-sm">
              <span className="material-symbols-outlined text-[20px]">bolt</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-sans text-[13px] font-semibold text-[#281800]">
                Telegram Mini App Concierge
              </span>
              <span className="font-sans text-[11px] text-[#78603e] leading-snug">
                {isSv
                  ? 'Direktlänk till hovmästare & påminnelser i Telegram'
                  : 'Instant live pass & cellar notices via Telegram'}
              </span>
            </div>
            <a
              href="https://t.me/TestRestaurantBot"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-full bg-[#091510] text-white text-[11px] font-medium shrink-0"
            >
              {isSv ? 'Öppna' : 'Open'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
