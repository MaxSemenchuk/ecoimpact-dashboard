#!/usr/bin/env python3
"""Link locations to hromadas (territorial communities) and build the hromada map layer.

Reads
  dashboard/data/locations.json      location registry (hand-curated)
  dashboard/js/data.js               ecovillage points from pomistya.club (MOCK_DATA.ecovillages)
  scripts/hromada-ecogoals.json      hromadas with concrete eco goals (expansion candidates)
  KSE Loc Data Hub (MIT)             hromada boundaries + 2022 population, downloaded from GitHub
                                     https://github.com/kse-ua/KSE-Loc-Data-Hub

Writes
  dashboard/data/hromadas.geojson    only the hromadas we touch: ones with our locations or
                                     ecovillages, plus the eco-goal hromadas (simplified shapes)
  dashboard/data/locations.json      fills each location's "hromada" (KATOTTG code)

Usage (needs Python 3.9+ and shapely: pip install shapely)
  python3 scripts/build-hromadas.py [--kse-dir path/with/geography.csv,ua-pop-2022.csv]
"""
import argparse, csv, json, re, sys, urllib.request
from pathlib import Path

try:
    from shapely.geometry import Point, Polygon, MultiPolygon, mapping
    from shapely.validation import make_valid
except ImportError:
    sys.exit('shapely is required: pip install shapely')

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'dashboard' / 'data'
KSE_BASE = 'https://raw.githubusercontent.com/kse-ua/KSE-Loc-Data-Hub/main/data/derived'
csv.field_size_limit(10**9)


def kse_csv(name, kse_dir):
    if kse_dir:
        return open(Path(kse_dir) / name, encoding='utf-8')
    print(f'Downloading {name} from KSE Loc Data Hub...')
    raw = urllib.request.urlopen(f'{KSE_BASE}/{name}', timeout=180).read().decode('utf-8')
    return raw.splitlines()


def depth(x):
    return 1 + depth(x[0]) if isinstance(x, list) else 0


def parse_geometry(s):
    """KSE stores sf geometries as R deparse text: list(list(c(lon..., lat...))) per polygon."""
    t = json.loads(s.replace('list(', '[').replace('c(', '[').replace(')', ']'))
    polys = [t] if depth(t) == 2 else t
    ring = lambda v: list(zip(v[:len(v) // 2], v[len(v) // 2:]))
    shapes = [Polygon(ring(p[0]), [ring(h) for h in p[1:]]) for p in polys]
    g = MultiPolygon(shapes) if len(shapes) > 1 else shapes[0]
    return g if g.is_valid else make_valid(g)


def round_coords(geo, nd=4):
    def r(c):
        return [round(c[0], nd), round(c[1], nd)] if isinstance(c[0], (int, float)) else [r(x) for x in c]
    return {'type': geo['type'], 'coordinates': r(geo['coordinates'])}


def ecovillages_from_datajs():
    src = (ROOT / 'dashboard' / 'js' / 'data.js').read_text(encoding='utf-8')
    block = src[src.index('ecovillages: ['):]
    block = block[:block.index('],')]
    pat = re.compile(r"\{\s*name:\s*'((?:[^'\\]|\\.)*)',\s*lat:\s*([\d.]+),\s*lng:\s*([\d.]+)")
    return [{'name': m.group(1).replace("\\'", "'"), 'lat': float(m.group(2)), 'lng': float(m.group(3))}
            for m in pat.finditer(block)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--kse-dir', help='folder with geography.csv and ua-pop-2022.csv (skips download)')
    args = ap.parse_args()

    pop = {r['hromada_code']: int(float(r['total_population_2022']))
           for r in csv.DictReader(kse_csv('ua-pop-2022.csv', args.kse_dir))
           if r['total_population_2022'] not in ('', 'NA')}
    hromadas = {}
    for r in csv.DictReader(kse_csv('geography.csv', args.kse_dir)):
        hromadas[r['hromada_code']] = {
            'name': f"{r['hromada']} {r['hromada_type']}".strip(),
            'oblast': r['oblast_name'], 'raion': r['raion_name'],
            'area': float(r['square']) if r['square'] not in ('', 'NA') else None,
            'geom': parse_geometry(r['geometry']),
        }
    print(f'{len(hromadas)} hromada boundaries loaded')

    def find(lat, lng):
        p = Point(lng, lat)
        for code, h in hromadas.items():
            if h['geom'].contains(p):
                return code
        return None

    reg_path = DATA / 'locations.json'
    reg = json.loads(reg_path.read_text(encoding='utf-8'))
    used = {}
    for loc in reg['locations']:
        code = find(loc['lat'], loc['lng']) if loc.get('lat') is not None else None
        loc['hromada'] = code
        if code:
            used.setdefault(code, {'locations': [], 'ecovillages': []})['locations'].append(loc['id'])
        elif loc.get('lat') is not None:
            print(f"  ! {loc['id']}: no hromada contains the point")

    for v in ecovillages_from_datajs():
        code = find(v['lat'], v['lng'])
        if code:
            used.setdefault(code, {'locations': [], 'ecovillages': []})['ecovillages'].append(v['name'])

    goals = json.loads((ROOT / 'scripts' / 'hromada-ecogoals.json').read_text(encoding='utf-8'))
    goal_by_code = {g['katottg']: g for g in goals['hromadas']}

    features = []
    for code in sorted(set(used) | set(goal_by_code)):
        h = hromadas.get(code)
        if not h:
            print(f'  ! {code}: not in KSE boundaries')
            continue
        g = goal_by_code.get(code)
        u = used.get(code, {'locations': [], 'ecovillages': []})
        shape = h['geom'].simplify(0.002, preserve_topology=True)
        features.append({
            'type': 'Feature',
            'properties': {
                'code': code, 'name': h['name'], 'oblast': h['oblast'], 'raion': h['raion'],
                'population': pop.get(code), 'areaKm2': h['area'],
                'locations': u['locations'], 'ecovillages': u['ecovillages'],
                'ecoGoal': {k: g[k] for k in ('category', 'uk', 'en')} if g else None,
            },
            'geometry': round_coords(mapping(shape)),
        })

    out = {
        'type': 'FeatureCollection',
        'source': 'Boundaries and population: KSE Loc Data Hub (MIT), github.com/kse-ua/KSE-Loc-Data-Hub. '
                  'Eco goals: hromada-strategy-collab (CC BY 4.0), doi:10.5281/zenodo.22552879.',
        'categories': goals['categories'],
        'features': features,
    }
    (DATA / 'hromadas.geojson').write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    reg_path.write_text(json.dumps(reg, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    ours = sum(1 for c in used if c in hromadas)
    print(f'hromadas.geojson: {len(features)} hromadas ({ours} with our places, {len(goal_by_code)} with eco goals)')


if __name__ == '__main__':
    main()
