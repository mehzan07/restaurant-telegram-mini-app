import { Dish, Producer, FAQItem, TastingCourse } from '../types';

export const RESTAURANT_IMAGES = {
  logo: 'https://lh3.googleusercontent.com/aida/AEtjO1VNs7MU9e0ndOulP4sNKj-F_RD3szqgkR_d_1xFtPRedp-cPOtrBZL8Bzdn9A8JmusQyCYMlS90vDtFNBtLz_yvtDDzo58BVwu900uBMv_zLyfoGavQ76pPTZgeqGA6YtVdEr2VSFF3EbU3ZWxrh5RaWptxwtDcVpGrZdU3XlVt7mrdd7O72ah1xknlwYfSMrsfVBHRJgKF0lVdgV4CbWRZ4I6FZRzch9umszw5afb_ByPxkF4jFeCub7CN',
  homeHero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ9EpATVuqq6P23_3ATnaib5zyRyZVGxQL6kwggSLUpWGOeP1EPLCaSVKU6oCveygw5lp-BgSjzXcKguxI8omFttlTupj3WUfBr2SIUlG5CiaGn1_8x_9QW0PLsDbHJ7aOhQHeGTHRlhKgVifMDmDn05HHkRzcJeskkY8aiss3OC0BrNwka5Ae8O0jsK5lP3nFQ6eA-C35-IYmsML9A8CrttaeBU2nvMviu65FaKu9l0EW-S3xwc1lyA',
  charFeature: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAo-s8JAqYXMruhL2eoO73X6t467K3AdJyf2C2sd5SjUPlJvutGVGpampYABppOS7Fiv6ZKPSwNyfBl-cZ3BxHqjefjEJeF8MBUmm5mywKPPuXX62R-JTQU_XM02I9fy0OtvKdevg52L0RdyNOiU2-purVEfPyQNK6m27A5Vpd-JtMhnxlCRZEFs5lubzOPxwN6Sp1IKbF6bbkp4qR7Z3hIrVC3ViMnYOEBNHNnETgcfMaRgKInA5UJg',
  bookTableInterior: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEMJaIGtQ-bHVclGQSF957oJrQ-cAFH-vw6YrY-RiL7vx7tectJ8asgswFkmcz6hEMDiXlO_puv3ZaIHBAUnoPGMSn7L68BDgViHWivOCXe2A34oK4t4EwevzM7rbM1gT2TPvfNHovK7RdjZIJCaVBfIW4M2M0JQgUpg8q3RlAtm3_1lcKLQO9-a52UcIyHm8AdYFb_etk1DgD01HErbllNNu_SLuDAsTR7fYs8a02sZydBXiJSJc08w',
  aboutHero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuBeYM_B6yQG75mnYDw-80Inx_-dxnSPbGSYAaTTa74B6GoIRWkl6oq1WR1IsPxzPsTRk9xe2iTId3rXwlwA5j2PA74JBcGyIA-H65LMONKEInyXd8Xrr-0uwQMweiFQZTVbwXfMWV3aQ71GFjyIGIYzkHNetYAxrfawuOB8amuAqFjIqI0776vAayNxsm81sF6-iD5aa1z2zG0YOfHsYnqP57hqqBXgec2cFVsxm2CDSO9dWZfBRfTw',
  chefDetail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGDZKN4fkzIT8Jx0RLzHLYyW1fEmPfT86qfdsXBigcBKH8l-8JRSVyHdRnYkafP06p9zMScO3zePOOHW7evGKs--jMP5P1_7AVpiUMvWbZCeYcEUcNshi4VFyyQZjteC-tfLcMBWKkQq2cxc_r1OyetZscDKbbpeCl2FkvNhWy7_dCP0enBRgKeSXnwUS3E1sPwn8RkEyKYiKq279DOmviV2X2iFyAi6xo3kxDujxNuHzgcfH-j2xJFA',
  ceramics: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8UzaREul1I-wETqUQtBqHLU5X47wUpQ_MpHOirzRU2HTXPO40_416TL5zqAe2EWdSVBv5R8GHo736DeLmuad_KVHEVckFbSfKdhudW-yyq50k1GGyY1X1yx2Oz-7ierrPjFEl330XMu8e5X8X1z0Qd8ITfY_ncZaUFKpiBy-MQN1OcEw4k6DU4ZxZZuLTP9NtzeJaJlXe4KEGVWYwD7I0pgb_BniIHwh9Q-1PLE9EA8rNgy80VZ3nTw',
  mapView: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEgwOFvt6eQIa6XLaqBtUBFUZ5dKaEUuAZTR3GOUejNp5n2XPsAnG85ENzrg3a3BOFJQ_Myn071r1SEDWT6_yYmiezAul8T2GNYv-HRlhOxgPohtbB3LFfmRmj0ix47SJyvFfgOFqQpFDuu_Bgo3lmlLamiPePu7StW1Aq_OLIEu69EzeMmUYBsj5rbCitTkh2Rqi1SzIahyPrfmyU72wFsgMuGvYBdcLL514jpYEZmgd74kDYJyaaAA',
  hostPortrait: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAG6HS55me34PfXmPnBZ9gSPhHuO7T2k0y5jzh_PT6ZC5jnruTdZcH2LhL3M-jUVVniL7drng_iCO038oo9_GmdZXIaCCdTIFfyMZ6VkqlcO5OykSauwfYkqh1jduJTTyczV20vvgBjWCpEPAMCarmE_Dip5_qnvaoDWk0ebPRNbJN5bKo3T8lIHVig3lq4dQYIWI5Hlp_nXNMcmGPeg8Pk8wtMvSbbeCrWgw7LZgAWNjfZ-KVQXlFTrQ',
  charMenuPhoto: 'https://lh3.googleusercontent.com/aida/AEtjO1UNJG-wcUvKW2PIbiv4BVwQ-EkOP9cJS_Z7IJYXMJfP8nyNK4r6BqTILp8gj78DE1VhxP_AyDfgOQpTzfHO1YJLmc9gitEJfpw5CLWErume7G2CRyut2v-552iYFGFEDOHIihTCsEnkJN7gbccz6CIiFs2O_lrlnaJuGJv7a9V3VHU5F9oYSwLDqdneRbzBQKzRRHhkAKzjNKtN_AiFJ5bpKmrEyG4UHZH-rUgWfnQbNesTLoTaPnCkU1PT'
};

