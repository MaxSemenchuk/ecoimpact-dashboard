#!/usr/bin/env bash
# Fetches Sarafu settlement reports via tRPC API and saves to dashboard/data/sarafu-reports.json
# Run periodically to keep the static snapshot up to date.
# Usage: ./scripts/fetch-sarafu-reports.sh

set -euo pipefail
cd "$(dirname "$0")/.."

VOUCHERS='["0x096305EA606B1D5dC710eDae23c8a07993a323ab","0x100546fa90ce08FB0Fc77E8fc4b15437aFDCFd6d","0x70325D3d9a7276C2444CaE3025E4E9C9BE3996cD","0x8c7b8148117E6d6A37eB789E48107B371308b61a","0x0F5BE6FAd57cC3813210Fc95e436B78E3Fec5CB9","0x4BB4D96840Ee960cE103abe3409Afde450E81F29","0x36068337faA077351b7Cd73eE1eD39f2801031A4","0x38ccBFDb0CD66ad7c102d73029493F60671Fa91B","0x00cdeEF9A70E0b8128055adD3dE3c48f745E5b98","0x386E88BA20EF11c8E04f4904038A05CBAfD91199","0x640799065442b9Fed96edeA7Ee38FdCF03584c41","0xD7B95aaD5cec0aD8cb4350eE51521B63674444FF","0x2bB8552D246640ff2e51E72Bfd3B822d11ba7C41","0xC013697bA7aDb9b29C58186234f0A304A3B43979","0x339C049CCa1E33607eb6cd0FdD1Cb20541ca1953","0xf4C346853d2dd9e5049acEcB5fF824d256a281E5","0x8204605eCD0052A6340CbA512fB68aF911d9f3c0","0xc4b2Ea06AC1e8617FEE636Fc10152bFD0baF7Cda","0x24fa9fA92fC131c94Cac9F2C15DA1147CE77F3d6","0x2F559036B4D4ceD968b4E8a120b750A0c45953F5","0x3b36c220617e1810932393219A94Cc7Ae0edaD0e","0x4ceEC475B783ED868D70f0B822Ac880E93331f74","0x8f7597F01870496a35f2621e4F7Cd5432B795D9D","0xf05f36b8e3216875cE12330bd73Fe77Fa2a035BE","0xaB6a92480A409246dd58f55f506DB5F21cd5B1fD","0x96597fdC85D1b3e287f45a76FF00bF67EC2aBc65"]'

INPUT=$(python3 -c "import json,urllib.parse; print(urllib.parse.quote(json.dumps({'json':{'limit':2000,'cursor':0,'vouchers':json.loads('$VOUCHERS')}})))")

echo "Fetching reports from Sarafu tRPC API..."
curl -sf "https://sarafu.network/api/trpc/report.list?input=$INPUT" > /tmp/sarafu_raw.json

python3 -c "
import json
from datetime import datetime, timezone

voucher_names = {
    '0x096305EA606B1D5dC710eDae23c8a07993a323ab': 'Tepla Hora',
    '0x100546fa90ce08FB0Fc77E8fc4b15437aFDCFd6d': 'Omelyanivka',
    '0x70325D3d9a7276C2444CaE3025E4E9C9BE3996cD': 'Svitanok',
    '0x8c7b8148117E6d6A37eB789E48107B371308b61a': 'Happy People',
    '0x0F5BE6FAd57cC3813210Fc95e436B78E3Fec5CB9': 'Charivne',
    '0x4BB4D96840Ee960cE103abe3409Afde450E81F29': 'Living Home',
    '0x36068337faA077351b7Cd73eE1eD39f2801031A4': 'Radaria',
    '0x38ccBFDb0CD66ad7c102d73029493F60671Fa91B': 'Hobbit Terra',
    '0x00cdeEF9A70E0b8128055adD3dE3c48f745E5b98': 'Sunrise Ecovillage',
    '0x386E88BA20EF11c8E04f4904038A05CBAfD91199': 'Bushanska Toloka',
    '0x640799065442b9Fed96edeA7Ee38FdCF03584c41': 'MaistryMy',
    '0xD7B95aaD5cec0aD8cb4350eE51521B63674444FF': 'Etnokod',
    '0x2bB8552D246640ff2e51E72Bfd3B822d11ba7C41': 'New Mayapur',
    '0xC013697bA7aDb9b29C58186234f0A304A3B43979': 'Dzin Space',
    '0x339C049CCa1E33607eb6cd0FdD1Cb20541ca1953': 'Potoky',
    '0xf4C346853d2dd9e5049acEcB5fF824d256a281E5': 'Velyka Rodyna',
    '0x8204605eCD0052A6340CbA512fB68aF911d9f3c0': 'Prilestnoe',
    '0xc4b2Ea06AC1e8617FEE636Fc10152bFD0baF7Cda': 'Rodniki',
    '0x24fa9fA92fC131c94Cac9F2C15DA1147CE77F3d6': 'Space of Love',
    '0x2F559036B4D4ceD968b4E8a120b750A0c45953F5': 'Eco-center School Life',
    '0x3b36c220617e1810932393219A94Cc7Ae0edaD0e': 'Pokuttya School',
    '0x4ceEC475B783ED868D70f0B822Ac880E93331f74': 'Ohra Workshop',
    '0x8f7597F01870496a35f2621e4F7Cd5432B795D9D': 'Veloselo',
    '0xf05f36b8e3216875cE12330bd73Fe77Fa2a035BE': 'Prostir Lyubovi',
    '0xaB6a92480A409246dd58f55f506DB5F21cd5B1fD': 'Lubodarove EcoHub',
    '0x96597fdC85D1b3e287f45a76FF00bF67EC2aBc65': 'Veseli Kurkuli',
}

with open('/tmp/sarafu_raw.json') as f:
    data = json.load(f)
items = data['result']['data']['json']['items']

settlement_reports = {n: 0 for n in voucher_names.values()}
for item in items:
    for addr in item['vouchers']:
        if addr in voucher_names:
            settlement_reports[voucher_names[addr]] += 1

tag_counts = {}
for item in items:
    for tag in item['tags']:
        tag_counts[tag] = tag_counts.get(tag, 0) + 1

settlements = sorted(
    [{'name': n, 'address': a, 'reports': settlement_reports[n],
      'url': f'https://sarafu.network/vouchers/{a}'}
     for a, n in voucher_names.items()],
    key=lambda x: -x['reports']
)
tags = sorted([{'tag': t, 'count': c} for t, c in tag_counts.items()], key=lambda x: -x['count'])

output = {
    'totalReports': len(items),
    'totalVouchers': len(voucher_names),
    'settlements': settlements,
    'tags': tags,
    'fetchedAt': datetime.now(timezone.utc).isoformat(),
}

with open('dashboard/data/sarafu-reports.json', 'w') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f'Done: {len(items)} reports, {len(tags)} tags, {len(settlements)} settlements')
"
