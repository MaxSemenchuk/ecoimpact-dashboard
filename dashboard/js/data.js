// ============================================================
// GEN Ukraine Impact Dashboard — Mock Data
// Replace with real API calls when ready
// ============================================================

const MOCK_DATA = {

  // --- Summary Bar ---
  summary: {
    ecovillages: 90,
    participants: 512,
    treesPlanted: 42000,
    co2Sequestered: 1320,
  },

  // --- Energy Block (source: Arkreen) ---
  energy: {
    totalMWh: 212,
    solarNodes: 15,
    akreTokens: 12500,
    // Monthly production last 12 months (MWh)
    monthlyProduction: [
      { month: '2025-04', value: 8.2 },
      { month: '2025-05', value: 12.5 },
      { month: '2025-06', value: 18.7 },
      { month: '2025-07', value: 22.3 },
      { month: '2025-08', value: 24.1 },
      { month: '2025-09', value: 19.8 },
      { month: '2025-10', value: 14.2 },
      { month: '2025-11', value: 9.6 },
      { month: '2025-12', value: 6.1 },
      { month: '2026-01', value: 5.8 },
      { month: '2026-02', value: 8.9 },
      { month: '2026-03', value: 11.4 },
    ],
    // Solar nodes by location
    nodes: [
      { name: 'Казкове', wallet: '0x1a2b...3c4d', mwh: 38.2, tokens: 2150 },
      { name: 'Бешкіна', wallet: '0x5e6f...7g8h', mwh: 29.7, tokens: 1680 },
      { name: 'Зелений Гай', wallet: '0x9i0j...1k2l', mwh: 22.4, tokens: 1260 },
      { name: 'Сонячне', wallet: '0x3m4n...5o6p', mwh: 19.8, tokens: 1120 },
      { name: 'Щасливе', wallet: '0x7q8r...9s0t', mwh: 18.1, tokens: 1020 },
      { name: 'Еко-Дім', wallet: '0xab12...cd34', mwh: 16.5, tokens: 930 },
      { name: 'Лісова Поляна', wallet: '0xef56...gh78', mwh: 14.3, tokens: 810 },
      { name: 'Карпатське', wallet: '0xij90...kl12', mwh: 12.7, tokens: 720 },
      { name: 'Дніпрове', wallet: '0xmn34...op56', mwh: 11.2, tokens: 630 },
      { name: 'Рідне', wallet: '0xqr78...st90', mwh: 9.8, tokens: 550 },
      { name: 'Вільне', wallet: '0xuv12...wx34', mwh: 7.4, tokens: 420 },
      { name: 'Нове Життя', wallet: '0xyz56...ab78', mwh: 5.2, tokens: 290 },
      { name: 'Первоцвіт', wallet: '0xcd90...ef12', mwh: 3.1, tokens: 520 },
      { name: 'Берегиня', wallet: '0xgh34...ij56', mwh: 1.8, tokens: 260 },
      { name: 'Джерело', wallet: '0xkl78...mn90', mwh: 1.8, tokens: 140 },
    ],
  },

  // --- Ecology Block (source: Silvi — tree tracking; list from the "Sarafu Arkreen" Google Sheet, Silvi tab) ---
  ecology: {
    biodiversityProjects: 11, // Silvi projects shown (approved + drafts with data); live value comes from silvi.json
    treesPlanted: null, // Silvi does not report tree counts for these projects
    habitatRestored: 2847, // hectares (sum of Silvi projects)
    projects: [
      { name: "Establishment of a windbreak", platform: 'Silvi', trees: null, hectares: 0.11 },
      { name: "Biodiversity Monitoring in the Yemelyanivka Family Homestead Settlement", platform: 'Silvi', trees: null, hectares: 524.84 },
      { name: "Jivoy Dom", platform: 'Silvi', trees: null, hectares: 0.56 },
      { name: "Family Forest Nursery \"Yasna Roslynka\"", platform: 'Silvi', trees: null, hectares: 0.56 },
      { name: "Happy people of Ukraine", platform: 'Silvi', trees: null, hectares: 2195.4 },
      { name: "Lagulsky Arboretum", platform: 'Silvi', trees: null, hectares: 7.36 },
      { name: "Planting of forest belts and green spaces", platform: 'Silvi', trees: null, hectares: 1.22 },
      { name: "Local reforestation project in Kyiv region, Ukraine", platform: 'Silvi', trees: null, hectares: 110.64 },
      { name: "Jiviy Dim Zaporozhye", platform: 'Silvi', trees: null, hectares: 0.09 },
      { name: "Great Gomilsha Trees", platform: 'Silvi', trees: null, hectares: 0.51 },
      { name: "The Maze Garden or \"Fairy-Tale Garden\"", platform: 'Silvi', trees: null, hectares: 5.43 },
    ],
  },

  // --- Silvi Forestry Projects (detailed) ---
  // lat/lng are null until coordinates are provided — projects without them are not drawn on the map.
  silviProjects: [
    { id: 44, name: "Establishment of a windbreak", desc: "Створення лісосмуги. Види й кількість дерев не вказані", status: "Approved", lat: null, lng: null, hectares: 0.11, zones: 1, updated: "2026-03" },
    { id: 49, name: "Biodiversity Monitoring in the Yemelyanivka Family Homestead Settlement", desc: "Моніторинг біорізноманіття в Омелянівці", status: "Approved", lat: null, lng: null, hectares: 524.84, zones: 1, updated: "2026-03" },
    { id: 52, name: "Jivoy Dom", desc: "За описом проєкту, у Дудківці висадили понад 500 дерев за 5 років", status: "Approved", lat: null, lng: null, hectares: 0.56, zones: 1, updated: "2026-03" },
    { id: 56, name: "Family Forest Nursery \"Yasna Roslynka\"", desc: "Розсадник дерев і кущів. Кількість і перелік видів не вказані", status: "Approved", lat: null, lng: null, hectares: 0.56, zones: 1, updated: "2026-03" },
    { id: 71, name: "Happy people of Ukraine", desc: "Кількість і види не вказані", status: "Approved", lat: null, lng: null, hectares: 2195.4, zones: 4, updated: "2026-03" },
    { id: 72, name: "Lagulsky Arboretum", desc: "Дендропарк поповнюють новими деревами. Кількість і види не вказані", status: "Approved", lat: null, lng: null, hectares: 7.36, zones: 1, updated: "2026-03" },
    { id: 74, name: "Planting of forest belts and green spaces", desc: "Лісосмуги й зелені насадження. Кількість і види не вказані", status: "Approved", lat: null, lng: null, hectares: 1.22, zones: 1, updated: "2026-03" },
    { id: 80, name: "Local reforestation project in Kyiv region, Ukraine", desc: "Біля Веселої Слобідки заплановано 650 дерев — 350 лип і 300 сосен", status: "Approved", lat: null, lng: null, hectares: 110.64, zones: 1, updated: "2026-03" },
    { id: 84, name: "Jiviy Dim Zaporozhye", desc: "Кількість і види не вказані", status: "Approved", lat: null, lng: null, hectares: 0.09, zones: 1, updated: "2026-04" },
    { id: 87, name: "Great Gomilsha Trees", desc: "Плодові й хвойні дерева. Кількість і точні види не вказані", status: "Approved", lat: null, lng: null, hectares: 0.51, zones: 1, updated: "2026-04" },
    { id: 91, name: "The Maze Garden or \"Fairy-Tale Garden\"", desc: "В описі згадані яблуневий сад, дерева, ліани, трави й кущі. Кількість не вказана", status: "Approved", lat: null, lng: null, hectares: 5.43, zones: 1, updated: "2026-04" },
  ],

  // --- Carbon Block ---
  carbon: {
    co2Sequestered: 1320, // tons
    creditsIssued: 820,
    mrv: {
      soilHealth: { verified: 12, total: 15 },
      forestArea: { monitored: 320, unit: 'ha' },
      solarEnergy: { value: 212, unit: 'MWh' },
      biodiversitySites: 8,
    },
  },

  // --- Community Economy Block (source: Sarafu) ---
  community: {
    activeWallets: 480,
    localTransactions: 3200,
    mutualCredit: 12500, // SRF tokens
    localExchanges: 1200,
    // Recent vouchers / activity
    vouchers: [
      { settlement: 'Казкове', voucher: 'KZK-001', transactions: 420, members: 65 },
      { settlement: 'Бешкіна', voucher: 'BSH-001', transactions: 380, members: 58 },
      { settlement: 'Зелений Гай', voucher: 'ZLG-001', transactions: 310, members: 47 },
      { settlement: 'Сонячне', voucher: 'SNC-001', transactions: 285, members: 42 },
      { settlement: 'Щасливе', voucher: 'SCH-001', transactions: 260, members: 39 },
      { settlement: 'Еко-Дім', voucher: 'EKD-001', transactions: 245, members: 38 },
      { settlement: 'Лісова Поляна', voucher: 'LSP-001', transactions: 230, members: 35 },
      { settlement: 'Карпатське', voucher: 'KRP-001', transactions: 210, members: 33 },
      { settlement: 'Дніпрове', voucher: 'DNP-001', transactions: 195, members: 30 },
      { settlement: 'Рідне', voucher: 'RDN-001', transactions: 180, members: 28 },
    ],
  },

  // --- Ecovillage / Community Locations (from pomistya.club/map) ---
  ecovillages: [
    { name: 'Світанок', lat: 50.8558, lng: 26.0116, category: 'Family Estate' },
    { name: 'Ємельянівка', lat: 50.8985, lng: 29.1097, category: 'Family Estate' },
    { name: 'Родники', lat: 49.8785, lng: 35.8656, category: 'Family Estate' },
    { name: 'Сила роду', lat: 49.5547, lng: 30.2779, category: 'Family Estate' },
    { name: 'Лада', lat: 50.6899, lng: 28.8892, category: 'Family Estate' },
    { name: 'Благодар', lat: 49.1194, lng: 27.8581, category: 'Family Estate' },
    { name: 'Світанкове', lat: 50.4277, lng: 34.8147, category: 'Family Estate' },
    { name: 'Твердиня', lat: 49.0618, lng: 28.2344, category: 'Family Estate' },
    { name: 'Журавлі', lat: 51.1321, lng: 30.8460, category: 'Family Estate' },
    { name: 'Помістя Кошастого', lat: 50.0720, lng: 31.1868, category: 'Eco-settlement' },
    { name: 'Простір Любові родини Рачок', lat: 50.0386, lng: 25.7267, category: 'Eco-settlement' },
    { name: 'Світолісся', lat: 48.9424, lng: 32.5247, category: 'Family Estate' },
    { name: 'Поселення Майстрів', lat: 48.7173, lng: 35.5445, category: 'Eco-settlement' },
    { name: 'Зелені кручі', lat: 49.4212, lng: 30.8676, category: 'Eco-settlement' },
    { name: 'Чарівне', lat: 49.0974, lng: 32.4789, category: 'Various Communities' },
    { name: 'Тепла Гора', lat: 48.2056, lng: 24.9673, category: 'Eco-settlement' },
    { name: 'Казкова Долина', lat: 49.8674, lng: 34.6029, category: 'Family Estate' },
    { name: 'Щасливі Люди', lat: 49.4802, lng: 36.3213, category: 'Various Communities' },
    { name: 'Любодарове', lat: 48.9657, lng: 27.9664, category: 'Various Communities' },
    { name: 'Школа Життя', lat: 50.4047, lng: 30.1676, category: 'Various Communities' },
    { name: 'Райский Сад', lat: 49.2274, lng: 28.0201, category: 'Family Estate' },
    { name: 'Комора', lat: 51.9013, lng: 31.1186, category: 'Various Communities' },
    { name: 'Лубське', lat: 50.2264, lng: 29.8892, category: 'Family Estate' },
    { name: 'Кедри Полісся', lat: 50.3601, lng: 28.5570, category: 'Family Estate' },
    { name: 'Купєлія', lat: 48.8617, lng: 28.8137, category: 'Family Estate' },
    { name: 'Гранідуб', lat: 50.5965, lng: 27.9930, category: 'Eco-settlement' },
    { name: 'Коло Лісу', lat: 49.4895, lng: 36.3180, category: 'Various Communities' },
    { name: 'Рассвєт_Самара', lat: 48.7158, lng: 35.5481, category: 'Eco-settlement' },
    { name: 'Простір Присамар\'я', lat: 48.7656, lng: 35.4616, category: 'Various Communities' },
    { name: 'Благодать', lat: 48.1311, lng: 25.6195, category: 'Family Estate' },
    { name: 'Жива Хата', lat: 48.1600, lng: 24.8127, category: 'Various Communities' },
    { name: 'Свячене', lat: 49.8159, lng: 36.1164, category: 'Eco-settlement' },
    { name: 'Велесвіт', lat: 49.2525, lng: 26.0981, category: 'Spiritual Community' },
    { name: 'Радарія', lat: 50.7966, lng: 29.5735, category: 'Eco-settlement' },
    { name: 'Простір Любові', lat: 50.5440, lng: 27.9781, category: 'Eco-settlement' },
    { name: 'Озаріння', lat: 49.8261, lng: 36.0006, category: 'Eco-settlement' },
    { name: 'Родничок', lat: 47.8862, lng: 31.1106, category: 'Family Estate' },
    { name: 'Счастливое', lat: 47.2788, lng: 28.6307, category: 'Family Estate' },
    { name: 'Живий Дім', lat: 49.6497, lng: 36.1989, category: 'Eco-settlement' },
    { name: 'Улюблене', lat: 48.0680, lng: 33.1166, category: 'Family Estate' },
    { name: 'Баранівка', lat: 49.9469, lng: 34.0311, category: 'Various Communities' },
    { name: 'ЖиваРод', lat: 48.9093, lng: 27.5765, category: 'Eco-settlement' },
    { name: 'Посолонь', lat: 50.5623, lng: 27.9339, category: 'Family Estate' },
    { name: 'Велика родина', lat: 49.1571, lng: 29.0939, category: 'Spiritual Community' },
    { name: 'Казкове', lat: 50.2943, lng: 29.6593, category: 'Family Estate' },
    { name: 'Ладославне', lat: 50.8059, lng: 29.5529, category: 'Family Estate' },
    { name: 'Hobbit Terra', lat: 48.7118, lng: 35.5483, category: 'Various Communities' },
    { name: 'Душевний Простір Бушанської Толоки', lat: 48.3439, lng: 28.0888, category: 'Various Communities' },
    { name: 'Під куполом кохання', lat: 48.7894, lng: 29.5859, category: 'Eco-community' },
    { name: 'Клан Малоок', lat: 50.3480, lng: 30.9565, category: 'Eco-community' },
    { name: 'Медова Насолода', lat: 50.5824, lng: 26.1273, category: 'Eco-settlement' },
    { name: 'Салинці', lat: 48.8493, lng: 29.0480, category: 'Eco-settlement' },
    { name: 'Андріївка', lat: 48.7653, lng: 35.4487, category: 'Eco-settlement' },
    { name: 'Потоки', lat: 49.0341, lng: 28.2343, category: 'Eco-settlement' },
    { name: 'Dzin Space', lat: 48.1882, lng: 24.7237, category: 'Spiritual Community' },
    { name: 'Кручі', lat: 46.6174, lng: 31.2184, category: 'Eco-settlement' },
    { name: 'Пермакультурний хутір Землетворіння', lat: 49.6357, lng: 31.5409, category: 'Eco-settlement' },
    { name: 'Садиба Джа', lat: 50.7437, lng: 25.4841, category: 'Various Communities' },
    { name: 'Подільські Етнохати', lat: 48.9968, lng: 26.9855, category: 'Eco-settlement' },
    { name: 'Новий Маяпур', lat: 49.1663, lng: 34.8055, category: 'Spiritual Community' },
    { name: 'Зелений Гай', lat: 48.2821, lng: 34.8517, category: 'Various Communities' },
    { name: 'Хата Гончара', lat: 48.0009, lng: 35.7341, category: 'Various Communities' },
    { name: 'Бхакті Тіртха Горакшья', lat: 49.8104, lng: 29.5134, category: 'Spiritual Community' },
    { name: 'ГЛИНоЛЕНД', lat: 50.3048, lng: 30.0667, category: 'Various Communities' },
    { name: 'Медова скриня', lat: 49.8316, lng: 23.7414, category: 'Various Communities' },
    { name: 'Лопушна', lat: 49.6386, lng: 24.1587, category: 'Various Communities' },
    { name: 'Автентичний дім', lat: 48.8290, lng: 23.4976, category: 'Eco-settlement' },
    { name: 'ЕкоВсесвіт', lat: 50.4781, lng: 29.9751, category: 'Eco-community' },
    { name: 'Проєкт «Garden Yeva»', lat: 50.0938, lng: 34.0497, category: 'Various Communities' },
    { name: 'Воронья Слободка', lat: 49.5191, lng: 35.9230, category: 'Various Communities' },
    { name: 'Родинна садиба Буряківських', lat: 49.6659, lng: 36.1574, category: 'Various Communities' },
    { name: 'СадГура', lat: 48.2353, lng: 23.6331, category: 'Various Communities' },
    { name: 'Нью Враджа Бхумі Дхам', lat: 46.8849, lng: 31.7427, category: 'Spiritual Community' },
    { name: 'Великі Прицьки', lat: 49.9150, lng: 30.9748, category: 'Eco-settlement' },
    { name: 'Великая Гомильша', lat: 49.5525, lng: 36.2638, category: 'Eco-settlement' },
    { name: 'Дім Сонця', lat: 46.5895, lng: 30.7594, category: 'Various Communities' },
    { name: 'Vrinda-Ashram', lat: 49.1688, lng: 32.1659, category: 'Spiritual Community' },
    { name: 'Сокіл 8', lat: 48.9114, lng: 26.5412, category: 'Eco-settlement' },
    { name: 'Стан Живосвіт', lat: 49.3400, lng: 30.9555, category: 'Eco-community' },
    { name: 'Родовое поместье Лориен', lat: 48.1196, lng: 32.9627, category: 'Family Estate' },
    { name: 'Моя Українська Мрія', lat: 48.6745, lng: 22.3572, category: 'Various Communities' },
    { name: 'ГОЛОКА', lat: 48.0705, lng: 29.5640, category: 'Eco-settlement' },
    { name: 'Обирок', lat: 51.3876, lng: 32.8719, category: 'Eco-settlement' },
    { name: 'Простір Джерело Гармонії', lat: 49.7291, lng: 31.4410, category: 'Eco-settlement' },
    { name: 'Барвінок', lat: 48.1076, lng: 34.3875, category: 'Family Estate' },
    { name: 'Исцеление жизни', lat: 48.8020, lng: 27.0982, category: 'Eco-settlement' },
    { name: 'Покуття', lat: 48.6703, lng: 25.5072, category: 'Various Communities' },
    { name: 'Амарант', lat: 49.2302, lng: 36.3711, category: 'Eco-settlement' },
    { name: 'Райська Долина', lat: 47.0760, lng: 30.2748, category: 'Family Estate' },
    { name: 'Траволіс', lat: 50.0626, lng: 29.6198, category: 'Eco-settlement' },
  ],

  // --- Solar Stations (from GEN Ukraine Solar stations KML) ---
  solarStations: [
    { name: 'Velyka Rodyna', lat: 49.1543, lng: 29.0919, desc: '5×450W panels, 6kW inverter, 5kW battery' },
    { name: 'Happy People', lat: 49.4837, lng: 36.3257, desc: '5×450W panels, 6kW inverter, 5kW battery' },
    { name: 'Kedravushka / Ladoslavne', lat: 50.8052, lng: 29.5696, desc: '5×580W panels, 6kW inverter, 5kW battery' },
    { name: 'Radaria Ecocentre', lat: 50.7975, lng: 29.5738, desc: '5×580W panels, 6kW inverter, 5kW battery' },
    { name: 'Ozarinnya', lat: 49.8262, lng: 36.0009, desc: '4×450W panels, 3kW inverter, 5kW battery' },
    { name: 'Svitanok / Rassvet-Samara', lat: 48.7157, lng: 35.5487, desc: '7×450W panels, 6.2kW inverter, 15kW battery' },
    { name: 'Pokuttya Waldorf School', lat: 48.6706, lng: 25.5074, desc: '5×450W panels, 10kW inverter, 5kW battery' },
  ],

  // --- Rainwater Harvesting Systems (from GEN Ukraine rainwater KML) ---
  rainwaterSystems: [
    { name: 'Omelyanivka', lat: 50.8983, lng: 29.1098, desc: '1,000L rainwater system, expandable to 2,000L' },
    { name: 'Jyvyi Dim', lat: 49.6482, lng: 36.2072, desc: 'Well for conifer trees and garden' },
    { name: 'Svitanok-Samara', lat: 48.7156, lng: 35.5490, desc: 'Well + 1,000L rainwater system, lake recharging, swales' },
    { name: 'Bezvodne (Bhumi)', lat: 46.5314, lng: 31.4435, desc: 'Water well + 10kW generator, ~9,600L/day for 120 cows' },
    { name: 'Goloka', lat: 48.1141, lng: 29.9606, desc: '4×IBC tanks (4,000L), rooftop catchment, drip irrigation' },
    { name: 'Radariya', lat: 50.7974, lng: 29.5735, desc: '4,000L tank + gutter system from educational building' },
    { name: 'Tepla Hora', lat: 48.2075, lng: 24.9640, desc: '9×1,000L tanks, UV + reverse osmosis + mineralization' },
    { name: 'Bhumi', lat: 48.6943, lng: 27.3819, desc: 'Roof-to-tank from 2 buildings, 40,000+L captured in 2025' },
    { name: 'Charivne Lake Systems', lat: 49.0952, lng: 32.4720, desc: 'Cascading lake & dam system, biodiversity restoration' },
  ],

  // --- Platform links ---
  platforms: [
    { name: 'Arkreen', url: 'https://arkreen.com', color: '#4ade80' },
    { name: 'Regen Network', url: 'https://www.regen.network', color: '#86efac' },
    { name: 'Sarafu', url: 'https://sarafu.network', color: '#f97316' },
    { name: 'GainForest', url: 'https://gainforest.app', color: '#22d3ee' },
    { name: 'Silvi', url: 'https://silvi.earth', color: '#a3e635' },
  ],
};