export const DISHES: Dish[] = [
  {
    id: 'char',
    title: 'Röding & Krondill',
    titleSv: 'Röding & Krondill',
    sub: 'Wild Arctic Char · Swedish Crown Dill Blossom',
    subSv: 'Vild röding · Krondill från Sörmland',
    price: 345,
    category: 'mains',
    desc: 'Crispy pan-roasted skin, whipped smoked brown butter emulsion, foraged sea herbs, and sea-salt crushed almond potato from Norrland. Finished table-side with crown dill blossom oil.',
    descSv: 'Frasigt halstrad röding med vispad emulsion på rökt brynt smör, vildplockade strandörter och krossad mandelpotatis från Norrland.',
    pairing: '2021 Jura Savagnin, Domaine de la Touraize',
    pairingNotes: 'Nutty oxidation, clean salinity, and flinty minerality that cuts effortlessly through rich smoked butter.',
    pairingNotesSv: 'Nötig oxidation, krispig sälta och stenig mineralitet som skär igenom det rökta smöret.',
    allergens: 'Gluten-Free · Contains Dairy (Lactose)',
    allergensSv: 'Glutenfri · Innehåller laktos',
    tags: ['local', 'gf'],
    tagLabel: 'Wild Catch',
    tagLabelSv: 'Vildfångad',
    imageUrl: RESTAURANT_IMAGES.charMenuPhoto,
    isSignature: true,
  },
  {
    id: 'reindeer',
    title: 'Renkalv & Enbär',
    titleSv: 'Renkalv & Enbär',
    sub: 'Luleå Arctic Reindeer Loin · Foraged Juniper',
    subSv: 'Renkalvsrygg från Luleå · Skogsenbär',
    price: 410,
    category: 'mains',
    desc: 'Slow-charred tender reindeer loin, tart preserved lingonberry reduction, scorched sunchoke purée, and fragrant cold-pressed pine needle infusion.',
    descSv: 'Varsamt glödbakad renkalvsrygg med syrlig lingongravé, sotad jordärtskockskräm och krispiga tallbarr.',
    pairing: '2018 Barolo Serralunga d\'Alba, Massolino',
    pairingNotes: 'Firm mountain tannins and wild tart berry notes complement game richness.',
    pairingNotesSv: 'Strama alpina tanniner och vilda skogsbär som gifter sig harmoniskt med viltsmaken.',
    allergens: 'Gluten-Free · Contains Dairy',
    allergensSv: 'Glutenfri · Innehåller laktos',
    tags: ['local', 'gf'],
    tagLabel: 'GF',
    tagLabelSv: 'Glutenfri',
  },
  {
    id: 'ravioli',
    title: 'Karljohan Svampravioli',
    titleSv: 'Karljohan Svampravioli',
    sub: 'King Bolete Forest Mushrooms · 24-Mo Aged Västerbottensost',
    subSv: 'Karljohanssvamp · 24 månaders Västerbottensost',
    price: 295,
    category: 'mains',
    desc: 'Handmade silken yolk pasta parcels filled with braised wild King Bolete mushrooms, roasted hazelnuts, golden hazelnut butter jus, and regional mountain cheese.',
    descSv: 'Handgjorda äggpastaknyten fyllda med brässerad Karljohanssvamp, rostade hasselnötter från Dalarna och brynt hasselnötssmör.',
    pairing: '2020 Meursault, Domaine Ballot-Millot',
    pairingNotes: 'Round buttery richness with toasted hazelnut nuances harmonizes with aged cheese.',
    pairingNotesSv: 'Smörig elegans med toner av rostade hasselnötter som möter den lagrade ostens umami.',
    allergens: 'Contains Gluten (Wheat) · Dairy · Tree Nuts (Hazelnut)',
    allergensSv: 'Innehåller gluten (vete), mjölkprotein, hasselnötter',
    tags: ['vg', 'local'],
    tagLabel: 'VG',
    tagLabelSv: 'Vegetarisk',
  },
  {
    id: 'cloudberry',
    title: 'Hjortron & Kardemumma',
    titleSv: 'Hjortron & Kardemumma',
    sub: 'Subarctic Cloudberries · Green Cardamom',
    subSv: 'Subarktiska myrhjortron · Grön kardemumma',
    price: 165,
    category: 'desserts',
    desc: 'Hand-picked marsh cloudberry coulis over aerated cardamom cream semifreddo, roasted white chocolate crumb, and delicate wood sorrel leaves.',
    descSv: 'Myrplockade gyllene hjortron med luftig kardemummasemifreddo, rostad vit choklad och krispig harsyra.',
    pairing: '2020 Brännland Iscider (Ice Cider), Västerbotten',
    pairingNotes: 'Swedish iced cider with radiant natural acid cuts and honeyed floral perfume.',
    pairingNotesSv: 'Svensk iscider med frisk krispig syra som speglar hjortronens syrlighet.',
    allergens: 'Gluten-Free · Contains Dairy & Eggs',
    allergensSv: 'Glutenfri · Innehåller mejeriprodukter och ägg',
    tags: ['local', 'gf'],
    tagLabel: 'GF',
    tagLabelSv: 'Glutenfri',
  },
  {
    id: 'scallop',
    title: 'Östersjökammussla & Gran',
    titleSv: 'Östersjökammussla & Gran',
    sub: 'Hand-Dived Scallop · Spruce Shoot Broth',
    subSv: 'Handdykt pilgrimsmussla · Buljong på granskott',
    price: 245,
    category: 'starters',
    desc: 'Lightly torched cold-water scallop with fermented white asparagus broth, kohlrabi disc, and fresh spruce shoot oil.',
    descSv: 'Varsamt halstrad pilgrimsmussla med fermenterad vit sparrisbuljong, kålrabbi och olja på späda granskott.',
    pairing: 'NV Champagne Blanc de Blancs, Pierre Gimonnet',
    pairingNotes: 'Chalky precision and persistent fine mousse amplify coastal sweetness.',
    pairingNotesSv: 'Kalkrik mineralitet och finessrik mousse som lyfter havets sötma.',
    allergens: 'Shellfish · Gluten-Free',
    allergensSv: 'Skaldjur · Glutenfri',
    tags: ['local', 'gf'],
    tagLabel: 'Raw Bar',
    tagLabelSv: 'Råbar',
  },
  {
    id: 'tartare',
    title: 'Oxkind & Märg',
    titleSv: 'Oxkind & Märg',
    sub: 'Dry-Aged Beef Tartare · Smoked Marrow',
    subSv: 'Hängmörad oxtartar · Rökt benmärg',
    price: 220,
    category: 'starters',
    desc: 'Hand-cut Sörmland beef with smoked bone marrow emulsion, crispy fermented rye, and pickled elderberries.',
    descSv: 'Handskuren tartare från Sörmland med emulsion på rökt märg, krispig surdeg och picklade fläderbär.',
    pairing: '2021 Beaujolais-Villages, Jean Foillard',
    pairingNotes: 'Vibrant crunchy gamay fruit and floral lift refresh the palate.',
    pairingNotesSv: 'Levande fruktighet på Gamay som skänker spänst och fräschör.',
    allergens: 'Contains Gluten (Rye)',
    allergensSv: 'Innehåller råg',
    tags: ['local'],
    tagLabel: 'Heritage',
    tagLabelSv: 'Kulturarv',
  },
  {
    id: 'birch-cellar',
    title: 'Alfahus Björksav & Havtorn',
    titleSv: 'Alfahus Björksav & Havtorn',
    sub: 'House-Fermented Birch Sap · Sea Buckthorn Kefir',
    subSv: 'Husfermenterad björksav · Havtornskefir',
    price: 110,
    category: 'drinks',
    desc: 'Zero-proof artisanal cellar pour crafted from spring-tapped Lapland birch trees, lacto-fermented sea buckthorn, and roasted pine tip aroma.',
    descSv: 'Alkoholfri fermenterad hantverksdryck på vårskördad björksav, havtornskefir och doft av rostad tall.',
    pairing: 'Signature Zero-Proof Pairing Flight',
    pairingNotes: 'Crisp lactic acidity with botanical forest floor finish.',
    pairingNotesSv: 'Frisk mjölksyra med vilda skogsbotaniska toner.',
    allergens: 'Dairy-Free · Gluten-Free',
    allergensSv: 'Mjöklfri · Glutenfri',
    tags: ['local', 'gf', 'vg'],
    tagLabel: 'Zero-Proof',
    tagLabelSv: 'Alkoholfri',
  },
  {
    id: 'natural-flight',
    title: 'Nordic Sommelier Cellar Pairing (4 Glasses)',
    titleSv: 'Nordisk Sommelier Vinpaket (4 Glas)',
    sub: 'Living biodynamic cuvées from small European growers',
    subSv: 'Levande biodynamiska viner från små europeiska odlare',
    price: 680,
    category: 'drinks',
    desc: 'Hand-selected biodynamic and low-intervention wines curated specifically for the autumn tasting sequence.',
    descSv: 'Noga utvalda naturviner som speglar och harmonierar med höstens avsmakningsmeny.',
    pairing: 'Full Degustation Accord',
    pairingNotes: 'Each pour matches the mineral and botanical temperature of the course.',
    pairingNotesSv: 'Varje servering anpassas efter rättens temperatur och botaniska karaktär.',
    allergens: 'Contains Sulphites',
    allergensSv: 'Innehåller sulfiter',
    tags: ['local'],
    tagLabel: 'Sommelier Choice',
    tagLabelSv: 'Sommelierens val',
  }
];

