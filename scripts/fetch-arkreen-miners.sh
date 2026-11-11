#!/usr/bin/env bash
# Fetches Arkreen solar site data via JSON-RPC API and saves to dashboard/data/arkreen-miners.json
# Run periodically to keep the static snapshot up to date.
# Usage: ./scripts/fetch-arkreen-miners.sh
#
# NOTE: the old endpoint (openapi.arkreen.com) no longer resolves — Arkreen moved
# their explorer backend to costdownapi.arkreen.com, and the data model changed
# from per-miner-device stats to per-owner (site) aggregation. Each site below is
# an "owner" address that aggregates ~20 individual smart meters onboarded as a batch.

set -euo pipefail
cd "$(dirname "$0")/.."

API_URL="https://costdownapi.arkreen.com/v1"

# Arkreen solar sites (owner/account addresses, as shown on explorer.arkreen.com/accounts/{address})
SITES='[
  {"id":"site_drago","name":"Drago","address":"0x95698e8c98bff2891c564d9e8ac19c62b9b4877c"},
  {"id":"site_kazkove","name":"Kazkove","address":"0xDD398FDCe78520880464F9704FC6a6f44A11d31C"},
  {"id":"site_tepla_gora","name":"Tepla Gora","address":"0xD1Eaf98cA2303737888F6BD5D6D5FD3FFcbF164E"},
  {"id":"site_zhyvyi_dim","name":"Zhyvyi Dim","address":"0x1928d078f230d9e535eb89db3a3c5d84849c5e93"},
  {"id":"site_happy_people","name":"Happy People","address":"0x6Bc8cCaDb2eABdEf24113f468e263F0775EC09aB"},
  {"id":"site_sv_samara","name":"SV Samara","address":"0x8713F971d3edE75e484edDbB8E89DfD0530138C8"}
]'

echo "Fetching Arkreen site data..."

for addr in $(echo "$SITES" | python3 -c "import sys,json; [print(m['address']) for m in json.load(sys.stdin)]"); do
  echo "  Owner stats for $addr..."
  curl -sf -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"agg_getOwnerStatsByAddress\",\"params\":{\"address\":\"$addr\"}}" \
    > "/tmp/arkreen_owner_${addr}.json"

  echo "  30-day reward trend for $addr..."
  curl -sf -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"agg_getUserRewardLatest30DaysDashboard\",\"params\":{\"owner\":\"$addr\"}}" \
    > "/tmp/arkreen_reward30d_${addr}.json"
done

# Combine results
python3 -c "
import json
from datetime import datetime, timezone

sites_cfg = $SITES
results = []

# Arkreen's 'energy' field has no documented unit. Cross-checked against
# per-device totals (agg_queryMinersDetailByOwner): a single ~100W-class meter
# reports total_energy ~2.68e7 over ~2.5 months, which only lines up with its
# rated power if the field is scaled by 1e6 to reach kWh. Treat totalKwh as
# a best-effort derived figure, not an Arkreen-documented conversion.
ENERGY_TO_KWH = 1e6

for m in sites_cfg:
    addr = m['address']
    try:
        with open(f'/tmp/arkreen_owner_{addr}.json') as f:
            data = json.load(f)
        r = (data.get('result') or {}).get('total', {})
        total_energy = float(r.get('energy', 0))
        total_reward = float(r.get('total_reward', 0))
        miner_count = int(r.get('miner_count', 0))

        # Load 30-day reward trend (cumulative-to-date values) and diff into daily earnings
        daily = []
        try:
            with open(f'/tmp/arkreen_reward30d_{addr}.json') as f:
                trend_data = json.load(f)
            points = (trend_data.get('result') or {}).get('dailyRewards', [])
            points.sort(key=lambda x: x['date'])
            # Today is still in progress (reads as 0 / a partial day) — only chart complete days
            today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
            points = [pt for pt in points if pt['date'] < today]
            for i, pt in enumerate(points):
                cum = float(pt['total'])
                if i == 0:
                    # First point is the cumulative total to date, not a day's earnings
                    # (using it as-is made a huge spike on day 1) — start diffing from the 2nd point
                    continue
                prev = float(points[i - 1]['total'])
                day_akre = cum - prev
                daily.append({'date': pt['date'], 'akre': round(max(day_akre, 0), 4)})
        except Exception as e:
            print(f'  WARNING: no reward trend for {m[\"name\"]}: {e}')

        results.append({
            'id': m['id'],
            'name': m['name'],
            'address': addr,
            'totalKwh': round(total_energy / ENERGY_TO_KWH, 2),
            'totalReward': round(total_reward, 2),
            'minerCount': miner_count,
            'daily': daily,
        })
        print(f'  {m[\"name\"]}: {total_energy/ENERGY_TO_KWH:.1f} kWh (derived), {total_reward:.2f} AKRE, {miner_count} miners, {len(daily)} days trend')
    except Exception as e:
        print(f'  ERROR fetching {m[\"name\"]}: {e}')
        results.append({
            'id': m['id'],
            'name': m['name'],
            'address': addr,
            'totalKwh': 0,
            'totalReward': 0,
            'minerCount': 0,
            'daily': [],
            'error': str(e),
        })

# Build combined daily reward (sum across all sites per date)
all_dates = {}
for m in results:
    for d in m.get('daily', []):
        all_dates[d['date']] = all_dates.get(d['date'], 0) + d['akre']
combined_daily = [{'date': k, 'akre': round(v, 2)} for k, v in sorted(all_dates.items())]

total_kwh = sum(m['totalKwh'] for m in results)
total_reward = sum(m['totalReward'] for m in results)

output = {
    'miners': results,
    'dailyProduction': combined_daily,
    'totalKwh': round(total_kwh, 2),
    'totalReward': round(total_reward, 2),
    'minerCount': len(results),
    'fetchedAt': datetime.now(timezone.utc).isoformat(),
}

with open('dashboard/data/arkreen-miners.json', 'w') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f'Done: {len(results)} sites, {total_kwh:.0f} kWh total (derived), {total_reward:.2f} AKRE total, {len(combined_daily)} days chart data')
"
