import React, { useState, useMemo } from 'react';
import { BookingState, ConfirmedBooking, Language } from '../types';
import {
  generateBookingDates,
  getBaseCurrentDate,
  getAvailableMonths,
  TIME_SLOTS,
  SEATING_AREAS,
  RESTAURANT_IMAGES,
} from '../data/restaurantData';

interface BookTableViewProps {
  language: Language;
  onBookingConfirmed: (booking: ConfirmedBooking) => void;
  onShowToast: (msg: string) => void;
}

export const BookTableView: React.FC<BookTableViewProps> = ({
  language,
  onBookingConfirmed,
  onShowToast,
}) => {
  const isSv = language === 'SV';

  // 1. Dynamic Dates starting chronologically from actual system date (2026-09-20)
  const bookingDates = useMemo(
    () => generateBookingDates(getBaseCurrentDate(), 180),
    []
  );

  const availableMonths = useMemo(
    () => getAvailableMonths(bookingDates),
    [bookingDates]
  );

  const [selectedDateKey, setSelectedDateKey] = useState<string>(
    bookingDates[0]?.key || '2026-09-20'
  );

  // Window state for navigating dates chronologically
  const WINDOW_SIZE = 7;
  const [viewStartIndex, setViewStartIndex] = useState<number>(0);

  const isAtEarliest = viewStartIndex <= 0;
  const canGoNext = viewStartIndex + WINDOW_SIZE < bookingDates.length;

  const handlePrevWindow = () => {
    setViewStartIndex((prev) => Math.max(0, prev - WINDOW_SIZE));
  };

  const handleNextWindow = () => {
    setViewStartIndex((prev) => Math.min(bookingDates.length - WINDOW_SIZE, prev + WINDOW_SIZE));
  };

  const handleSelectMonth = (firstIndex: number) => {
    setViewStartIndex(firstIndex);
  };

  const visibleDates = useMemo(
    () => bookingDates.slice(viewStartIndex, viewStartIndex + WINDOW_SIZE),
    [bookingDates, viewStartIndex]
  );

  // Dynamic Month & Year Heading based on currently visible dates
  const currentMonthHeading = useMemo(() => {
    if (!visibleDates || visibleDates.length === 0) return '';
    const first = visibleDates[0];
    const last = visibleDates[visibleDates.length - 1];
    if (first.monthName === last.monthName && first.year === last.year) {
      return isSv ? `${first.monthNameSv} ${first.year}` : `${first.monthName} ${first.year}`;
    }
    if (first.year === last.year) {
      return isSv
        ? `${first.monthNameSv} – ${last.monthNameSv} ${first.year}`
        : `${first.monthName} – ${last.monthName} ${first.year}`;
    }
    return isSv
      ? `${first.monthNameSv} ${first.year} – ${last.monthNameSv} ${last.year}`
      : `${first.monthName} ${first.year} – ${last.monthName} ${last.year}`;
  }, [visibleDates, isSv]);

  // Active step in the reservation flow: 1 = Table & Time, 2 = Guest Details, 3 = Review
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Reservation form state preserved across all steps
  const [booking, setBooking] = useState<BookingState>({
    guests: 2,
    date: bookingDates[0]?.full || '',
    time: '18:30',
    seatingArea: 'Main Dining Room (Matsal)',
    fullName: 'Astrid Lindqvist',
    countryCode: '+46',
    phone: '070 123 45 67',
    email: 'astrid.lindqvist@example.se',
    specialRequests: 'Quiet corner requested for anniversary dinner. 1 pescatarian guest.',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmedData, setConfirmedData] = useState<ConfirmedBooking | null>(null);

  // Selected date item
  const selectedDateOption = useMemo(
    () => bookingDates.find((d) => d.key === selectedDateKey) || bookingDates[0],
    [bookingDates, selectedDateKey]
  );

  // Synchronize formatted date string for active language
  const formattedDate = isSv
    ? selectedDateOption.fullSv
    : selectedDateOption.full;

  const currentArea = useMemo(
    () =>
      SEATING_AREAS.find(
        (a) => a.title === booking.seatingArea || a.titleSv === booking.seatingArea
      ) || SEATING_AREAS[0],
    [booking.seatingArea]
  );

  const guestCountText =
    booking.guests === '8+'
      ? isSv ? '8+ Gäster' : '8+ Guests'
      : `${booking.guests} ${
          booking.guests === 1
            ? isSv ? 'Gäst' : 'Guest'
            : isSv ? 'Gäster' : 'Guests'
        }`;

  const summaryAreaShort = currentArea
    ? isSv ? currentArea.titleSv : currentArea.title
    : booking.seatingArea;

  // Step 1 Validation & Next
  const handleProceedToStep2 = () => {
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2 Validation & Next
  const handleProceedToStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking.fullName.trim()) {
      onShowToast(isSv ? 'Vänligen ange gästnamn' : 'Please provide guest name');
      return;
    }
    if (!booking.phone.trim()) {
      onShowToast(isSv ? 'Vänligen ange telefonnummer' : 'Please provide phone number');
      return;
    }
    if (!booking.email.trim() || !booking.email.includes('@')) {
      onShowToast(isSv ? 'Vänligen ange en giltig e-postadress' : 'Please provide a valid email');
      return;
    }
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 3 Confirmation
 // Step 3 Confirmation
const handleFinalConfirm = async () => {
  try {
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        guests: booking.guests,
        date: selectedDateKey,
        time: booking.time,
        seatingArea: isSv ? currentArea.titleSv : currentArea.title,
        fullName: booking.fullName,
        countryCode: booking.countryCode,
        phone: booking.phone,
        email: booking.email,
        specialRequests: booking.specialRequests,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Reservation failed');
    }

    const confirmedBooking: ConfirmedBooking = {
  ...booking,
  date: formattedDate,
  seatingArea: data.reservation.seatingArea,
  id: data.reservation.id,
  createdAt: data.reservation.createdAt,
};

    setConfirmedData(confirmedBooking);
    onBookingConfirmed(confirmedBooking);
    setIsModalOpen(true);

    onShowToast(
      isSv
        ? 'Bordet är nu reserverat!'
        : 'Table reservation confirmed!'
    );
  } catch (error) {
    console.error('Reservation error:', error);

    onShowToast(
      isSv
        ? 'Reservationen kunde inte genomföras. Försök igen.'
        : 'Reservation could not be completed. Please try again.'
    );
  }
};
  // Reset reservation flow cleanly on "Done / Klart"
  const handleDoneReset = () => {
    setIsModalOpen(false);
    setConfirmedData(null);
    setCurrentStep(1);
    const defaultDateKey = bookingDates[0]?.key || '2026-09-20';
    setSelectedDateKey(defaultDateKey);
    setBooking({
      guests: 2,
      date: bookingDates[0]?.full || '',
      time: '18:30',
      seatingArea: 'Main Dining Room (Matsal)',
      fullName: '',
      countryCode: '+46',
      phone: '',
      email: '',
      specialRequests: '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Intro Editorial Section */}
      <section className="mb-4 pt-1">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#725b38]"></span>
          <span className="font-sans text-[11px] text-[#725b38] tracking-widest uppercase font-semibold">
            {isSv ? 'Matsal & Gastronomi' : 'Dining & Gastronomy'}
          </span>
        </div>
        <h1 className="font-serif text-[26px] text-[#091510] tracking-tight font-normal">
          {isSv ? 'Reservera ditt bord' : 'Reserve Your Table'}
        </h1>
        <p className="font-sans text-[13px] text-[#434845] mt-1 leading-relaxed">
          {isSv
            ? 'Vi välkomnar sällskap upp till 8 personer online. För privata middagar eller chambre séparée, kontakta vår hovmästare direkt.'
            : 'We welcome parties up to 8 guests online. For private dining or bespoke tasting salons, contact our sommelier desk directly.'}
        </p>
      </section>

      {/* Step Indicator / Breadcrumbs */}
      <div className="mb-5 bg-[#f5f3f1] p-2 rounded-2xl border border-[#c3c8c3]/30 shadow-sm">
        <div className="grid grid-cols-3 gap-1">
          {/* Step 1 Tab */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-center transition-all ${
              currentStep === 1
                ? 'bg-[#091510] text-white shadow-sm'
                : 'text-[#434845] hover:bg-[#e4e2e0]'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                currentStep === 1
                  ? 'bg-white text-[#091510]'
                  : currentStep > 1
                  ? 'bg-[#d8e6dc] text-[#091510]'
                  : 'bg-[#e4e2e0] text-[#725b38]'
              }`}
            >
              {currentStep > 1 ? '✓' : '1'}
            </span>
            <span className="font-sans text-[11px] font-semibold truncate">
              {isSv ? 'Bord & Tid' : 'Table & Time'}
            </span>
          </button>

          {/* Step 2 Tab */}
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-center transition-all ${
              currentStep === 2
                ? 'bg-[#091510] text-white shadow-sm'
                : 'text-[#434845] hover:bg-[#e4e2e0]'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                currentStep === 2
                  ? 'bg-white text-[#091510]'
                  : currentStep > 2
                  ? 'bg-[#d8e6dc] text-[#091510]'
                  : 'bg-[#e4e2e0] text-[#725b38]'
              }`}
            >
              {currentStep > 2 ? '✓' : '2'}
            </span>
            <span className="font-sans text-[11px] font-semibold truncate">
              {isSv ? 'Uppgifter' : 'Guest Details'}
            </span>
          </button>

          {/* Step 3 Tab */}
          <button
            type="button"
            onClick={() => {
              if (booking.fullName.trim()) {
                setCurrentStep(3);
              } else {
                onShowToast(isSv ? 'Fyll i gästuppgifter först' : 'Please enter guest details first');
              }
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-center transition-all ${
              currentStep === 3
                ? 'bg-[#091510] text-white shadow-sm'
                : 'text-[#434845] hover:bg-[#e4e2e0]'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                currentStep === 3
                  ? 'bg-white text-[#091510]'
                  : 'bg-[#e4e2e0] text-[#725b38]'
              }`}
            >
              3
            </span>
            <span className="font-sans text-[11px] font-semibold truncate">
              {isSv ? 'Granska' : 'Review'}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STEP 1: Table & Time Selection */}
      {/* ========================================================= */}
      {currentStep === 1 && (
        <div className="flex flex-col animate-in fade-in duration-200">
          {/* Number of Guests Section */}
          <section className="bg-[#f5f3f1] rounded-2xl p-4 mb-4 shadow-sm border border-[#c3c8c3]/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#091510] text-[20px]">
                  group
                </span>
                <span className="font-sans text-[15px] font-semibold text-[#091510]">
                  {isSv ? 'Antal gäster' : 'Number of Guests'}
                </span>
              </div>
              <span className="font-sans text-[12px] text-[#725b38] font-semibold">
                {guestCountText}
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
              {[1, 2, 3, 4, 5, 6, 7, '8+'].map((count) => {
                const isSelected = booking.guests === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setBooking({ ...booking, guests: count as any })}
                    className={`flex-shrink-0 h-11 ${
                      count === '8+' ? 'px-3.5' : 'w-12'
                    } rounded-xl font-sans text-[14px] font-semibold flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#091510] text-white shadow-sm'
                        : 'bg-[#efeeeb] text-[#1b1c1b] hover:bg-[#e4e2e0]'
                    }`}
                  >
                    {count}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Dynamic Date Selector Section */}
          <section className="bg-[#f5f3f1] rounded-2xl p-4 mb-4 shadow-sm border border-[#c3c8c3]/30">
            {/* Header with Navigation Controls */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#091510] text-[20px]">
                  calendar_today
                </span>
                <span className="font-sans text-[15px] font-semibold text-[#091510]">
                  {isSv ? 'Datum' : 'Date'}
                </span>
              </div>

              {/* Navigation Controls and Dynamic Month & Year Heading */}
              <div className="flex items-center gap-1.5">
                <button
                  id="date-nav-prev"
                  type="button"
                  onClick={handlePrevWindow}
                  disabled={isAtEarliest}
                  aria-label={isSv ? 'Föregående datum' : 'Previous dates'}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    isAtEarliest
                      ? 'text-[#c3c8c3] cursor-not-allowed bg-transparent opacity-40'
                      : 'text-[#091510] bg-[#efeeeb] hover:bg-[#e4e2e0] active:scale-95'
                  }`}
                  title={isSv ? 'Föregående vecka / datum' : 'Previous dates'}
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>

                <span
                  id="date-month-heading"
                  className="font-sans text-[11px] text-[#091510] uppercase tracking-wider font-semibold min-w-[125px] text-center"
                >
                  {currentMonthHeading}
                </span>

                <button
                  id="date-nav-next"
                  type="button"
                  onClick={handleNextWindow}
                  disabled={!canGoNext}
                  aria-label={isSv ? 'Nästa datum' : 'Next dates'}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    !canGoNext
                      ? 'text-[#c3c8c3] cursor-not-allowed bg-transparent opacity-40'
                      : 'text-[#091510] bg-[#efeeeb] hover:bg-[#e4e2e0] active:scale-95'
                  }`}
                  title={isSv ? 'Nästa vecka / datum' : 'Next dates'}
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Month Fast-Jump Selector */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2.5 -mx-1 px-1 no-scrollbar">
              {availableMonths.map((m) => {
                const isCurrentMonth =
                  visibleDates[0]?.monthName === m.monthName &&
                  visibleDates[0]?.year === m.year;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => handleSelectMonth(m.firstIndex)}
                    className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                      isCurrentMonth
                        ? 'bg-[#091510] text-white shadow-xs'
                        : 'bg-[#efeeeb] text-[#434845] hover:bg-[#e4e2e0]'
                    }`}
                  >
                    {isSv ? `${m.monthNameSv} ${m.year}` : `${m.monthName} ${m.year}`}
                  </button>
                );
              })}
            </div>

            {/* 7 Consecutive Visible Dates */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {visibleDates.map((item) => {
                const isSelected = selectedDateKey === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setSelectedDateKey(item.key);
                      setBooking({
                        ...booking,
                        date: isSv ? item.fullSv : item.full,
                      });
                    }}
                    className={`flex flex-col items-center justify-between py-2 rounded-xl transition-all text-center min-h-[66px] ${
                      isSelected
                        ? 'bg-[#091510] text-white shadow-sm ring-2 ring-[#091510]'
                        : 'bg-[#efeeeb] text-[#1b1c1b] hover:bg-[#e4e2e0]'
                    }`}
                  >
                    <span
                      className={`font-sans text-[10px] uppercase font-semibold ${
                        isSelected ? 'text-[#fedeb2]' : 'text-[#434845]'
                      }`}
                    >
                      {isSv ? item.weekdaySv : item.weekday}
                    </span>
                    <span className="font-serif text-[18px] my-0.5 font-medium leading-none">
                      {item.day}
                    </span>
                    <span
                      className={`font-sans text-[9px] uppercase font-medium truncate max-w-full px-0.5 ${
                        isSelected ? 'text-white/85' : 'text-[#737874]'
                      }`}
                    >
                      {isSv ? item.titleSv : item.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Date Confirmation Strip */}
            <div className="mt-2.5 pt-2 border-t border-[#c3c8c3]/30 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-[#434845]">
                <span className="material-symbols-outlined text-[15px] text-[#725b38]">
                  check_circle
                </span>
                <span>
                  {isSv ? 'Valt datum:' : 'Selected date:'}{' '}
                  <strong className="text-[#091510] font-semibold">{formattedDate}</strong>
                </span>
              </div>
              {!visibleDates.some((d) => d.key === selectedDateKey) && (
                <button
                  type="button"
                  onClick={() => {
                    const idx = bookingDates.findIndex((d) => d.key === selectedDateKey);
                    if (idx >= 0) {
                      setViewStartIndex(Math.floor(idx / WINDOW_SIZE) * WINDOW_SIZE);
                    }
                  }}
                  className="text-[#725b38] hover:underline font-medium"
                >
                  {isSv ? 'Visa i kalender' : 'Show in view'}
                </button>
              )}
            </div>
          </section>

          {/* Dinner Service Seating Slots */}
          <section className="bg-[#f5f3f1] rounded-2xl p-4 mb-4 shadow-sm border border-[#c3c8c3]/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#091510] text-[20px]">
                  schedule
                </span>
                <span className="font-sans text-[15px] font-semibold text-[#091510]">
                  {isSv ? 'Sittningstid' : 'Dinner Service'}
                </span>
              </div>
              <span className="font-sans text-[11px] text-[#725b38] font-medium flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#725b38]"></span>
                {isSv ? '6 sittningstider' : '6 seating slots'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => {
                const isSelected = booking.time === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => setBooking({ ...booking, time: slot.time })}
                    className={`py-3 px-2 rounded-xl font-sans text-[14px] flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#091510] text-white shadow-sm'
                        : 'bg-[#efeeeb] text-[#1b1c1b] hover:bg-[#e4e2e0]'
                    }`}
                  >
                    <span className="font-semibold">{slot.time}</span>
                    <span
                      className={`font-sans text-[10px] mt-1 ${
                        isSelected ? 'text-[#fedeb2] font-semibold' : 'text-[#434845]'
                      }`}
                    >
                      {slot.badge && isSelected
                        ? isSv ? 'POPULÄRT' : 'POPULAR'
                        : isSv ? slot.statusSv : slot.status}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Seating Atmosphere */}
          <section className="bg-[#f5f3f1] rounded-2xl p-4 mb-4 shadow-sm border border-[#c3c8c3]/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[#091510] text-[20px]">
                deck
              </span>
              <span className="font-sans text-[15px] font-semibold text-[#091510]">
                {isSv ? 'Sittningsmiljö' : 'Seating Atmosphere'}
              </span>
            </div>

            <div className="space-y-2.5">
              {SEATING_AREAS.map((area) => {
                const isChecked =
                  booking.seatingArea === area.title ||
                  booking.seatingArea === area.titleSv;
                return (
                  <label
                    key={area.id}
                    onClick={() =>
                      setBooking({
                        ...booking,
                        seatingArea: isSv ? area.titleSv : area.title,
                      })
                    }
                    className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all border ${
                      isChecked
                        ? 'bg-white border-[#091510]/30 shadow-sm'
                        : 'bg-[#efeeeb] border-transparent hover:bg-[#e4e2e0]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="seating_area"
                        value={area.title}
                        checked={isChecked}
                        onChange={() =>
                          setBooking({
                            ...booking,
                            seatingArea: isSv ? area.titleSv : area.title,
                          })
                        }
                        className="mt-1 accent-[#091510] h-4 w-4"
                      />
                      <div className="flex flex-col text-left">
                        <span className="font-sans text-[14px] font-semibold text-[#091510]">
                          {isSv ? area.titleSv : area.title}
                        </span>
                        <span className="font-sans text-[12px] text-[#434845] mt-0.5">
                          {isSv ? area.descSv : area.desc}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`font-sans text-[11px] px-2 py-0.5 rounded font-medium shrink-0 ${
                        area.tag === 'Signature'
                          ? 'bg-[#fedeb2]/60 text-[#78603e]'
                          : 'text-[#434845]'
                      }`}
                    >
                      {isSv ? area.tagSv : area.tag}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Atmospheric Banner */}
          <div className="rounded-2xl overflow-hidden mb-4 shadow-sm relative h-32 border border-[#c3c8c3]/30">
            <img
              alt="Warm ambient atmospheric interior of Nordic fine dining restaurant"
              src={RESTAURANT_IMAGES.bookTableInterior}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#091510]/85 via-[#091510]/30 to-transparent flex items-end p-4">
              <div className="flex items-center gap-2 text-white">
                <span className="material-symbols-outlined text-[18px] text-[#fedeb2]">
                  verified
                </span>
                <p className="font-sans text-[12px] text-white leading-tight font-medium">
                  {isSv
                    ? 'Säsongens höstavsmakningsmeny & källarvin kombineras dagligen.'
                    : 'Seasonal autumn tasting menu & cellar pairings curated daily.'}
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Bar for Step 1 */}
          <div className="sticky bottom-20 z-30 pt-2 pb-1">
            <div className="bg-[#fbf9f7]/95 backdrop-blur-md p-2.5 rounded-2xl shadow-xl border border-[#c3c8c3]/40 flex flex-col gap-2">
              <div className="flex items-center justify-between px-2 pt-1 text-xs">
                <div className="flex items-center gap-1.5 text-[#434845]">
                  <span className="material-symbols-outlined text-[16px] text-[#725b38]">
                    restaurant
                  </span>
                  <span className="font-sans text-[12px] font-semibold text-[#091510]">
                    {guestCountText} • {selectedDateOption.day} {isSv ? selectedDateOption.monthNameSv.slice(0, 3) : selectedDateOption.monthName.slice(0, 3)}, {booking.time} • {summaryAreaShort}
                  </span>
                </div>
                <span className="font-sans text-[11px] text-[#725b38] uppercase font-bold tracking-wider">
                  {isSv ? 'STEG 1 AV 3' : 'STEP 1 OF 3'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleProceedToStep2}
                className="w-full h-14 rounded-xl bg-[#091510] text-white font-sans text-[15px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md hover:bg-[#1e2a24]"
              >
                <span>{isSv ? 'Fortsätt till gästuppgifter' : 'Continue to Guest Details'}</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 2: Guest Information & Special Requests */}
      {/* ========================================================= */}
      {currentStep === 2 && (
        <form onSubmit={handleProceedToStep3} className="flex flex-col animate-in fade-in duration-200">
          <section className="bg-[#f5f3f1] rounded-2xl p-4 mb-4 shadow-sm border border-[#c3c8c3]/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#091510] text-[20px]">
                  person_pin
                </span>
                <span className="font-sans text-[15px] font-semibold text-[#091510]">
                  {isSv ? 'Gästuppgifter' : 'Primary Guest Information'}
                </span>
              </div>
              <span className="font-sans text-[11px] text-[#725b38] font-semibold uppercase tracking-wider">
                {isSv ? 'Steg 2 av 3' : 'Step 2 of 3'}
              </span>
            </div>

            <div className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="guest-name"
                  className="block font-sans text-[11px] font-semibold text-[#434845] mb-1 uppercase tracking-wider"
                >
                  {isSv ? 'För- & Efternamn' : 'Full Name'}
                </label>
                <div className="relative">
                  <input
                    id="guest-name"
                    type="text"
                    required
                    value={booking.fullName}
                    onChange={(e) => setBooking({ ...booking, fullName: e.target.value })}
                    placeholder="t.ex. Astrid Lindqvist"
                    className="w-full h-12 px-3.5 pr-10 rounded-xl bg-white text-[#091510] font-sans text-[14px] border border-[#c3c8c3]/40 focus:outline-none focus:ring-1 focus:ring-[#091510]"
                  />
                  <span className="material-symbols-outlined absolute right-3.5 top-3.5 text-[#434845] text-[20px] pointer-events-none">
                    badge
                  </span>
                </div>
              </div>

              {/* Phone with Country Code */}
              <div>
                <label
                  htmlFor="guest-phone"
                  className="block font-sans text-[11px] font-semibold text-[#434845] mb-1 uppercase tracking-wider"
                >
                  {isSv ? 'Telefonnummer' : 'Phone Number'}
                </label>
                <div className="flex gap-2">
                  <div className="relative w-28 flex-shrink-0">
                    <select
                      id="country-code"
                      value={booking.countryCode}
                      onChange={(e) => setBooking({ ...booking, countryCode: e.target.value })}
                      className="w-full h-12 pl-2.5 pr-6 rounded-xl bg-white text-[#091510] font-sans text-[13px] border border-[#c3c8c3]/40 appearance-none focus:outline-none focus:ring-1 focus:ring-[#091510]"
                    >
                      <option value="+46">+46 (SE)</option>
                      <option value="+47">+47 (NO)</option>
                      <option value="+45">+45 (DK)</option>
                      <option value="+358">+358 (FI)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+1">+1 (US)</option>
                      <option value="+49">+49 (DE)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-3.5 text-[#434845] text-[18px] pointer-events-none">
                      expand_more
                    </span>
                  </div>

                  <div className="relative flex-1">
                    <input
                      id="guest-phone"
                      type="tel"
                      required
                      value={booking.phone}
                      onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                      placeholder="070 123 45 67"
                      className="w-full h-12 px-3.5 pr-10 rounded-xl bg-white text-[#091510] font-sans text-[14px] border border-[#c3c8c3]/40 focus:outline-none focus:ring-1 focus:ring-[#091510]"
                    />
                    <span className="material-symbols-outlined absolute right-3.5 top-3.5 text-[#434845] text-[20px] pointer-events-none">
                      smartphone
                    </span>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="guest-email"
                  className="block font-sans text-[11px] font-semibold text-[#434845] mb-1 uppercase tracking-wider"
                >
                  {isSv ? 'E-postadress' : 'Email Address'}
                </label>
                <div className="relative">
                  <input
                    id="guest-email"
                    type="email"
                    required
                    value={booking.email}
                    onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                    placeholder="astrid.lindqvist@example.se"
                    className="w-full h-12 px-3.5 pr-10 rounded-xl bg-white text-[#091510] font-sans text-[14px] border border-[#c3c8c3]/40 focus:outline-none focus:ring-1 focus:ring-[#091510]"
                  />
                  <span className="material-symbols-outlined absolute right-3.5 top-3.5 text-[#434845] text-[20px] pointer-events-none">
                    mail
                  </span>
                </div>
              </div>

              {/* Special Requests & Dietary */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="special-requests"
                    className="block font-sans text-[11px] font-semibold text-[#434845] uppercase tracking-wider"
                  >
                    {isSv ? 'Allergier & Önskemål' : 'Special Requests & Dietary'}
                  </label>
                  <span className="font-sans text-[11px] text-[#725b38]">
                    {isSv ? 'Valfritt' : 'Optional'}
                  </span>
                </div>
                <textarea
                  id="special-requests"
                  rows={3}
                  value={booking.specialRequests}
                  onChange={(e) => setBooking({ ...booking, specialRequests: e.target.value })}
                  placeholder={
                    isSv
                      ? 'Allergier, jubileum, lugnt hörnönskemål...'
                      : 'Allergies, anniversaries, quiet corner preference...'
                  }
                  className="w-full p-3 rounded-xl bg-white text-[#091510] font-sans text-[13px] border border-[#c3c8c3]/40 focus:outline-none focus:ring-1 focus:ring-[#091510] resize-none leading-relaxed"
                />
              </div>
            </div>
          </section>

          {/* Guarantees & Cancellation */}
          <section className="space-y-2 mb-4">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#c3c8c3]/30 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#fedeb2]/50 flex items-center justify-center flex-shrink-0 text-[#725b38]">
                <span className="material-symbols-outlined text-[18px]">lock_reset</span>
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-[13px] font-semibold text-[#091510] leading-tight">
                  {isSv ? 'Fri avbokning upp till 6 timmar innan' : 'Free cancellation up to 6 hours before'}
                </span>
                <span className="font-sans text-[11px] text-[#434845] mt-0.5">
                  {isSv
                    ? 'Ingen avgift. Ändra eller avboka enkelt med ett klick.'
                    : 'No cancellation penalty. Modify freely in one tap.'}
                </span>
              </div>
            </div>
          </section>

          {/* Sticky Bottom Bar for Step 2 */}
          <div className="sticky bottom-20 z-30 pt-2 pb-1">
            <div className="bg-[#fbf9f7]/95 backdrop-blur-md p-2.5 rounded-2xl shadow-xl border border-[#c3c8c3]/40 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="h-14 px-4 rounded-xl bg-[#efeeeb] text-[#091510] font-sans text-[14px] font-medium flex items-center justify-center gap-1 hover:bg-[#e4e2e0] transition-colors border border-[#c3c8c3]/30"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>{isSv ? 'Tillbaka' : 'Back'}</span>
              </button>

              <button
                type="submit"
                className="flex-1 h-14 rounded-xl bg-[#091510] text-white font-sans text-[15px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md hover:bg-[#1e2a24]"
              >
                <span>{isSv ? 'Granska reservation' : 'Review Reservation'}</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* STEP 3: Review Reservation Before Final Confirmation */}
      {/* ========================================================= */}
      {currentStep === 3 && (
        <div className="flex flex-col animate-in fade-in duration-200">
          <section className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-[#c3c8c3]/40">
            <div className="flex items-center justify-between border-b border-[#efeeeb] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#725b38] text-[22px]">
                  fact_check
                </span>
                <h2 className="font-serif text-[18px] text-[#091510] font-medium">
                  {isSv ? 'Granska din reservation' : 'Review Your Reservation'}
                </h2>
              </div>
              <span className="font-sans text-[11px] text-[#725b38] font-semibold uppercase tracking-wider">
                {isSv ? 'Steg 3 av 3' : 'Step 3 of 3'}
              </span>
            </div>

            {/* Table & Time Summary */}
            <div className="bg-[#f5f3f1] rounded-xl p-3.5 mb-3 space-y-2 border border-[#c3c8c3]/30">
              <div className="flex items-center justify-between">
                <span className="font-sans text-[11px] uppercase tracking-wider font-semibold text-[#725b38]">
                  {isSv ? 'Bord & Sittning' : 'Table & Sitting'}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="font-sans text-[11px] font-semibold text-[#091510] underline flex items-center gap-0.5 hover:text-[#725b38]"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  <span>{isSv ? 'Ändra' : 'Edit'}</span>
                </button>
              </div>

              <div className="flex justify-between items-baseline text-[13px]">
                <span className="text-[#434845]">{isSv ? 'Antal gäster' : 'Party Size'}:</span>
                <span className="font-semibold text-[#091510]">{guestCountText}</span>
              </div>

              <div className="flex justify-between items-baseline text-[13px]">
                <span className="text-[#434845]">{isSv ? 'Datum' : 'Date'}:</span>
                <span className="font-semibold text-[#091510]">{formattedDate}</span>
              </div>

              <div className="flex justify-between items-baseline text-[13px]">
                <span className="text-[#434845]">{isSv ? 'Tid' : 'Time'}:</span>
                <span className="font-semibold text-[#091510]">{booking.time}</span>
              </div>

              <div className="flex justify-between items-baseline text-[13px]">
                <span className="text-[#434845]">{isSv ? 'Miljö' : 'Seating Area'}:</span>
                <span className="font-semibold text-[#091510]">{summaryAreaShort}</span>
              </div>
            </div>

            {/* Guest Details Summary */}
            <div className="bg-[#f5f3f1] rounded-xl p-3.5 space-y-2 border border-[#c3c8c3]/30">
              <div className="flex items-center justify-between">
                <span className="font-sans text-[11px] uppercase tracking-wider font-semibold text-[#725b38]">
                  {isSv ? 'Gästuppgifter' : 'Guest Details'}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="font-sans text-[11px] font-semibold text-[#091510] underline flex items-center gap-0.5 hover:text-[#725b38]"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  <span>{isSv ? 'Ändra' : 'Edit'}</span>
                </button>
              </div>

              <div className="flex justify-between items-baseline text-[13px]">
                <span className="text-[#434845]">{isSv ? 'Namn' : 'Name'}:</span>
                <span className="font-semibold text-[#091510]">{booking.fullName}</span>
              </div>

              <div className="flex justify-between items-baseline text-[13px]">
                <span className="text-[#434845]">{isSv ? 'Telefon' : 'Phone'}:</span>
                <span className="font-semibold text-[#091510]">{booking.countryCode} {booking.phone}</span>
              </div>

              <div className="flex justify-between items-baseline text-[13px]">
                <span className="text-[#434845]">{isSv ? 'E-post' : 'Email'}:</span>
                <span className="font-semibold text-[#091510] truncate max-w-[200px]">{booking.email}</span>
              </div>

              {booking.specialRequests && (
                <div className="pt-1 border-t border-[#c3c8c3]/20 text-[12px]">
                  <span className="text-[#434845] block mb-0.5">{isSv ? 'Önskemål / Allergier' : 'Requests / Allergies'}:</span>
                  <span className="text-[#091510] italic">{booking.specialRequests}</span>
                </div>
              )}
            </div>
          </section>

          {/* Informational Policy */}
          <div className="p-3.5 rounded-xl bg-[#fedeb2]/35 border border-[#fedeb2]/60 mb-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#725b38] text-[20px]">info</span>
            <span className="font-sans text-[12px] text-[#78603e] leading-snug">
              {isSv
                ? 'Ingen förskottsbetalning krävs online. Notan betalas på plats efter måltiden.'
                : 'No pre-payment required online. Your bill is settled at the restaurant after service.'}
            </span>
          </div>

          {/* Sticky Bottom Bar for Step 3 */}
          <div className="sticky bottom-20 z-30 pt-2 pb-1">
            <div className="bg-[#fbf9f7]/95 backdrop-blur-md p-2.5 rounded-2xl shadow-xl border border-[#c3c8c3]/40 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="h-14 px-4 rounded-xl bg-[#efeeeb] text-[#091510] font-sans text-[14px] font-medium flex items-center justify-center gap-1 hover:bg-[#e4e2e0] transition-colors border border-[#c3c8c3]/30"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>{isSv ? 'Tillbaka' : 'Back'}</span>
              </button>

              <button
                id="confirm-booking-btn"
                type="button"
                onClick={handleFinalConfirm}
                className="flex-1 h-14 rounded-xl bg-[#091510] text-white font-sans text-[15px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md hover:bg-[#1e2a24]"
              >
                <span>{isSv ? 'Bekräfta reservation' : 'Confirm Reservation'}</span>
                <span className="material-symbols-outlined text-[20px]">check</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal Sheet with Clean Reset */}
      {isModalOpen && confirmedData && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="fixed inset-0 bg-[#091510]/50 backdrop-blur-sm transition-opacity"
            onClick={handleDoneReset}
          />
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl p-6 shadow-2xl z-10 flex flex-col mb-16 border-t border-[#c3c8c3]/40 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1 bg-[#c3c8c3] rounded-full mx-auto mb-4"></div>

            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#d8e6dc] text-[#091510] mx-auto mb-3">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>

            <h2 className="font-serif text-[24px] text-center text-[#091510] font-medium">
              {isSv ? 'Bord reserverat!' : 'Table Reserved!'}
            </h2>
            <p className="font-sans text-[13px] text-center text-[#434845] mt-1 mb-5 leading-relaxed">
             {isSv
                   ? `Din reservation har sparats. Spara bokningsreferensen om du behöver ändra eller avboka reservationen senare.`
                 : `Your reservation has been saved. Please keep your booking reference if you need to modify or cancel the reservation later.`}
            </p>

            <div className="bg-[#f5f3f1] rounded-2xl p-4 mb-5 space-y-2 text-sm border border-[#c3c8c3]/30">
              <div className="flex justify-between font-sans text-[12px] text-[#434845]">
                <span>{isSv ? 'Bokningsreferens' : 'Booking Reference'}</span>
                <span className="font-mono text-[#091510] font-bold">
                  {confirmedData.id}
                </span>
              </div>
              <div className="flex justify-between font-sans text-[12px] text-[#434845]">
                <span>{isSv ? 'Antal gäster' : 'Guests'}</span>
                <span className="text-[#091510] font-medium">
                  {confirmedData.guests} {isSv ? 'Gäster' : 'Guests'}
                </span>
              </div>
              <div className="flex justify-between font-sans text-[12px] text-[#434845]">
                <span>{isSv ? 'Datum & Tid' : 'Date & Time'}</span>
                <span className="text-[#091510] font-medium">
                  {confirmedData.date}, {confirmedData.time} ({confirmedData.seatingArea})
                </span>
              </div>
              <div className="flex justify-between font-sans text-[12px] text-[#434845]">
                <span>{isSv ? 'Gäst' : 'Primary Guest'}</span>
                <span className="text-[#091510] font-medium">
                  {confirmedData.fullName}
                </span>
              </div>
            </div>

            <button
              id="booking-done-btn"
              onClick={handleDoneReset}
              type="button"
              className="w-full h-12 rounded-xl bg-[#091510] text-white font-sans text-[14px] font-semibold flex items-center justify-center hover:bg-[#1e2a24]"
            >
              {isSv ? 'Klart' : 'Done'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