export const PRODUCERS: Producer[] = [
  {
    name: 'Sörmland Dairy Haven',
    role: 'Raw jersey milk & churned butter',
    roleSv: 'Opastöriserad jerseymjölk & kärnat smör',
    distance: '42 km'
  },
  {
    name: 'Kullens Biodynamic Farm',
    role: 'Heritage brassicas & heirloom root vegetables',
    roleSv: 'Kulturkål & kulturrotfrukter',
    distance: '68 km'
  },
  {
    name: 'Roslagen Sea Harvest',
    role: 'Hand-dived scallops & Baltic sea herbs',
    roleSv: 'Handdykta pilgrimsmusslor & havsörter',
    distance: '89 km'
  },
  {
    name: 'Österlen Orchard Guild',
    role: 'Preserved heirloom apples, pears & wild cider',
    roleSv: 'Gamla äppelsorter & vildäppelcidermust',
    distance: '142 km'
  }
];

export const FAQS: FAQItem[] = [
  {
    question: 'What is the dress code?',
    questionSv: 'Finns det någon klädkod?',
    answer: 'We cultivate a relaxed yet polished atmosphere. Smart casual attire is gently encouraged. We simply ask that sportswear and outdoor outerwear be checked into our complimentary cloakroom.',
    answerSv: 'Vi förespråkar en avslappnad men vårdad atmosfär (smart casual). Träningskläder och ytterkläder hängs vänligen in i vår fria garderob.'
  },
  {
    question: 'Is parking or valet provided?',
    questionSv: 'Erbjuds parkering eller betjänad bilparkering?',
    answer: 'Valet service is available on Friday and Saturday evenings from 17:00 at our Skeppsbron turnaround. For other days, street parking and the nearby Slottsbacken garage offer secure spaces within a 3-minute stroll.',
    answerSv: 'Betjänad parkering finns tillgänglig fredag och lördag från 17:00 vid vändplanen på Skeppsbron. Övriga dagar rekommenderar vi garaget vid Slottsbacken.'
  },
  {
    question: 'Can I purchase dining gift cards?',
    questionSv: 'Kan jag köpa presentkort?',
    answer: 'Yes. Tactile wax-sealed voucher envelopes can be purchased directly at the host stand, or digital gift experiences can be generated immediately via our Telegram Concierge bot.',
    answerSv: 'Ja. Vaxförseglade presentkort säljs i hovmästardisken, och digitala presentupplevelser ordnas smidigt direkt via vår Telegram Concierge.'
  },
  {
    question: 'What is your cancellation policy?',
    questionSv: 'Vad gäller vid avbokning?',
    answer: 'Cancellations and amendments are completely free of charge up to 6 hours before your seating. For tables of 6 or more, we kindly ask for 24 hours notice.',
    answerSv: 'Avbokning och ändring sker kostnadsfritt fram till 6 timmar innan sittningen. För sällskap om 6 personer eller fler ber vi om 24 timmars framförhållning.'
  }
];

