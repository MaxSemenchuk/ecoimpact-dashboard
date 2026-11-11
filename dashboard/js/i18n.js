// ============================================================
// GEN Ukraine Impact Dashboard — Internationalisation (EN / UK)
// ============================================================
// English is the source language and the key: T('English text') returns the Ukrainian text when the
// UI language is Ukrainian, and the English text otherwise. Static HTML is translated in place on load
// (text nodes, data-tip / title / aria-label attributes); dynamic strings in the JS call T() directly.
// Language: ?lang=uk|en  →  saved choice (localStorage)  →  browser language  →  English.
// Switching language reloads the page.

(function () {
  // ---- Ukrainian dictionary (English text → Ukrainian) ----
  // Array values are plural forms [one, few, many] for strings that contain {n}.
  const UK = {
    // Header / intro
    'Ukraine Ecovillage': 'Екоселища України',
    'Impact Dashboard': 'Панель впливу',
    'Global Ecovillage Network — Ukraine': 'Глобальна мережа екоселищ — Україна',
    'Loading...': 'Завантаження…',
    'A network of ecovillages across Ukraine, tracked in the open.': 'Мережа екоселищ України, дані якої відкриті для всіх.',
    'Badge': 'Мітка',
    'What is this?': 'Що це?',

    // Cards
    'Solar Energy': 'Сонячна енергія',
    'Restoring Nature': 'Відновлення природи',
    'Local Economy': 'Місцева економіка',
    'Funding': 'Фінансування',
    'Where We Are': 'Де ми є',

    'Solar panels at ecovillages are connected to Arkreen, which records every kilowatt-hour they generate and rewards it with tokens.':
      'Сонячні панелі екоселищ підключені до Arkreen: платформа фіксує кожну згенеровану кіловат-годину та винагороджує її токенами.',
    'Projects that plant trees and restore land and water, recorded on independent platforms so the results can be verified.':
      'Проєкти, що садять дерева та відновлюють землю й воду. Результати фіксуються на незалежних платформах, тож їх можна перевірити.',
    'Each village issues its own digital voucher on Sarafu — a local currency for shared work and mutual help — and logs what it does as activity reports.':
      'Кожне поселення випускає на Sarafu власний цифровий ваучер — місцеву валюту для спільної роботи та взаємодопомоги — і веде звіти про свою діяльність.',
    'Donations, grants and eco-credit sales that support the network. Giveth is a donation platform for public-good projects; Karma tracks community grants and milestones.':
      'Пожертви, гранти та продаж еко-кредитів, що підтримують мережу. Giveth — платформа пожертв для проєктів суспільного блага; Karma відстежує гранти громад і досягнення.',
    'Ecovillages, solar stations, rainwater systems and tree-planting projects across Ukraine. Use the layer toggles on the map to show or hide each type.':
      'Екоселища, сонячні станції, системи збору дощової води та проєкти висадки дерев по всій Україні. Перемикачі шарів на карті дозволяють показати або сховати кожен тип.',

    // Energy
    'Clean energy generated': 'Вироблено чистої енергії',
    'Total electricity produced by the connected solar sites, measured by smart meters. 1 MWh = 1,000 kWh.':
      'Загальна кількість електроенергії, виробленої підключеними сонячними станціями, за даними розумних лічильників. 1 МВт·год = 1 000 кВт·год.',
    'AKRE rewards earned': 'Зароблено винагород AKRE',
    "AKRE is Arkreen's crypto token. Sites earn it automatically for producing verified renewable energy.":
      'AKRE — криптотокен Arkreen. Станції отримують його автоматично за підтверджену відновлювану енергію.',
    'Solar Sites': 'Сонячні станції',
    'Solar Sites · data as of {date}': 'Сонячні станції · дані станом на {date}',
    'Each row: site · its public wallet · energy produced · tokens earned': 'У кожному рядку: станція · її публічний гаманець · вироблена енергія · зароблені токени',
    'Monthly generation, kWh': 'Генерація за місяцями, кВт·год',
    'Monthly generation, kWh ({from} – {to})': 'Генерація за місяцями, кВт·год ({from} – {to})',
    'Shown for {n} of {total} stations: the others report only a lifetime total to Arkreen, with no monthly breakdown.':
      'Показано {n} зі {total} станцій: решта передає в Arkreen лише загальний підсумок, без розбивки за місяцями.',
    'Total: {n} kWh': 'Разом: {n} кВт·год',
    ' {name}: {n} kWh': ' {name}: {n} кВт·год',
    'kWh': 'кВт·год',
    'MWh': 'МВт·год',
    'no data yet': 'даних ще немає',
    'No readings reported yet': 'Показників ще не передано',
    'Live data': 'Реальні дані',
    'Mock data': 'Тестові дані',

    // Ecology
    'Verified impact claims': 'Підтверджені заяви про вплив',
    'Each card is a Hypercert: a public, tamper-proof record of work done (hectares restored, water systems built) that anyone can check or fund.':
      'Кожна картка — це Hypercert: публічний запис про виконану роботу (відновлені гектари, збудовані водні системи), який не можна підробити і який будь-хто може перевірити чи профінансувати.',
    'Tree planting projects': 'Проєкти висадки дерев',
    "Silvi is a tree-tracking platform. Each project is mapped and reviewed; 'Approved' means Silvi has verified it. Tree counts show up once projects report them.":
      'Silvi — платформа обліку дерев. Кожен проєкт нанесено на мапу й перевірено; «Підтверджено» означає, що Silvi його верифікувала. Кількість дерев з’явиться, щойно проєкти її нададуть.',
    'Projects': 'Проєкти',
    'Trees planted': 'Висаджено дерев',
    "Number of trees reported by projects. '—' means not reported yet.": 'Кількість дерев, заявлена проєктами. «—» означає, що даних ще немає.',
    'Not reported yet': 'Даних ще немає',
    'Trees recorded in Silvi: tracked trees, or GPS-tagged planting photos (the points on the Silvi map)':
      'Дерева, зафіксовані в Silvi: окремі дерева або фото посадок з GPS (точки на мапі Silvi)',
    'From the Hypercert claim of the network (Silvi projects have not reported tree counts yet)':
      'З гіперсертифіката мережі (проєкти в Silvi ще не подали кількість дерев)',
    "Number of trees reported by projects. If Silvi projects have not reported yet, the figure comes from the network's Hypercert claim.":
      'Кількість дерев, заявлена проєктами. Поки проєкти в Silvi її не подали, цифра береться з гіперсертифіката мережі.',
    'Land restored': 'Відновлено землі',
    'Total area of all tree-planting projects, in hectares. 1 hectare ≈ 1.4 football pitches.':
      'Загальна площа всіх проєктів з висадки дерев, у гектарах. 1 гектар ≈ 1,4 футбольного поля.',
    'ha': 'га',
    '{n}+ trees': '{n}+ дерев',
    '{n} water systems': ['{n} водна система', '{n} водні системи', '{n} водних систем'],
    '{n} wells': ['{n} свердловина', '{n} свердловини', '{n} свердловин'],
    '{n} lakes restored': ['{n} відновлене озеро', '{n} відновлені озера', '{n} відновлених озер'],
    '{n}k L storage': 'запас {n} тис. л',
    '{n}+ livestock': '{n}+ голів худоби',
    '{n} ecovillages': ['{n} екоселище', '{n} екоселища', '{n} екоселищ'],
    'ecosystem restoration': 'відновлення екосистем',
    'water infrastructure': 'водна інфраструктура',
    'Ecovillage Network GEN Ukraine': 'Мережа екоселищ GEN Ukraine',
    'Water Save System for Ecovillages': 'Система збереження води для екоселищ',
    'Approved': 'Підтверджено',
    'Verified': 'Верифіковано',
    'Pending': 'На розгляді',
    'In Review': 'На перевірці',
    'No status': 'Без статусу',
    'Draft': 'Чернетка',
    'View on Silvi →': 'Відкрити в Silvi →',

    // Local economy
    'What communities do': 'Чим займаються громади',
    'Activity reports logged by villages, grouped by topic: workdays, events, building, care and more.':
      'Звіти про діяльність, які вели поселення, за темами: толоки, події, будівництво, догляд тощо.',
    'Shared funds (Commitment Pools)': 'Спільні фонди (Commitment Pools)',
    "A pool is a community fund on Sarafu where people swap vouchers for goods, services or microgrants. 'tx' = transactions, 'users' = distinct participants.":
      'Пул — це громадський фонд на Sarafu, де люди обмінюють ваучери на товари, послуги чи мікрогранти. «тр.» — транзакції, «учасн.» — окремі учасники.',
    'Village vouchers': 'Ваучери поселень',
    "Each settlement's own voucher. 'Reports' are activities the community has logged (workdays, events, builds).":
      'Власний ваучер кожного поселення. «Звіти» — це діяльність, яку записала громада (толоки, події, будівництво).',
    '{n} tx': '{n} тр.',
    '{n} users': '{n} учасн.',
    'Total on-chain claims: {n}': 'Усього записів у блокчейні: {n}',
    'Page {n} of {total}': 'Сторінка {n} з {total}',
    '{n} reports': ['{n} звіт', '{n} звіти', '{n} звітів'],
    '{label}: {n} reports': '{label}: {n} звітів',
    'Other': 'Інше',

    // Funding
    'Total raised': 'Всього залучено',
    'Giveth donations plus eco-credit sales (INAT), in US dollars. USDC is a digital dollar, so 1 USDC counts as US$1.':
      'Пожертви Giveth плюс продаж еко-кредитів (INAT) у доларах США. USDC — цифровий долар, тож 1 USDC рахується як 1 $.',
    'donations {a} · credit sales {b}': 'пожертви {a} · продаж кредитів {b}',
    'Donors': 'Донори',
    'Eco-credits sold': 'Продано еко-кредитів',
    'GIV tokens given out': 'Роздано токенів GIV',
    "GIV is Giveth's token. It is distributed as a reward to donors and project supporters.":
      'GIV — токен Giveth. Його розподіляють як винагороду донорам і прихильникам проєктів.',
    'Giveth donations': 'Пожертви Giveth',
    'Eco-credit sales (INAT)': 'Продаж еко-кредитів (INAT)',
    'Eco-credits are tradable certificates for a measured environmental result. Buyers pay in USDC and every sale is recorded on the Celo blockchain. The money goes to the projects.':
      'Еко-кредити — це сертифікати на виміряний екологічний результат, якими можна торгувати. Покупці платять у USDC, а кожен продаж записується в блокчейн Celo. Гроші йдуть проєктам.',
    'Karma grants tracker': 'Трекер грантів Karma',
    '{n} credits': ['{n} кредит', '{n} кредити', '{n} кредитів'],
    'no sales': 'продажів немає',
    'View on Karma →': 'Відкрити в Karma →',
    '{n} projects': ['{n} проєкт', '{n} проєкти', '{n} проєктів'],
    '{n} updates': ['{n} оновлення', '{n} оновлення', '{n} оновлень'],
    'View all {n} projects on Karma →': 'Усі проєкти ({n}) на Karma →',
    'GEN Ukraine MicroGrant Program': 'Програма мікрогрантів GEN Ukraine',
    'GEN Ukraine Community': 'Спільнота GEN Ukraine',
    'Localism + microgrants — community projects tracker': 'Локалізм і мікрогранти — трекер проєктів громад',

    // Bird monitoring
    'Bird Monitoring': 'Моніторинг птахів',
    'Listening stations record birdsong around the clock and identify species automatically. Figures are for the last 30 days.':
      'Станції-«слухачі» цілодобово записують спів птахів і автоматично визначають види. Цифри — за останні 30 днів.',
    'Stations': 'Станції',
    'Detections': 'Розпізнавання',
    'Species heard': 'Почуто видів',
    'BirdWeather is a network of listening stations: a microphone and AI recognise bird species from sound. A detection is one identified bird call.':
      'BirdWeather — мережа станцій-«слухачів»: мікрофон і штучний інтелект розпізнають види птахів за звуком. Розпізнавання — це один упізнаний пташиний голос.',
    '{n} detections': ['{n} розпізнавання', '{n} розпізнавання', '{n} розпізнавань'],
    '{n} species': ['{n} вид', '{n} види', '{n} видів'],
    'Last heard {when}': 'Остання активність: {when}',
    'approximate location': 'орієнтовне розташування',
    'Station online': 'Станція працює',
    'Station offline': 'Станція не на зв’язку',
    'Bird Stations': 'Станції птахів',
    'View on BirdWeather →': 'Відкрити в BirdWeather →',
    'Supii Lake': 'Озеро Супій', 'Trokhy Dali': 'Трохи Далі', 'Chornobyl Wildlife 2': 'Чорнобильська дика природа 2',

    // Map
    'Layers': 'Шари',
    'Communities': 'Громади',
    'Solar Stations': 'Сонячні станції',
    'Rainwater Harvesting': 'Збір дощової води',
    'Silvi Forestry': 'Лісівництво Silvi',
    'Family Estate': 'Родинний маєток',
    'Eco-settlement': 'Екопоселення',
    'Eco-community': 'Екогромада',
    'Spiritual Community': 'Духовна громада',
    'Various Communities': 'Різні громади',

    // Footer / status
    'Data sourced from': 'Джерела даних',
    'Open source on GitHub': 'Відкритий код на GitHub',
    'Source code on GitHub': 'Код на GitHub',
    'Live: {when}': 'Оновлено: {when}',
    'Demo — mock data': 'Демо — тестові дані',
    'Demo version — mock data · Ukraine Ecovillage © 2026': 'Демо-версія — тестові дані · Екоселища України © 2026',
    'Demo version — mock data · GEN Ukraine © 2026': 'Демо-версія — тестові дані · GEN Ukraine © 2026',
    'Live blockchain data · GEN Ukraine © {year}': 'Дані з блокчейну в реальному часі · GEN Ukraine © {year}',
    'Ukraine Ecovillage Impact Dashboard': 'Панель впливу екоселищ України',

    // Names (settlements, stations, projects, pools)
    'Drago': 'Драго', 'Kazkove': 'Казкове', 'Tepla Gora': 'Тепла Гора', 'Zhyvyi Dim': 'Живий Дім',
    'Happy People': 'Щасливі люди', 'SV Samara': 'СВ Самара',
    'Omelyanivka': 'Омелянівка', 'Living Home': 'Живий Дім', 'Svitanok': 'Світанок', 'Charivne': 'Чарівне',
    'Etnokod': 'Етнокод', 'Velyka Rodyna': 'Велика Родина', 'Prostir Lyubovi': 'Простір Любові',
    'Tepla Hora': 'Тепла Гора', 'MaistryMy': 'МайстриМи', 'Radaria': 'Радарія',
    'Sunrise Ecovillage': 'Екоселище «Світанок»', 'Ohra Workshop': 'Майстерня «Охра»', 'New Mayapur': 'Нова Маяпур',
    'Potoky': 'Потоки', 'Pokuttya School': 'Школа «Покуття»', 'Veloselo': 'Велосело',
    'Lubodarove EcoHub': 'Екохаб «Любодарове»', 'Veseli Kurkuli': 'Веселі Куркулі', 'Bushanska Toloka': 'Бушанська Толока',
    'Rodniki': 'Родники', 'Space of Love': 'Простір Любові', 'Eco-center School Life': 'Екоцентр «Школа Життя»',
    'Verkhniy Byshkin': 'Верхній Бишкін', 'Living Home (Dudkivka)': 'Живий Дім (Дудківка)',
    'Hora Lyskivka': 'Гора Лисківка', 'Lagulske (Zhytomyr)': 'Лагульське (Житомир)', 'Yemelyanivka': 'Ємельянівка',
    'Toloka Regeneration': 'Відновлення «Толока»', 'Solar Support Pool': 'Фонд підтримки сонячної енергії',
    'GEN Fund MicroGrants Pool': 'Фонд мікрогрантів GEN', 'GEN Activities': 'Активності GEN',
    'solar / energy': 'сонце / енергія', 'microgrants': 'мікрогранти', 'community': 'громада',

    // Sarafu report tags
    'Ecovillage': 'Екоселище', 'Volunteer': 'Волонтерство', 'Common Spaces': 'Спільні простори', 'Construction': 'Будівництво',
    'Cleaning': 'Прибирання', 'Gathering': 'Зустрічі', 'Permaculture': 'Пермакультура', 'Youth': 'Молодь', 'Care': 'Догляд',
    'House building': 'Будівництво житла', 'Tree Planting': 'Висадка дерев', 'Housekeeping': 'Господарство',
    'Regenerative Agriculture': 'Регенеративне землеробство', 'Collaboration': 'Співпраця', 'Biodiversity': 'Біорізноманіття',
    'Culture': 'Культура', 'Handcrafts': 'Рукоділля', 'Education': 'Освіта', 'Soil Health': 'Здоров’я ґрунту',
    'Water Catchment': 'Збір води', 'Art': 'Мистецтво', 'Food Processing': 'Переробка їжі', 'Food production': 'Виробництво їжі',
    'Plant Nursery': 'Розсадник', 'Outreach': 'Комунікація', 'Training': 'Навчання', 'Festivals': 'Фестивалі',
    'Sociocracy': 'Соціократія', 'Software': 'Програмне забезпечення', 'Mobility': 'Мобільність',
    'Rehabilitation': 'Реабілітація', 'Fellowship': 'Спільнота', 'Natural building': 'Натуральне будівництво',
    'Celebration': 'Святкування', 'Elders': 'Старші',

    // Map popups: solar stations
    'Kedravushka / Ladoslavne': 'Кедрівушка / Ладославне', 'Radaria Ecocentre': 'Екоцентр «Радарія»', 'Ozarinnya': 'Озаріння',
    'Svitanok / Rassvet-Samara': 'Світанок / Самара', 'Pokuttya Waldorf School': 'Покутська вальдорфська школа',
    '5×450W panels, 6kW inverter, 5kW battery': 'Панелі 5×450 Вт, інвертор 6 кВт, акумулятор 5 кВт·год',
    '5×580W panels, 6kW inverter, 5kW battery': 'Панелі 5×580 Вт, інвертор 6 кВт, акумулятор 5 кВт·год',
    '4×450W panels, 3kW inverter, 5kW battery': 'Панелі 4×450 Вт, інвертор 3 кВт, акумулятор 5 кВт·год',
    '7×450W panels, 6.2kW inverter, 15kW battery': 'Панелі 7×450 Вт, інвертор 6,2 кВт, акумулятор 15 кВт·год',
    '5×450W panels, 10kW inverter, 5kW battery': 'Панелі 5×450 Вт, інвертор 10 кВт, акумулятор 5 кВт·год',
    // Map popups: rainwater systems
    'Jyvyi Dim': 'Живий Дім', 'Svitanok-Samara': 'Світанок-Самара', 'Bezvodne (Bhumi)': 'Безводне (Бгумі)', 'Goloka': 'Голока',
    'Bhumi': 'Бгумі', 'Charivne Lake Systems': 'Системи озер Чарівного',
    '1,000L rainwater system, expandable to 2,000L': 'Система збору дощової води на 1 000 л, можна розширити до 2 000 л',
    'Well for conifer trees and garden': 'Криниця для хвойних дерев і саду',
    'Well + 1,000L rainwater system, lake recharging, swales': 'Криниця + система дощової води на 1 000 л, поповнення озера, свейли',
    'Water well + 10kW generator, ~9,600L/day for 120 cows': 'Водна свердловина + генератор 10 кВт, ~9 600 л/добу для 120 корів',
    '4×IBC tanks (4,000L), rooftop catchment, drip irrigation': '4 ємності IBC (4 000 л), збір води з даху, крапельне зрошення',
    '4,000L tank + gutter system from educational building': 'Бак на 4 000 л + ринви від навчального корпусу',
    '9×1,000L tanks, UV + reverse osmosis + mineralization': '9 баків по 1 000 л, УФ + зворотний осмос + мінералізація',
    'Roof-to-tank from 2 buildings, 40,000+L captured in 2025': 'Збір з дахів 2 будівель у баки, 40 000+ л зібрано у 2025 році',
    'Cascading lake & dam system, biodiversity restoration': 'Каскад озер і гребель, відновлення біорізноманіття',
  };

  // English singular forms for the strings that carry a count ([one, other])
  const EN_PLURAL = {
    '{n} updates': ['{n} update', '{n} updates'],
    '{n} projects': ['{n} project', '{n} projects'],
    '{n} reports': ['{n} report', '{n} reports'],
    '{n} credits': ['{n} credit', '{n} credits'],
    '{n} users': ['{n} user', '{n} users'],
    '{n} wells': ['{n} well', '{n} wells'],
    '{n} detections': ['{n} detection', '{n} detections'],
    '{n} species': ['{n} species', '{n} species'],
    '{n} water systems': ['{n} water system', '{n} water systems'],
    '{n} ecovillages': ['{n} ecovillage', '{n} ecovillages'],
  };

  // Complex static paragraphs (contain inline tags): key = data-i18n-html attribute
  const UK_HTML = {
    'intro-text': 'Тут видно, що екоселища <b>виробляють і відновлюють</b> (сонячна енергія, ліси, вода), як вони <b>торгують і допомагають одне одному</b> на місцях і яке <b>фінансування</b> залучили. Цифри беруться з публічних блокчейнів і платформ, тому їх може перевірити будь-хто; блоки, де ще показано приклади даних, позначені у футері.',
    'intro-key': '<span class="hint hint-static">i</span> наведіть або торкніться, щоб побачити пояснення &nbsp;·&nbsp; <span class="card-badge badge-arkreen">Мітка</span> — звідки дані',
  };

  // Silvi project descriptions come from the sheet in Ukrainian → English for the EN UI
  const EN_FROM_UK = {
    'Мережева ініціатива з регенерації лісостепу. Кількість дерев не вказана': 'A network initiative to regenerate the forest-steppe. Number of trees not stated',
    'Створення лісосмуги. Види й кількість дерев не вказані': 'Creating a windbreak. Species and number of trees not stated',
    'Моніторинг біорізноманіття в Омелянівці': 'Biodiversity monitoring in Omelyanivka',
    'За описом проєкту, у Дудківці висадили понад 500 дерев за 5 років': 'According to the project description, over 500 trees were planted in Dudkivka over 5 years',
    'Розсадник дерев і кущів. Кількість і перелік видів не вказані': 'A nursery for trees and shrubs. Number and species not stated',
    'Кількість і види не вказані': 'Number and species not stated',
    'Дендропарк поповнюють новими деревами. Кількість і види не вказані': 'The arboretum is being topped up with new trees. Number and species not stated',
    'Лісосмуги й зелені насадження. Кількість і види не вказані': 'Forest belts and green plantings. Number and species not stated',
    'Біля Веселої Слобідки заплановано 650 дерев — 350 лип і 300 сосен': 'Near Vesela Slobidka, 650 trees are planned: 350 lindens and 300 pines',
    'Плодові й хвойні дерева. Кількість і точні види не вказані': 'Fruit and coniferous trees. Number and exact species not stated',
    'В описі згадані яблуневий сад, дерева, ліани, трави й кущі. Кількість не вказана': 'The description mentions an apple orchard, trees, vines, herbs and shrubs. Number not stated',
  };

  // ---- language detection ----
  function detect() {
    try {
      const q = new URLSearchParams(location.search).get('lang');
      if (q === 'uk' || q === 'en') { localStorage.setItem('gen-lang', q); return q; }
    } catch { /* ignore */ }
    try {
      const s = localStorage.getItem('gen-lang');
      if (s === 'uk' || s === 'en') return s;
    } catch { /* ignore */ }
    const nav = (navigator.language || 'en').toLowerCase();
    return nav.startsWith('uk') ? 'uk' : 'en';
  }

  const LANG = detect();
  window.LANG = LANG;
  window.LOCALE = LANG === 'uk' ? 'uk-UA' : 'en-US';

  // Ukrainian plural form index: 0 = one (1, 21…), 1 = few (2–4, 22–24…), 2 = many
  function pluralIndex(n) {
    if (!Number.isInteger(n)) return 2;
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return 0;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 1;
    return 2;
  }

  // T('English text', {vars}) → translated text with {placeholders} filled in
  window.T = function (text, vars) {
    let v = text;
    if (LANG === 'uk' && UK[text] !== undefined) v = UK[text];
    else if (LANG === 'en' && EN_FROM_UK[text] !== undefined) v = EN_FROM_UK[text];
    else if (LANG === 'en' && EN_PLURAL[text] && vars) v = EN_PLURAL[text][Number(vars.n) === 1 ? 0 : 1];
    if (Array.isArray(v)) v = v[pluralIndex(vars && Number(vars.n))];
    return vars ? v.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m)) : v;
  };

  window.setLang = function (lang) {
    try { localStorage.setItem('gen-lang', lang); } catch { /* ignore */ }
    const url = new URL(location.href);
    url.searchParams.delete('lang');
    location.href = url.toString();
  };

  // ---- translate static HTML in place (Ukrainian only; English is the markup itself) ----
  function applyStatic() {
    document.documentElement.lang = LANG;
    const switchEl = document.getElementById('lang-switch');
    if (switchEl) {
      switchEl.querySelectorAll('button[data-lang]').forEach(b => {
        const on = b.dataset.lang === LANG;
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.classList.toggle('lang-on', on);
      });
    }
    if (LANG !== 'uk') return;

    document.title = UK['Ukraine Ecovillage Impact Dashboard'];

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const html = UK_HTML[el.getAttribute('data-i18n-html')];
      if (html) el.innerHTML = html;
    });

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => {
        const p = n.parentElement;
        if (!p || /^(SCRIPT|STYLE|CANVAS)$/.test(p.tagName)) return NodeFilter.FILTER_REJECT;
        if (p.closest('[data-i18n-html]') || p.closest('#lang-switch')) return NodeFilter.FILTER_REJECT;
        return n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
      const raw = n.nodeValue;
      const key = raw.trim();
      if (UK[key] !== undefined && typeof UK[key] === 'string') {
        n.nodeValue = raw.replace(key, UK[key]);
      }
    });

    document.querySelectorAll('[data-tip], [title], [aria-label]').forEach(el => {
      ['data-tip', 'title', 'aria-label'].forEach(attr => {
        const v = el.getAttribute(attr);
        if (v && typeof UK[v] === 'string') el.setAttribute(attr, UK[v]);
      });
    });
  }

  applyStatic();
})();
