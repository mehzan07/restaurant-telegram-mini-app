import React, { useState } from 'react';
import { TabView, Language } from '../types';
import { RESTAURANT_IMAGES, PRODUCERS } from '../data/restaurantData';

interface AboutViewProps {
  onNavigate: (tab: TabView) => void;
  language: Language;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onNavigate,
  language,
}) => {
  const isSv = language === 'SV';
  const [showProducers, setShowProducers] = useState(false);

  return (
    <div className="flex flex-col w-full gap-8 pb-12">
      {/* Hero Sanctuary Visual */}
      <section className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-[#f5f3f1] border border-[#c3c8c3]/30">
        <div className="relative w-full aspect-[16/10] sm:aspect-[1.79/1] overflow-hidden">
          <img
            alt="Interior of Test Restaurant dining room with warm oak and minimalist Scandinavian light"
            src={RESTAURANT_IMAGES.aboutHero}
            className="w-full h-full object-cover object-center transform scale-[1.02] transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#091510]/85 via-[#091510]/25 to-transparent"></div>
          <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col gap-1.5 text-white">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fedeb2]"></span>
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#f5f3f1] font-semibold">
                {isSv ? 'Vår Matsal' : 'The Dining Room'}
              </span>
            </div>
            <p className="font-serif text-[22px] sm:text-[26px] text-white leading-tight font-medium">
              {isSv
                ? 'Där milt nordiskt ljus möter tidlöst hantverk.'
                : 'Where slow Nordic light meets artisanal craft.'}
            </p>
          </div>
        </div>

        {/* Micro Highlights Strip */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-[#efeeeb] text-[#091510]">
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white shadow-sm">
            <span className="font-serif text-[18px] font-semibold text-[#091510]">8</span>
            <span className="font-sans text-[11px] text-[#434845] leading-tight">
              {isSv ? 'Nordiska Årstider' : 'Nordic Seasons'}
            </span>
          </div>
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white shadow-sm">
            <span className="font-serif text-[18px] font-semibold text-[#091510]">100%</span>
            <span className="font-sans text-[11px] text-[#434845] leading-tight">
              {isSv ? 'Regenerativ Jord' : 'Regenerative Soil'}
            </span>
          </div>
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white shadow-sm">
            <span className="font-serif text-[18px] font-semibold text-[#091510]">32</span>
            <span className="font-sans text-[11px] text-[#434845] leading-tight">
              {isSv ? 'Platser Per Sittning' : 'Covers Only'}
            </span>
          </div>
        </div>
      </section>

      {/* Editorial Philosophy Section */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-sans text-[11px] text-[#725b38] uppercase tracking-widest font-semibold">
            {isSv ? 'Kulturarv & Natur' : 'Heritage & Land'}
          </span>
          <h2 className="font-serif text-[26px] text-[#091510] tracking-tight font-normal">
            {isSv ? 'Vår Filosofi & Hantverk' : 'Our Philosophy & Craft'}
          </h2>
          <p className="font-sans text-[12px] text-[#434845] italic">
            {isSv ? 'Vår filosofi & hantverk' : 'Our philosophy & craft'}
          </p>
        </div>

        <div className="flex flex-col gap-3 text-[#1b1c1b] font-sans text-[14px] leading-relaxed">
          <p>
            {isSv
              ? 'Född ur skärgårdens stillhet och Sörmlands urgamla tallhedar är Test Restaurang en hyllning till tålamod. Vi betraktar gastronomi inte som uppfinning, utan som ett ödmjukt lyssnande till jord, bräckt vatten och frostens växlingar.'
              : 'Born from the elemental quiet of the Swedish archipelago and the ancient pine barrens of Sörmland, Test Restaurang is an ode to patience. We view gastronomy not as invention, but as deep listening to soil, brackish water, and changing frosts.'}
          </p>
          <p className="text-[#434845]">
            {isSv
              ? 'Vårt kök samarbetar intimt med mikrojordbrukare som brukar jorden för hand, dykare som skördar havstång i Östersjöns grunda vikar, och samlare som plockar vild fläder, hjortron och späda granskott i gryningen.'
              : 'Our kitchen collaborates directly with micro-growers who till unhurried earth, divers harvesting cold-water kelp in the Baltic shallows, and foragers gathering wild elderflower, cloudberries, and tender spruce tips at daybreak. Every plate distills this raw Scandinavian balance.'}
          </p>
        </div>

        {/* Head Chef Quote Card */}
        <div className="relative overflow-hidden p-6 rounded-2xl bg-[#1e2a24] text-white shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span
              className="material-symbols-outlined text-[#fedeb2] text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              format_quote
            </span>
            <span className="font-sans text-[10px] tracking-widest uppercase text-[#e0c298] font-semibold">
              {isSv ? 'Köksmästarens Notering' : "Chef's Table Note"}
            </span>
          </div>

          <blockquote className="font-serif text-[18px] text-white italic leading-snug font-normal">
            &ldquo;
            {isSv
              ? 'Enkelhet handlar inte om avsaknad av detaljer, utan om mästerskapet i det som blir kvar.'
              : 'Simplicity is not the lack of clutter, but the mastery of what remains.'}
            &rdquo;
          </blockquote>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-8 h-8 rounded-full bg-[#54615a] flex items-center justify-center text-white font-sans text-[12px] font-bold">
              EA
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-[13px] font-semibold text-white leading-tight">
                Elin Asplund
              </span>
              <span className="font-sans text-[11px] text-[#849289]">
                {isSv ? 'Kreativ ledare & Grundare' : 'Culinary Director & Founder'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Pillars Mosaic */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="font-sans text-[11px] text-[#725b38] uppercase tracking-widest font-semibold">
            {isSv ? 'Upplevelsen' : 'The Experience'}
          </span>
          <h3 className="font-serif text-[24px] text-[#091510] font-normal">
            {isSv ? 'Avsmakningens Ritualer' : 'Tasting Rituals'}
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          {/* Pillar 1 */}
          <article className="p-4 rounded-2xl bg-[#f5f3f1] border border-[#c3c8c3]/30 shadow-sm flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#e9e8e6] flex items-center justify-center text-[#091510]">
              <span className="material-symbols-outlined text-[24px]">nest_eco_leaf</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-[17px] text-[#091510] font-medium">
                  {isSv ? 'Hyper-Säsongsbetonade Råvaror' : 'Hyper-Seasonal Ingredients'}
                </h4>
                <span className="font-sans text-[10px] px-2 py-0.5 rounded-full bg-[#e9e8e6] text-[#434845] font-semibold uppercase">
                  Nordic 8
                </span>
              </div>
              <p className="font-sans text-[13px] text-[#434845] leading-relaxed">
                {isSv
                  ? 'I Norden följer naturen inte fyra enkla kvartal. Vi hedrar de 8 samiska mikrosäsongerna—från vårvintertining till midnattssolens mognad och vinterns förädling.'
                  : 'In the North, nature does not follow four simple brackets. We honor the 8 Sámi micro-seasons—from early thaw crust to midnight sun ripening and deep winter preservation.'}
              </p>
            </div>
          </article>

          {/* Pillar 2 */}
          <article className="p-4 rounded-2xl bg-[#f5f3f1] border border-[#c3c8c3]/30 shadow-sm flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#fedeb2] flex items-center justify-center text-[#78603e]">
              <span className="material-symbols-outlined text-[24px]">wine_bar</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-[17px] text-[#091510] font-medium">
                  {isSv ? 'Hantverksvinkällare' : 'Artisanal Cellar'}
                </h4>
                <span className="font-sans text-[10px] px-2 py-0.5 rounded-full bg-[#fedeb2] text-[#78603e] font-semibold uppercase">
                  Low-Intervention
                </span>
              </div>
              <p className="font-sans text-[13px] text-[#434845] leading-relaxed">
                {isSv
                  ? 'Levande viner från europeiska biodynamiska vingårdar tillsammans med vår alkoholfria hantverkskällare med jäst björksav och havtornskefir.'
                  : 'Living wines from small European bio-dynamic vineyards, alongside our celebrated zero-proof cellar of house-fermented birch sap, sea buckthorn kefir, and toasted pine infusions.'}
              </p>
            </div>
          </article>

          {/* Pillar 3 */}
          <article className="p-4 rounded-2xl bg-[#f5f3f1] border border-[#c3c8c3]/30 shadow-sm flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#e9e8e6] flex items-center justify-center text-[#091510]">
              <span className="material-symbols-outlined text-[24px]">chair</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-[17px] text-[#091510] font-medium">
                  {isSv ? 'Matsalens atmosfär' : 'The Dining Room Ambience'}
                </h4>
                <span className="font-sans text-[10px] px-2 py-0.5 rounded-full bg-[#e9e8e6] text-[#434845] font-semibold uppercase">
                  Tactile Calm
                </span>
              </div>
              <p className="font-sans text-[13px] text-[#434845] leading-relaxed">
                {isSv
                  ? 'Skapad med stillsam avsikt. Gotländsk kalksten, handvävt linne och varmt akustiskt trävirke skapar en harmonisk plats för ostörd närvaro.'
                  : 'Designed with quiet intention. Bleached Gotland stone, hand-woven linens, and warm acoustic timber create a restorative atmosphere built for uninterrupted presence.'}
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Team & Kitchen Gallery Showcase */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="font-sans text-[11px] text-[#725b38] uppercase tracking-widest font-semibold">
              {isSv ? 'Bakom Luckan' : 'Behind the Pass'}
            </span>
            <h3 className="font-serif text-[22px] text-[#091510]">
              {isSv ? 'Hantverk i Rörelse' : 'Craft in Motion'}
            </h3>
          </div>
          <span className="font-sans text-[11px] text-[#434845]">
            {isSv ? 'Dagliga Rytmer' : 'Daily Rhythms'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#efeeeb] shadow-sm border border-[#c3c8c3]/30">
              <img
                src={RESTAURANT_IMAGES.chefDetail}
                alt="Chef placing foraged herbs on dish"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-[#091510]/80 to-transparent">
                <span className="font-sans text-[11px] text-white font-medium">Pass Detail</span>
              </div>
            </div>
            <span className="font-sans text-[13px] font-semibold text-[#091510] px-0.5">
              {isSv ? 'Hög Precision' : 'Fine Precision'}
            </span>
            <span className="font-sans text-[11px] text-[#434845] px-0.5">
              Stockholm Archipelagos
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#efeeeb] shadow-sm border border-[#c3c8c3]/30">
              <img
                src={RESTAURANT_IMAGES.ceramics}
                alt="Handmade ceramic dishes"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-[#091510]/80 to-transparent">
                <span className="font-sans text-[11px] text-white font-medium">Ceramics</span>
              </div>
            </div>
            <span className="font-sans text-[13px] font-semibold text-[#091510] px-0.5">
              {isSv ? 'Handgjord Keramik' : 'Handmade Tableware'}
            </span>
            <span className="font-sans text-[11px] text-[#434845] px-0.5">
              Gustavsberg Clayworks
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Producer Ledger */}
      <section className="p-4 rounded-2xl bg-[#efeeeb] border border-[#c3c8c3]/30 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#725b38] text-[20px]">
              verified
            </span>
            <span className="font-sans text-[14px] font-semibold text-[#091510]">
              {isSv ? 'Våra Utvalda Producenter' : 'Our Producer Ledger'}
            </span>
          </div>
          <button
            onClick={() => setShowProducers(!showProducers)}
            type="button"
            className="px-3 py-1 rounded-full bg-white text-[#091510] font-sans text-[11px] font-semibold shadow-sm border border-[#c3c8c3]/30"
          >
            {showProducers ? (isSv ? 'Stäng' : 'Close') : (isSv ? 'Utforska' : 'Explore')}
          </button>
        </div>

        <p className="font-sans text-[13px] text-[#434845]">
          {isSv
            ? 'Vi kartlägger stolt 100 % av vårt säsongsskafferi inom 150 km från vårt kök.'
            : 'We proudly map 100% of our seasonal pantry within 150 km of our hearth.'}
        </p>

        {showProducers && (
          <div className="flex flex-col gap-2 pt-2 animate-in fade-in duration-200">
            {PRODUCERS.map((p) => (
              <div
                key={p.name}
                className="p-3 rounded-xl bg-white border border-[#c3c8c3]/20 flex items-center justify-between shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="font-sans text-[13px] font-semibold text-[#091510]">
                    {p.name}
                  </span>
                  <span className="font-sans text-[11px] text-[#434845]">
                    {isSv ? p.roleSv : p.role}
                  </span>
                </div>
                <span className="font-sans text-[11px] font-bold text-[#725b38]">
                  {p.distance}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Final Invitation & CTA Card */}
      <section className="p-6 rounded-2xl bg-[#f5f3f1] border border-[#c3c8c3]/30 shadow-sm flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#fedeb2] flex items-center justify-center text-[#78603e] shadow-sm">
          <span className="material-symbols-outlined text-[24px]">restaurant</span>
        </div>

        <div className="flex flex-col gap-1 max-w-xs">
          <span className="font-sans text-[11px] text-[#725b38] uppercase tracking-widest font-semibold">
            {isSv ? 'Reservera din plats' : 'Reserve Your Place'}
          </span>
          <h3 className="font-serif text-[22px] text-[#091510]">
            {isSv
              ? 'Upplev Test Restaurang ikväll'
              : 'Experience Test Restaurang this evening'}
          </h3>
          <p className="font-sans text-[13px] text-[#434845] mt-0.5 leading-relaxed">
            {isSv
              ? 'Slå dig ned kring ekbordet för en rofylld säsongsberättelse.'
              : 'Join us around the oak table for an unhurried 6-course seasonal narrative.'}
          </p>
        </div>

        <div className="flex flex-col w-full gap-2 pt-1">
          <button
            onClick={() => onNavigate('book-table')}
            type="button"
            className="w-full h-13 min-h-[50px] px-6 rounded-xl bg-[#091510] text-white font-sans text-[14px] font-semibold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform hover:bg-[#1e2a24]"
          >
            <span>{isSv ? 'Reservera ett bord' : 'Reserve a Table'}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          <button
            onClick={() => onNavigate('menu')}
            type="button"
            className="w-full h-11 px-4 rounded-xl bg-[#efeeeb] text-[#091510] font-sans text-[13px] font-medium flex items-center justify-center hover:bg-[#e4e2e0] transition-colors border border-[#c3c8c3]/30"
          >
            <span>{isSv ? 'Se aktuell säsongsmeny' : 'View Seasonal Menu'}</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 text-[#434845] pt-2 text-[11px]">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-[#725b38]">
              schedule
            </span>
            <span>{isSv ? 'Middag från 17:30' : 'Dinner from 17:30'}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-[#725b38]">
              location_on
            </span>
            <span>Östermalm / Skeppsbron</span>
          </div>
        </div>
      </section>
    </div>
  );
};