export const TASTING_MENU_COURSES: TastingCourse[] = [
  {
    courseNumber: 1,
    name: 'Östersjökammussla & Gran',
    nameSv: 'Östersjökammussla & Gran',
    category: '1st Course · Cold Sea',
    categorySv: 'Servering 1 · Kallt hav',
    desc: 'Lightly torched Baltic scallop with fermented white asparagus broth, crisp kohlrabi disc, and cold-pressed spruce shoot oil.',
    descSv: 'Varsamt halstrad pilgrimsmussla med fermenterad vit sparrisbuljong, kålrabbiskiva och kallpressad granskottsolja.',
    pairing: 'NV Champagne Blanc de Blancs, Pierre Gimonnet',
    pairingSv: 'NV Champagne Blanc de Blancs, Pierre Gimonnet'
  },
  {
    courseNumber: 2,
    name: 'Oxkind & Märg',
    nameSv: 'Oxkind & Märg',
    category: '2nd Course · Forest Floor',
    categorySv: 'Servering 2 · Skogsmark',
    desc: 'Hand-cut Sörmland dry-aged beef tartare with whipped smoked bone marrow emulsion, crisp sourdough crumb, and pickled elderberries.',
    descSv: 'Handskuren tartar från Sörmland med emulsion på rökt märg, krispigt rågströssel och inlagda fläderbär.',
    pairing: '2021 Beaujolais-Villages, Jean Foillard',
    pairingSv: '2021 Beaujolais-Villages, Jean Foillard'
  },
  {
    courseNumber: 3,
    name: 'Karljohan Svampravioli',
    nameSv: 'Karljohan Svampravioli',
    category: '3rd Course · Autumn Harvest',
    categorySv: 'Servering 3 · Höstskörd',
    desc: 'Hand-folded egg pasta parcels filled with braised King Bolete forest mushrooms, roasted Dalarna hazelnuts, and 24-month aged Västerbottensost broth.',
    descSv: 'Handgjorda pastaknyten fyllda med brässerad Karljohanssvamp, rostade hasselnötter från Dalarna och buljong på 24 månaders Västerbottensost.',
    pairing: '2020 Meursault, Domaine Ballot-Millot',
    pairingSv: '2020 Meursault, Domaine Ballot-Millot'
  },
  {
    courseNumber: 4,
    name: 'Röding & Krondill',
    nameSv: 'Röding & Krondill',
    category: '4th Course · Coastal Embers (Signature)',
    categorySv: 'Servering 4 · Kusteld (Signatur)',
    desc: 'Crispy pan-roasted wild Arctic char with smoked brown butter emulsion, coastal succulents, and crushed Norrland almond potato with crown dill blossom oil.',
    descSv: 'Frasigt halstrad röding med emulsion på rökt brynt smör, strandörter och krossad mandelpotatis från Norrland med krondillolja.',
    pairing: '2021 Jura Savagnin, Domaine de la Touraize',
    pairingSv: '2021 Jura Savagnin, Domaine de la Touraize'
  },
  {
    courseNumber: 5,
    name: 'Renkalv & Enbär',
    nameSv: 'Renkalv & Enbär',
    category: '5th Course · Subarctic Wilderness',
    categorySv: 'Servering 5 · Vildmark',
    desc: 'Slow-charred Arctic reindeer loin from Luleå with tart preserved lingonberry reduction, scorched sunchoke purée, and fragrant pine needle infusion.',
    descSv: 'Varsamt glödbakad renkalvsrygg från Luleå med syrlig lingongravé, sotad jordärtskockskräm och skogsenbär.',
    pairing: '2018 Barolo Serralunga d\'Alba, Massolino',
    pairingSv: '2018 Barolo Serralunga d\'Alba, Massolino'
  },
  {
    courseNumber: 6,
    name: 'Hjortron & Kardemumma',
    nameSv: 'Hjortron & Kardemumma',
    category: '6th Course · Sweet Tundra',
    categorySv: 'Servering 6 · Söt tundra',
    desc: 'Hand-picked subarctic marsh cloudberries with aerated cardamom cream semifreddo, roasted white chocolate crumble, and delicate wood sorrel.',
    descSv: 'Myrplockade gyllene hjortron med luftig kardemummasemifreddo, rostad vit choklad och krispig harsyra.',
    pairing: '2020 Brännland Iscider, Västerbotten',
    pairingSv: '2020 Brännland Iscider, Västerbotten'
  }
];

