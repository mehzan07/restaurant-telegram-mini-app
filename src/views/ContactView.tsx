import React, { useState } from 'react';
import { Language } from '../types';
import { RESTAURANT_IMAGES, FAQS } from '../data/restaurantData';

interface ContactViewProps {
  language: Language;
  onShowToast: (msg: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  language,
  onShowToast,
}) => {
  const isSv = language === 'SV';

  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const address = 'Skeppsbron 42, 111 30 Stockholm, Sweden';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      onShowToast(isSv ? 'Adress kopierad till urklipp!' : 'Address copied to clipboard!');
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Subtle Header Introduction */}
      <div className="flex flex-col mb-6 mt-1">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#725b38]"></span>
          <span className="font-sans text-[11px] text-[#725b38] uppercase tracking-widest font-semibold">
            {isSv ? 'Hitta hit & kontakt' : 'Find Us & Contact'}
          </span>
        </div>
        <h1 className="font-serif text-[26px] text-[#091510] font-normal">
          {isSv ? 'Kontakt & Plats' : 'Contact & Location'}
        </h1>
        <p className="font-sans text-[13px] text-[#434845] mt-1 leading-relaxed">
          {isSv
            ? 'Beläget vid kajen på Skeppsbron. Vi välkomnar er till modern nordisk gastronomi, stillsam gästfrihet och taktilt hantverk.'
            : 'Nestled waterfront on Skeppsbron. We welcome you to modern Nordic dining, serene hospitality, and tactile craft.'}
        </p>
      </div>

      {/* Quick Action Concierge Hub */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <a
          id="contact-phone-link"
          href="tel:+4681234567"
          aria-label={isSv ? 'Ring Test Restaurang på +46 8 123 45 67' : 'Call Test Restaurang at +46 8 123 45 67'}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#efeeeb] hover:bg-[#e4e2e0] active:scale-95 transition-all text-center group border border-[#c3c8c3]/30 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#091510] mb-2 shadow-sm group-hover:bg-[#091510] group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">call</span>
          </div>
          <span className="font-sans text-[13px] font-semibold text-[#091510] leading-tight">
            {isSv ? 'Ring oss' : 'Call Us'}
          </span>
          <span className="font-sans text-[10px] text-[#434845] mt-0.5 font-medium">+46 8 123 45 67</span>
        </a>

        <a
          id="contact-email-link"
          href="mailto:bokning@testrestaurang.se"
          aria-label={isSv ? 'Skicka e-post till bokning@testrestaurang.se' : 'Send email to bokning@testrestaurang.se'}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#efeeeb] hover:bg-[#e4e2e0] active:scale-95 transition-all text-center group border border-[#c3c8c3]/30 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#091510] mb-2 shadow-sm group-hover:bg-[#091510] group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">mail</span>
          </div>
          <span className="font-sans text-[13px] font-semibold text-[#091510] leading-tight">
            {isSv ? 'E-post' : 'Email'}
          </span>
          <span className="font-sans text-[10px] text-[#434845] mt-0.5 truncate max-w-full px-1 font-medium">
            bokning@testrestaurang.se
          </span>
        </a>

        <a
          id="contact-telegram-link"
          href="https://t.me/TestRestaurantBot"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram Concierge"
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#fedeb2]/50 hover:bg-[#fedeb2] active:scale-95 transition-all text-center group border border-[#fedeb2]"
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#725b38] mb-2 shadow-sm">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              forum
            </span>
          </div>
          <span className="font-sans text-[13px] font-semibold text-[#78603e] leading-tight">
            Telegram
          </span>
          <span className="font-sans text-[10px] text-[#78603e]/80 mt-0.5 font-medium">
            Concierge
          </span>
        </a>
      </div>

      {/* Location & Arrival Section */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#c3c8c3]/40 mb-6 flex flex-col">
        {/* Map Container */}
        <div className="relative w-full h-52 rounded-xl overflow-hidden bg-[#efeeeb] mb-4 border border-[#c3c8c3]/30">
          <img
            alt="Aerial view of Skeppsbron and Gamla Stan Stockholm"
            src={RESTAURANT_IMAGES.mapView}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#091510]/60 via-transparent to-transparent pointer-events-none"></div>

          {/* Minimalist Pin */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-[#c3c8c3]/30">
              <span className="w-2 h-2 rounded-full bg-[#725b38] animate-pulse"></span>
              <span className="font-sans text-[12px] text-[#091510] font-semibold">
                Test Restaurang
              </span>
            </div>
            <div className="w-6 h-6 -mt-0.5 rounded-full bg-[#091510] flex items-center justify-center shadow-lg border-2 border-white">
              <span className="material-symbols-outlined text-[#fedeb2] text-[13px]">
                restaurant
              </span>
            </div>
          </div>

          {/* Quick Transit Pill */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-[#c3c8c3]/30 shadow-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[#725b38] text-[18px] shrink-0">
                directions_walk
              </span>
              <span className="font-sans text-[12px] text-[#091510] truncate font-medium">
                {isSv ? '4 min från Gamla stans tunnelbana' : '4 min from Gamla Stan subway'}
              </span>
            </div>
            <a
              href="https://maps.google.com/?q=Skeppsbron+42,+111+30+Stockholm"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1 text-[#091510] font-sans text-[12px] font-semibold hover:underline"
            >
              <span>Maps</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>
        </div>

        {/* Address Details */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <span className="font-serif text-[18px] text-[#091510] font-medium">
                Skeppsbron 42
              </span>
              <span className="font-sans text-[13px] text-[#434845]">
                111 30 Stockholm, Sweden
              </span>
            </div>
            <button
              onClick={handleCopyAddress}
              type="button"
              className="px-3 py-1.5 rounded-full bg-[#efeeeb] hover:bg-[#e4e2e0] text-[#091510] font-sans text-[11px] font-medium flex items-center gap-1.5 transition-colors border border-[#c3c8c3]/30"
            >
              <span className="material-symbols-outlined text-[15px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? (isSv ? 'Kopierad!' : 'Copied!') : (isSv ? 'Kopiera' : 'Copy')}</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-[#f5f3f1] border border-[#c3c8c3]/30 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#efeeeb] flex items-center justify-center text-[#434845] shrink-0">
              <span className="material-symbols-outlined text-[18px]">
                directions_boat
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-sans text-[13px] font-semibold text-[#091510]">
                {isSv ? 'Båt- och färjeförbindelser' : 'Harbor & Ferry Access'}
              </span>
              <span className="font-sans text-[12px] text-[#434845] leading-tight mt-0.5">
                {isSv
                  ? 'Slussens kaj och Djurgårdsfärjan lägger till inom 350 meter.'
                  : 'Slussen quay & Djurgården ferries arrive within 350 meters.'}
              </span>
            </div>
          </div>

          {/* Direct Phone & Email Quick Access */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#efeeeb]">
            <a
              id="details-phone-link"
              href="tel:+4681234567"
              aria-label={isSv ? 'Ring +46 8 123 45 67' : 'Call +46 8 123 45 67'}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#efeeeb] hover:bg-[#e4e2e0] text-[#091510] transition-colors group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#091510] group-hover:bg-[#091510] group-hover:text-white transition-colors shrink-0">
                <span className="material-symbols-outlined text-[16px]">call</span>
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="font-sans text-[10px] text-[#434845] font-medium leading-none">
                  {isSv ? 'Bordsbokning & växel' : 'Table Desk & Switchboard'}
                </span>
                <span className="font-sans text-[12px] font-semibold text-[#091510] truncate mt-0.5">
                  +46 8 123 45 67
                </span>
              </div>
            </a>

            <a
              id="details-email-link"
              href="mailto:bokning@testrestaurang.se"
              aria-label={isSv ? 'Skicka e-post till bokning@testrestaurang.se' : 'Send email to bokning@testrestaurang.se'}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#efeeeb] hover:bg-[#e4e2e0] text-[#091510] transition-colors group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#091510] group-hover:bg-[#091510] group-hover:text-white transition-colors shrink-0">
                <span className="material-symbols-outlined text-[16px]">mail</span>
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="font-sans text-[10px] text-[#434845] font-medium leading-none">
                  {isSv ? 'E-postförfrågan' : 'Email Inquiries'}
                </span>
                <span className="font-sans text-[12px] font-semibold text-[#091510] truncate mt-0.5">
                  bokning@testrestaurang.se
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Opening Hours Card */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#c3c8c3]/40 mb-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#725b38] text-[22px]">
              schedule
            </span>
            <h2 className="font-serif text-[18px] text-[#091510] font-medium">
              {isSv ? 'Öppettider' : 'Opening Hours'}
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#d8e6dc] text-[#121e18] font-sans text-[11px] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#091510] animate-pulse"></span>
            {isSv ? 'Öppet idag' : 'Open Today'}
          </span>
        </div>

        <div className="flex flex-col gap-3.5">
          {/* Tue - Thu */}
          <div className="flex flex-col pb-3 border-b border-[#efeeeb]">
            <div className="flex justify-between items-baseline">
              <span className="font-sans text-[14px] font-semibold text-[#091510]">
                {isSv ? 'Tisdag – Torsdag' : 'Tuesday – Thursday'}
              </span>
              <span className="font-sans text-[14px] text-[#091510] font-semibold">
                17:00 – 23:00
              </span>
            </div>
            <span className="font-sans text-[11px] text-[#434845] mt-0.5">
              {isSv ? 'Köket stänger 21:30' : 'Kitchen orders close at 21:30'}
            </span>
          </div>

          {/* Fri - Sat */}
          <div className="flex flex-col pb-3 border-b border-[#efeeeb]">
            <div className="flex justify-between items-baseline">
              <span className="font-sans text-[14px] font-semibold text-[#091510]">
                {isSv ? 'Fredag – Lördag' : 'Friday – Saturday'}
              </span>
              <span className="font-sans text-[14px] text-[#725b38] font-bold">
                16:30 – 00:00
              </span>
            </div>
            <span className="font-sans text-[11px] text-[#434845] mt-0.5">
              {isSv
                ? 'Köket stänger 22:30 • Sen cocktailservering'
                : 'Kitchen orders close at 22:30 • Late cocktail seating'}
            </span>
          </div>

          {/* Sunday */}
          <div className="flex flex-col pb-3 border-b border-[#efeeeb]">
            <div className="flex justify-between items-baseline">
              <span className="font-sans text-[14px] font-semibold text-[#091510]">
                {isSv ? 'Söndag Provsmakning & Supé' : 'Sunday Tasting & Supper'}
              </span>
              <span className="font-sans text-[14px] text-[#091510] font-semibold">
                12:30 – 20:00
              </span>
            </div>
            <span className="font-sans text-[11px] text-[#434845] mt-0.5">
              {isSv ? 'Kurerad eftermiddagssittning' : 'Curated seasonal afternoon service'}
            </span>
          </div>

          {/* Monday */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col">
              <span className="font-sans text-[14px] font-semibold text-[#434845]">
                {isSv ? 'Måndag' : 'Monday'}
              </span>
              <span className="font-sans text-[11px] text-[#725b38]">
                {isSv
                  ? 'Skörd, arkivering och provkök'
                  : 'Foraging, archiving & pantry research'}
              </span>
            </div>
            <span className="font-sans text-[12px] text-[#434845] uppercase tracking-wider font-semibold">
              {isSv ? 'Stängt' : 'CLOSED'}
            </span>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="flex flex-col mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[#725b38] text-[20px]">
            help_outline
          </span>
          <h3 className="font-serif text-[18px] text-[#091510] font-medium">
            {isSv ? 'Bra att veta' : 'Good to Know'}
          </h3>
        </div>

        <div className="flex flex-col gap-2">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-xl bg-white border border-[#c3c8c3]/40 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3"
                >
                  <span className="font-sans text-[14px] text-[#091510] font-semibold">
                    {isSv ? faq.questionSv : faq.question}
                  </span>
                  <span
                    className={`material-symbols-outlined text-[#434845] text-[20px] transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-0 text-[#434845] font-sans text-[13px] leading-relaxed border-t border-[#efeeeb] pt-2 animate-in fade-in duration-150">
                    {isSv ? faq.answerSv : faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sommelier / Host Card Micro-delight */}
      <div className="rounded-2xl p-4 bg-[#091510] text-white flex items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-[#1e2a24] border border-white/20">
            <img
              src={RESTAURANT_IMAGES.hostPortrait}
              alt="Portrait of Swedish restaurant host"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-sans text-[14px] font-semibold text-white truncate">
              {isSv ? 'Chambre Séparée & Salonger' : 'Private Dining & Salons'}
            </span>
            <span className="font-sans text-[12px] text-[#849289] truncate">
              {isSv ? 'Tala med Astrid, hovmästare' : 'Speak with Astrid, head host'}
            </span>
          </div>
        </div>

        <a
          href="mailto:privat@testrestaurang.se"
          className="px-3.5 py-2 rounded-xl bg-[#725b38] text-white font-sans text-[12px] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap active:scale-95"
        >
          {isSv ? 'Förfrågan' : 'Inquire'}
        </a>
      </div>
    </div>
  );
};
