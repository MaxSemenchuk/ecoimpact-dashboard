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
    'Ukraine Ecovillage': 'Екопоселення України',
    'Impact Dashboard': 'Панель впливу',
    'Global Ecovillage Network — Ukraine': 'Глобальна мережа екопоселень — Україна',
    'Loading...': 'Завантаження…',
    'A network of ecovillages across Ukraine, tracked in the open.': 'Мережа екопоселень України, дані якої відкриті для всіх.',
    'Badge': 'Мітка',
    'What is this?': 'Що це?',

    // Cards
    'Solar Energy': 'Сонячна енергія',
    'Restoring Nature': 'Відновлення природи',
    'Local Economy': 'Місцева економіка',
    'Funding': 'Фінансування',
    'Where We Are': 'Де ми є',

    'Solar panels at ecovillages are connected to Arkreen, which records every kilowatt-hour they generate and rewards it with tokens.':
      'Сонячні панелі екопоселень підключені до Arkreen: платформа фіксує кожну згенеровану кіловат-годину та винагороджує її токенами.',
    'Projects that plant trees and restore land and water, recorded on independent platforms so the results can be verified.':
      'Проєкти, що садять дерева та відновлюють землю й воду. Результати фіксуються на незалежних платформах, тож їх можна перевірити.',
    'Each village issues its own digital voucher on Sarafu — a local currency for shared work and mutual help — and logs what it does as activity reports.':
      'Кожне поселення випускає на Sarafu власний цифровий ваучер — місцеву валюту для спільної роботи та взаємодопомоги — і веде звіти про свою діяльність.',
    'Donations, grants and eco-credit sales that support the network. Giveth is a donation platform for public-good projects; Karma tracks community grants and milestones.':
      'Пожертви, гранти та продаж еко-кредитів, що підтримують мережу. Giveth — платформа пожертв для проєктів суспільного блага; Karma відстежує гранти громад і досягнення.',
    'Ecovillages, solar stations, rainwater systems and tree-planting projects across Ukraine. Use the layer toggles next to the map to show or hide each type.':
      'Екопоселення, сонячні станції, системи збору дощової води та проєкти висадки дерев по всій Україні. Перемикачі шарів біля карти дозволяють показати або сховати кожен тип.',

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
    'Silvi is a tree-tracking platform. Only projects that Silvi has reviewed and approved are shown.':
      'Silvi — платформа обліку дерев. Показано лише проєкти, які Silvi перевірила й підтвердила.',
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
    '{n} ecovillages': ['{n} екопоселення', '{n} екопоселення', '{n} екопоселень'],
    'ecosystem restoration': 'відновлення екосистем',
    'water infrastructure': 'водна інфраструктура',
    'Ecovillage Network GEN Ukraine': 'Мережа екопоселень GEN Ukraine',
    'Water Save System for Ecovillages': 'Система збереження води для екопоселень',
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
    'Communities': 'Екопоселення',
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
    'Demo version — mock data · Ukraine Ecovillage © 2026': 'Демо-версія — тестові дані · Екопоселення України © 2026',
    'Demo version — mock data · GEN Ukraine © 2026': 'Демо-версія — тестові дані · GEN Ukraine © 2026',
    'Live blockchain data · GEN Ukraine © {year}': 'Дані з блокчейну в реальному часі · GEN Ukraine © {year}',
    'Ukraine Ecovillage Impact Dashboard': 'Панель впливу екопоселень України',

    // Names (settlements, stations, projects, pools)
    'Drago': 'Драго', 'Kazkove': 'Казкове', 'Tepla Gora': 'Тепла Гора', 'Zhyvyi Dim': 'Живий Дім',
    'Happy People': 'Щасливі люди', 'SV Samara': 'СВ Самара',
    'Omelyanivka': 'Омелянівка', 'Living Home': 'Живий Дім', 'Svitanok': 'Світанок', 'Charivne': 'Чарівне',
    'Etnokod': 'Етнокод', 'Velyka Rodyna': 'Велика Родина', 'Prostir Lyubovi': 'Простір Любові',
    'Tepla Hora': 'Тепла Гора', 'MaistryMy': 'МайстриМи', 'Radaria': 'Радарія',
    'Sunrise Ecovillage': 'Екопоселення «Світанок»', 'Ohra Workshop': 'Майстерня «Охра»', 'New Mayapur': 'Нова Маяпур',
    'Potoky': 'Потоки', 'Pokuttya School': 'Школа «Покуття»', 'Veloselo': 'Велосело',
    'Lubodarove EcoHub': 'Екохаб «Любодарове»', 'Veseli Kurkuli': 'Веселі Куркулі', 'Bushanska Toloka': 'Бушанська Толока',
    'Rodniki': 'Родники', 'Space of Love': 'Простір Любові', 'Eco-center School Life': 'Екоцентр «Школа Життя»',
    'Verkhniy Byshkin': 'Верхній Бишкін', 'Living Home (Dudkivka)': 'Живий Дім (Дудківка)',
    'Hora Lyskivka': 'Гора Лисківка', 'Lagulske (Zhytomyr)': 'Лагульське (Житомир)', 'Yemelyanivka': 'Ємельянівка',
    'Toloka Regeneration': 'Відновлення «Толока»', 'Solar Support Pool': 'Фонд підтримки сонячної енергії',
    'GEN Fund MicroGrants Pool': 'Фонд мікрогрантів GEN', 'GEN Activities': 'Активності GEN',
    'solar / energy': 'сонце / енергія', 'microgrants': 'мікрогранти', 'community': 'громада',

    // Sarafu report tags
    'Ecovillage': 'Екопоселення', 'Volunteer': 'Волонтерство', 'Common Spaces': 'Спільні простори', 'Construction': 'Будівництво',
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

    // Places (location registry) and hromadas
    'Places': 'Локації',
    'One card per place, joining what Silvi, Arkreen, Sarafu, INAT, BirdWeather and the network maps know about it. The same ecovillage often has a different name on each platform; here they are merged into one. Matches marked ⚠ were made by a similar name or a nearby point and still need confirming.':
      'Одна картка на одне місце: тут зібрано все, що про нього знають Silvi, Arkreen, Sarafu, INAT, BirdWeather і мапи мережі. Те саме екопоселення часто має різні назви на різних платформах, тут вони об\'єднані. Збіги з позначкою ⚠ зроблено за схожою назвою або близькою точкою, їх ще треба підтвердити.',
    'Hromadas': 'Громади',
    'KSE · strategies': 'KSE · стратегії',
    'Which territorial communities (hromadas) our places are in, and what is already measured there. Click a hromada to see it on the map. Boundaries and population: KSE Loc Data Hub.':
      'У яких громадах розташовані наші локації і що там уже вимірюється. Натисніть на громаду, щоб побачити її на карті. Межі та населення: KSE Loc Data Hub.',
    'Where we could grow': 'Де можна розширитися',
    'Hromadas whose development strategy has a concrete, measurable eco goal that fits nature or carbon credits and digital monitoring. Picked from 395 parsed strategies (out of 1,463 hromadas), so the list is not complete. On the map they are filled with the colour of their group.':
      'Громади, у стратегії розвитку яких є конкретна вимірювана екоціль, під яку підходять природні чи вуглецеві кредити або цифровий моніторинг. Відібрано з 395 розпарсених стратегій (з 1 463 громад), тож список неповний. На карті вони зафарбовані кольором своєї групи.',
    'Ecovillages, solar stations, rainwater systems, tree-planting projects and hromadas across Ukraine. Use the layer toggles next to the map to show or hide each type.':
      'Екопоселення, сонячні станції, системи збору дощової води, проєкти висадки дерев і громади по всій Україні. Перемикачі шарів біля карти дозволяють показати або сховати кожен тип.',
    'Hromadas with our places': 'Громади з нашими локаціями',
    'Hromadas with eco goals': 'Громади з екоцілями',
    'All': 'Усі',
    'Trees': 'Дерева',
    'Solar energy': 'Сонячна енергія',
    'Local economy': 'Місцева економіка',
    'Eco-credits': 'Екокредити',
    'Water': 'Вода',
    'Birds': 'Птахи',
    'Solar': 'Сонце',
    '{n} trees': ['{n} дерево', '{n} дерева', '{n} дерев'],
    'no coordinates yet': 'координат ще немає',
    'outside hromada boundaries': 'поза межами громад',
    'Show on map': 'Показати на карті',
    'Listed on a platform; no numbers yet': 'Є на платформі, цифр поки немає',
    'Nothing matches this filter': 'За цим фільтром нічого немає',
    'Places in the registry': 'Локацій у реєстрі',
    'Every place that appears on at least one platform or on the network maps, merged by name and position.':
      'Усі місця, що є хоча б на одній платформі або на мапах мережі, об\'єднані за назвою і координатами.',
    'Seen on 2+ platforms': 'Є на 2+ платформах',
    'Places whose data could be joined across platforms, for example Silvi trees and Sarafu reports for the same ecovillage.':
      'Локації, дані яких вдалося зв\'язати між платформами, наприклад дерева в Silvi і звіти в Sarafu для того самого екопоселення.',
    'Territorial communities (municipalities) the places with coordinates fall into.': 'Територіальні громади, у межах яких лежать локації з координатами.',
    'No coordinates / to confirm': 'Без координат / перевірити',
    'Places with no position yet, and matches made only by a similar name or a nearby point.':
      'Локації без координат і збіги, зроблені лише за схожою назвою або близькою точкою.',
    'Hromada': 'Громада',
    'Population': 'Населення',
    'Ecovillages': 'Екопоселення',
    'Our places': 'Наші локації',
    'Hromadas where the network already has something, from the most complete down to the ones proposed for growth. Eco goals come from hromada development strategies: picked from 395 parsed strategies (out of 1,463 hromadas), so the list is not complete.':
      'Громади, де мережа вже щось має: від найповніших до запропонованих для розширення. Екоцілі взято зі стратегій розвитку громад: відібрано з 395 розпарсених стратегій (з 1 463 громад), тож список неповний.',
    'Where the network works': 'Де працює мережа',
    'Our places with data on the platforms': 'Наші локації з даними на платформах',
    'Ecovillages on the community map': 'Екопоселення з мапи спільноти',
    'No platform data yet': 'Даних на платформах поки немає',
    'Eco goals in the hromada strategy, none of our places yet': 'Екоціль у стратегії громади, наших місць там ще немає',
    'Show all {n}': 'Показати всі {n}',
    'Only ecovillages from the community map': 'Лише екопоселення з мапи спільноти',
    'Eco goal in the strategy': 'Екоціль у стратегії',
    'Dashed outline: no places of ours there yet.': 'Пунктирний контур: наших місць там ще немає.',
    'Reports': 'Звіти',
    'Credits, $': 'Кредити, $',
    'credits': 'кредити',
    'Has an eco goal in its strategy': 'У стратегії є екоціль',
    'Show only hromadas with platform data': 'Показати лише громади з даними платформ',
    'Show {n} more hromadas with ecovillages from the community map': ['Показати ще {n} громаду з екопоселеннями з мапи спільноти', 'Показати ще {n} громади з екопоселеннями з мапи спільноти', 'Показати ще {n} громад з екопоселеннями з мапи спільноти'],
    'already here': 'вже тут',
    'Places where the network has data on at least one platform: trees, solar energy, water, birds, eco-credits or community activity. A bigger pin means more platforms. Click a pin to see its numbers next to the map.':
      'Місця, де мережа має дані хоча б на одній платформі: дерева, сонячна енергія, вода, птахи, екокредити чи активність спільноти. Що більший пін, то більше платформ. Натисніть на пін, і поруч з мапою з’являться його цифри.',
    'One card per place, joining what Silvi, Arkreen, Sarafu, INAT, BirdWeather and the community map know about it. Click a card for everything about the place, with a map. Matches marked ⚠ were made by a similar name or a nearby point and still need confirming.':
      'Одна картка на одне місце: усе, що про нього знають Silvi, Arkreen, Sarafu, INAT, BirdWeather і мапа спільноти. Натисніть на картку, щоб побачити все про місце разом із картою. Збіги з позначкою ⚠ зроблено за схожою назвою або близькою точкою, їх ще треба підтвердити.',
    'Hromadas whose development strategy has a concrete, measurable eco goal that fits nature or carbon credits and digital monitoring. Picked from 395 parsed strategies (out of 1,463 hromadas), so the list is not complete.':
      'Громади, у стратегії розвитку яких є конкретна вимірювана екоціль, під яку підходять природні чи вуглецеві кредити або цифровий моніторинг. Відібрано з 395 розпарсених стратегій (з 1 463 громад), тож список неповний.',
    'Match to confirm': 'Збіг треба підтвердити',
    'Open {name}': 'Відкрити: {name}',
    'Details': 'Детальніше',
    'Click a pin on the map to see what the network knows about that place.': 'Натисніть на пін на мапі, щоб побачити, що мережа знає про це місце.',
    '{n} places on the map': ['{n} місце на мапі', '{n} місця на мапі', '{n} місць на мапі'],
    'Full card with map and sources': 'Повна картка з мапою і джерелами',
    'Also here': 'Також тут',
    'What is measured here': 'Що тут вимірюється',
    'Community map': 'Мапа спільноти',
    'Sources': 'Джерела',
    'Close': 'Закрити',
    'No coordinates yet. Ask the network coordinator where this place is.': 'Координат ще немає. Уточніть у координатора мережі, де це місце.',
    '{n} plots taken': ['{n} ділянка зайнята', '{n} ділянки зайняті', '{n} ділянок зайнято'],
    '{n} free': ['{n} вільна', '{n} вільні', '{n} вільних'],
    '{n} families all year': ['{n} сім\'я живе цілий рік', '{n} сім\'ї живуть цілий рік', '{n} сімей живуть цілий рік'],
    '{n} children': ['{n} дитина', '{n} дитини', '{n} дітей'],
    'since {y}': 'з {y} року',
    'On the community map →': 'На мапі спільноти →',
    'Ecovillages from the community map': 'Екопоселення з мапи спільноти',
    'Dashboard': 'Дашборд',
    'Sections': 'Розділи',
    'Hromada strategies': 'Стратегії громад',
    'Places on the map': 'Локації на карті',
    'Click a hromada to see what the network has there.': 'Натисніть на громаду, щоб побачити, що там є в мережі.',
    'Hromadas (territorial communities) where the network has places, and hromadas whose strategies have eco goals we could support. Click a hromada to see everything the network has there.':
      'Громади, де є локації мережі, і громади, у стратегіях яких є екоцілі, які ми могли б підтримати. Натисніть на громаду, щоб побачити все, що там є в мережі.',
    'Places where the network has something on a platform: solar stations, rainwater systems, tree-planting projects, bird stations and community vouchers. The full community map (pomistya.club) is an extra layer, off by default.':
      'Місця, де мережа має щось на платформах: сонячні станції, системи збору дощової води, посадки дерев, станції птахів і ваучери спільнот. Повна мапа спільноти (pomistya.club) — додатковий шар, за замовчуванням вимкнений.',
    'Show fewer': 'Згорнути',
    'Show all {n} places': ['Показати всі {n} локацію', 'Показати всі {n} локації', 'Показати всі {n} локацій'],
    '{n} people': ['{n} мешканець', '{n} мешканці', '{n} мешканців'],
    // Registry notes (data/locations.json "unsure")
    'Sarafu «Svitanok» could also be Світанок in Rivne region': 'Sarafu «Svitanok» може бути й Світанком на Рівненщині',
    'Sarafu «MaistryMy» matched by name': 'Sarafu «MaistryMy» зіставлено за назвою',
    'Silvi 74 (forest belts) sits 200 m from the nursery, so both are treated as one place': 'Silvi 74 (лісосмуги) за 200 м від розсадника, тому це одна локація',
    'The rainwater point is 30 km from the pomistya.club point; matched by name': 'Точка системи дощової води за 30 км від точки на pomistya.club; зіставлено за назвою',
    'Silvi 91 (Maze Garden) is 0.8 km from Потоки': 'Silvi 91 (Казковий сад) за 0,8 км від Потоків',
    '6 km from Казкове; may be the same community': 'За 6 км від Казкового; можливо, та сама спільнота',
    'Sarafu «Sunrise Ecovillage» matched by name (Світанок = sunrise)': 'Sarafu «Sunrise Ecovillage» зіставлено за назвою (Sunrise = Світанок)',
    '1.7 km from Зелені кручі; may be the same place': 'За 1,7 км від Зелених круч; можливо, те саме місце',
    'Approximate station position': 'Приблизне розташування станції',
    'No coordinates or matching name in other sources': 'Немає координат і схожої назви в інших джерелах',
    'No coordinates': 'Немає координат',
  };

  // English singular forms for the strings that carry a count ([one, other])
  const EN_PLURAL = {
    '{n} places on the map': ['{n} place on the map', '{n} places on the map'],
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
    '{n} trees': ['{n} tree', '{n} trees'],
    '{n} people': ['{n} person', '{n} people'],
    '{n} plots taken': ['{n} plot taken', '{n} plots taken'],
    '{n} families all year': ['{n} family all year', '{n} families all year'],
    '{n} children': ['{n} child', '{n} children'],
    'Show {n} more hromadas with ecovillages from the community map': ['Show {n} more hromada with ecovillages from the community map', 'Show {n} more hromadas with ecovillages from the community map'],
  };

  // Complex static paragraphs (contain inline tags): key = data-i18n-html attribute
  const UK_HTML = {
    'intro-text': 'Тут видно, що екопоселення <b>виробляють і відновлюють</b> (сонячна енергія, ліси, вода), як вони <b>торгують і допомагають одне одному</b> на місцях і яке <b>фінансування</b> залучили. Цифри беруться з публічних блокчейнів і платформ, тому їх може перевірити будь-хто; блоки, де ще показано приклади даних, позначені у футері.',
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