export interface BookingDateOption {
  key: string;
  isoDate: string; // "2026-09-20"
  title: string;
  titleSv: string;
  day: string;
  monthName: string;
  monthNameSv: string;
  year: number;
  weekday: string;
  weekdaySv: string;
  full: string;
  fullSv: string;
  isToday: boolean;
}

// Fixed system current date as required: 2026-09-20
export const CURRENT_DATE_STRING = '2026-09-20';

export function getBaseCurrentDate(): Date {
  return new Date(2026, 8, 20); // Year: 2026, Month: 8 (Sept), Day: 20
}

const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SV_MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
const EN_FULL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SV_FULL_MONTHS = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];
const EN_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SV_WEEKDAYS = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];

export function generateBookingDates(startDate: Date, count: number = 180): BookingDateOption[] {
  const baseToday = getBaseCurrentDate();
  const baseTodayMidnight = new Date(baseToday.getFullYear(), baseToday.getMonth(), baseToday.getDate()).getTime();

  const dates: BookingDateOption[] = [];
  for (let i = 0; i < count; i++) {
    // Explicit noon anchor prevents Daylight Saving Time offset anomalies
    const d = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i, 12, 0, 0);

    const year = d.getFullYear();
    const monthIndex = d.getMonth();
    const dayNum = d.getDate();
    const dayOfWeek = d.getDay();

    const isoDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const dMidnight = new Date(year, monthIndex, dayNum).getTime();
    const isToday = dMidnight === baseTodayMidnight;
    const isTomorrow = dMidnight === baseTodayMidnight + 86400000;

    let title = `${EN_WEEKDAYS[dayOfWeek]}`;
    let titleSv = `${SV_WEEKDAYS[dayOfWeek]}`;
    if (isToday) {
      title = 'Today';
      titleSv = 'Idag';
    } else if (isTomorrow) {
      title = 'Tomorrow';
      titleSv = 'Imorgon';
    } else if (dayOfWeek === 0 || dayOfWeek === 6) {
      title = 'Weekend';
      titleSv = 'Helg';
    }

    const full = `${isToday ? 'Today, ' : ''}${EN_WEEKDAYS[dayOfWeek]} ${dayNum} ${EN_MONTHS[monthIndex]}`;
    const fullSv = `${isToday ? 'Idag, ' : ''}${SV_WEEKDAYS[dayOfWeek]} ${dayNum} ${SV_MONTHS[monthIndex]}`;

    dates.push({
      key: isoDate,
      isoDate,
      title,
      titleSv,
      day: String(dayNum),
      monthName: EN_FULL_MONTHS[monthIndex],
      monthNameSv: SV_FULL_MONTHS[monthIndex],
      year,
      weekday: EN_WEEKDAYS[dayOfWeek],
      weekdaySv: SV_WEEKDAYS[dayOfWeek],
      full,
      fullSv,
      isToday
    });
  }
  return dates;
}

export interface AvailableMonth {
  key: string;
  monthName: string;
  monthNameSv: string;
  year: number;
  firstIndex: number;
}

export function getAvailableMonths(dates: BookingDateOption[]): AvailableMonth[] {
  const map = new Map<string, AvailableMonth>();
  dates.forEach((d, index) => {
    const key = `${d.year}-${d.monthName}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        monthName: d.monthName,
        monthNameSv: d.monthNameSv,
        year: d.year,
        firstIndex: index,
      });
    }
  });
  return Array.from(map.values());
}

export const TIME_SLOTS = [
  { time: '17:30', status: 'Available', statusSv: 'Ledigt', badge: null },
  { time: '18:00', status: 'Available', statusSv: 'Ledigt', badge: null },
  { time: '18:30', status: 'Popular', statusSv: 'Populärt', badge: 'POPULAR' },
  { time: '19:15', status: 'Few tables', statusSv: 'Få bord', badge: null },
  { time: '20:00', status: 'Available', statusSv: 'Ledigt', badge: null },
  { time: '20:45', status: 'Late sitting', statusSv: 'Sen sittning', badge: null },
];

export const SEATING_AREAS = [
  {
    id: 'matsal',
    title: 'Main Dining Room (Matsal)',
    titleSv: 'Stora Matsalen',
    desc: 'Linen tables, subtle Nordic acoustic serenity',
    descSv: 'Linnedukar och vacker nordisk akustisk stillhet',
    tag: 'Signature',
    tagSv: 'Signatur'
  },
  {
    id: 'counter',
    title: "Chef's Counter",
    titleSv: 'Kockbaren / Chef\'s Counter',
    desc: 'Direct view of the open fire & plating kitchen',
    descSv: 'Direktvy över eldhällen och det öppna köket',
    tag: '4 seats left',
    tagSv: '4 platser kvar'
  },
  {
    id: 'lounge',
    title: 'Lounge & Wine Bar',
    titleSv: 'Lounge & Vinbar',
    desc: 'Low tables, casual artisanal pours & small plates',
    descSv: 'Låga bord, ledigt umgänge och hantverksviner',
    tag: 'Intimate',
    tagSv: 'Intimt'
  }
];
