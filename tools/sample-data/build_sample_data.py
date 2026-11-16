"""Build the recommender's sample database: farmers + real climate history.

Writes
  src/data/recommender/farmers.json   ~250 sample farmers across 55 real districts in 12 states (synthetic people)
  src/data/recommender/climate.json   per crop, per district: 2005-2021 season anomalies from REAL data
      - "yield":   Government of India district crop statistics (APY, Directorate of Economics & Statistics,
                   via India Data Portal, ODC-BY). anomaly = yield / median of the previous 5 seasons - 1.
      - "weather": NASA POWER daily weather (MERRA-2) at the district, scored for weather that hurts this crop
                   (used where yield records are missing: mango, tomato, broiler and a few districts).

Run:  uv run --with pandas --with numpy --with requests python tools/sample-data/build_sample_data.py
Downloads are cached in tools/sample-data/.cache/ (git-ignored).
"""

import json
import math
import time
from pathlib import Path

import numpy as np
import pandas as pd
import requests

ROOT = Path(__file__).resolve().parents[2]
CACHE = Path(__file__).resolve().parent / ".cache"
OUT = ROOT / "src" / "data" / "recommender"
APY_URL = ("https://ckandev.indiadataportal.com/dataset/f2bbc28c-6c7c-462b-9064-ea4c4213d466/resource/"
           "f980409d-49a2-42ae-9eb0-182365005c04/download/crop-wise-area-production-yield.csv")
POWER_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"
NOMINATIM = "https://nominatim.openstreetmap.org/search"
USER_AGENT = "harvestlink-sample-data/0.1"
SEASONS = list(range(2005, 2022))       # agricultural years (June -> May), 2005-06 .. 2021-22
FPO = (13.2172, 79.1003)                # Chittoor Farmers FPO
SEED = 42
# Geocoder results that land on the wrong side of a district: pin to the district headquarters town.
FIXED = {"Andhra Pradesh|Chittoor": (13.2172, 79.1003)}

STATE = {"AP": "Andhra Pradesh", "TN": "Tamil Nadu", "KA": "Karnataka", "TG": "Telangana", "KL": "Kerala", "MH": "Maharashtra",
         "GJ": "Gujarat", "UP": "Uttar Pradesh", "BR": "Bihar", "WB": "West Bengal", "OD": "Odisha", "PB": "Punjab"}

# District -> crops its farmers grow (district names as in the APY statistics).
DISTRICTS = {
    "AP": {"Chittoor": ["Mango", "Tomato", "Groundnut", "Broiler"], "Ananthapuramu": ["Groundnut", "Tomato", "Banana"],
           "Kurnool": ["Chilli", "Groundnut", "Tomato"], "Guntur": ["Chilli", "Rice"], "Krishna": ["Mango", "Rice"],
           "Prakasam": ["Chilli", "Rice"], "Y.S.R. Kadapa": ["Banana", "Groundnut"], "Sri Potti Sriramulu Nellore": ["Rice", "Broiler"],
           "West Godavari": ["Rice", "Banana"]},
    "TN": {"Krishnagiri": ["Mango", "Tomato"], "Dharmapuri": ["Tomato", "Mango"], "Salem": ["Tomato", "Mango"], "Dindigul": ["Mango", "Chilli"],
           "Theni": ["Banana", "Mango"], "Coimbatore": ["Banana", "Tomato", "Broiler"], "Tiruchirappalli": ["Banana", "Rice"],
           "Thanjavur": ["Rice"], "Vellore": ["Groundnut", "Mango"], "Namakkal": ["Broiler", "Groundnut"], "Ramanathapuram": ["Chilli"],
           "Tiruvannamalai": ["Groundnut", "Rice"]},
    "KA": {"Kolar": ["Tomato", "Mango"], "Chikkaballapura": ["Tomato", "Mango"], "Belagavi": ["Tomato", "Groundnut"], "Dharwad": ["Chilli", "Mango"],
           "Chitradurga": ["Groundnut"], "Mysuru": ["Rice", "Tomato"], "Haveri": ["Chilli"], "Ballari": ["Chilli", "Rice"]},
    "TG": {"Khammam": ["Chilli", "Mango", "Rice"], "Warangal": ["Chilli", "Rice"], "Nizamabad": ["Rice", "Banana"], "Mahabubnagar": ["Groundnut", "Mango"],
           "Nalgonda": ["Rice"]},
    "KL": {"Thrissur": ["Banana"], "Palakkad": ["Rice", "Banana"]},
    "MH": {"Ratnagiri": ["Mango"], "Nashik": ["Tomato"], "Jalgaon": ["Banana"], "Pune": ["Tomato", "Broiler"], "Kolhapur": ["Rice"]},
    "GJ": {"Junagadh": ["Groundnut", "Mango"], "Rajkot": ["Groundnut"], "Valsad": ["Mango"], "Kachchh": ["Mango", "Groundnut"]},
    "UP": {"Lucknow": ["Mango"], "Saharanpur": ["Mango", "Rice"]},
    "BR": {"Muzaffarpur": ["Mango"], "Bhagalpur": ["Banana", "Rice"]},
    "WB": {"Malda": ["Mango", "Rice"], "Purba Bardhaman": ["Rice"]},
    "OD": {"Ganjam": ["Rice", "Chilli"], "Cuttack": ["Rice"]},
    "PB": {"Ludhiana": ["Rice"], "Hoshiarpur": ["Mango", "Rice"]},
}
APY_CROP = {"Rice": "Rice", "Groundnut": "Groundnut", "Banana": "Banana", "Chilli": "Dry Chillies"}   # crops with yield records

# Weather that hurts each crop: (variable, months, comparison, threshold). "deficit" = less rain than usual; "dry" = longest dry spell.
HAZARDS = {
    "Mango": [("prcp", (1, 3), ">=", 10), ("tmax", (4, 5), ">=", 42), ("tmin", (12, 1), "<=", 6)],
    "Tomato": [("tmax", (10, 3), ">=", 35), ("prcp", (10, 12), ">=", 50), ("tmin", (12, 2), "<=", 8)],
    "Broiler": [("tmax", (3, 6), ">=", 38), ("tmax", (7, 2), ">=", 35)],
    "Banana": [("tmax", (4, 5), ">=", 40), ("tmin", (12, 1), "<=", 8), ("prcp", (6, 11), ">=", 80)],
    "Rice": [("deficit", (6, 9), None, None), ("dry", (6, 9), None, None), ("prcp", (10, 11), ">=", 80)],
    "Groundnut": [("deficit", (6, 9), None, None), ("dry", (7, 9), None, None)],
    "Chilli": [("prcp", (10, 12), ">=", 50), ("dry", (8, 10), None, None)],
}
WEATHER_ANOMALY_SD = 0.15   # spread of the weather-based anomaly, similar to typical district yield swings

NAMES = {
    "te": (["Ravi", "Lakshmi", "Srinivas", "Padma", "Venkatesh", "Anjali", "Suresh", "Sravani", "Ramesh", "Kavitha", "Naresh", "Swathi", "Prasad", "Bhavani", "Mahesh", "Sunitha", "Gopal", "Radha"],
           ["Reddy", "Naidu", "Rao", "Goud", "Chowdary", "Yadav", "Babu", "Varma"]),
    "ta": (["Murugan", "Selvi", "Karthik", "Lakshmi", "Senthil", "Meena", "Arun", "Kavitha", "Rajesh", "Devi", "Saravanan", "Priya", "Ganesan", "Malathi"],
           ["Subramani", "Raj", "Pandian", "Kumar", "Gounder", "Pillai", "Velu"]),
    "kn": (["Basavaraj", "Shilpa", "Manjunath", "Savitha", "Ramesh", "Lakshmi", "Prakash", "Shobha", "Mahesh", "Anitha", "Nagaraj", "Roopa"],
           ["Gowda", "Patil", "Shetty", "Hegde", "Naik", "Kulkarni"]),
    "ml": (["Biju", "Anitha", "Suresh", "Lekha", "Rajan", "Sindhu", "Joseph", "Bindu"], ["Thomas", "Nair", "Menon", "Pillai", "Varghese"]),
    "mr": (["Prakash", "Savitri", "Sachin", "Sunita", "Ganesh", "Manisha", "Vijay", "Rohini", "Dattatray", "Ujwala"], ["Jadhav", "Patil", "Pawar", "Kamble", "Shinde", "More"]),
    "gu": (["Hasmukh", "Bhavna", "Ramesh", "Jayshree", "Dilip", "Hetal", "Kantilal", "Manjula"], ["Patel", "Desai", "Chavda", "Solanki", "Bhatt"]),
    "hi": (["Imran", "Sunita", "Rakesh", "Pooja", "Ram", "Anita", "Sunil", "Rekha", "Manoj", "Geeta"], ["Ansari", "Yadav", "Singh", "Verma", "Maurya", "Kumar"]),
    "bn": (["Debasish", "Mousumi", "Subrata", "Rina", "Tapas", "Shila"], ["Roy", "Das", "Mondal", "Ghosh", "Sarkar"]),
    "or": (["Manoj", "Sasmita", "Prakash", "Mamata", "Bikash", "Gitanjali"], ["Nayak", "Sahu", "Behera", "Pradhan", "Mohanty"]),
    "pa": (["Gurpreet", "Harjit", "Manpreet", "Jaspal", "Kuldeep", "Baljit"], ["Singh", "Gill", "Sandhu", "Dhillon", "Brar"]),
}
LANG = {"AP": "te", "TG": "te", "TN": "ta", "KA": "kn", "KL": "ml", "MH": "mr", "GJ": "gu", "UP": "hi", "BR": "hi", "WB": "bn", "OD": "or", "PB": "pa"}

IRRIGATION_BY_CROP = {
    "Rice": {"canal": .5, "borewell": .35, "rainfed": .1, "borewell_drip": .05},
    "Groundnut": {"rainfed": .55, "borewell": .3, "borewell_drip": .15},
    "Mango": {"rainfed": .4, "borewell": .35, "borewell_drip": .25},
    "Tomato": {"borewell": .45, "borewell_drip": .4, "canal": .1, "rainfed": .05},
    "Chilli": {"borewell": .45, "rainfed": .3, "canal": .15, "borewell_drip": .1},
    "Banana": {"borewell_drip": .55, "borewell": .3, "canal": .15},
    "Broiler": {"borewell": .8, "canal": .2},
}


# ---------------------------------------------------------------- data sources

def apy() -> pd.DataFrame:
    path = CACHE / "apy.csv"
    if not path.exists():
        print("downloading APY statistics (~56 MB)…", flush=True)
        path.write_bytes(requests.get(APY_URL, timeout=600).content)
    df = pd.read_csv(path, usecols=["year", "state_name", "district_name", "crop_name", "season", "area", "production"])
    df = df[(df.season != "Total") & (df.area > 0) & (df.production > 0)].copy()
    df["ag_year"] = df.year.str[:4].astype(int)
    return df


def yield_anomalies(df: pd.DataFrame, state: str, district: str, crop: str) -> dict[int, float]:
    d = df[(df.state_name == state) & (df.district_name == district) & (df.crop_name == crop)]
    if d.empty:
        return {}
    g = d.groupby("ag_year").agg(area=("area", "sum"), production=("production", "sum"))
    y = (g.production / g.area).sort_index()
    med = y.median()
    y = y[(y < 4 * med) & (y > 0.2 * med)]                      # drop data-entry errors
    normal = y.shift(1).rolling(5, min_periods=3).median()
    a = (y / normal - 1).clip(-0.9, 1.0).dropna()
    return {int(k): round(float(v), 4) for k, v in a.items() if k in SEASONS}


def geocode(cache: dict, state: str, district: str) -> tuple[float, float]:
    key = f"{state}|{district}"
    if key in FIXED:
        return FIXED[key]
    if cache.get(key):
        return tuple(cache[key])
    for params in ({"county": district, "state": state}, {"q": f"{district} district, {state}, India"}, {"q": f"{district}, {state}, India"}):
        time.sleep(1.1)
        r = requests.get(NOMINATIM, params={**params, "format": "jsonv2", "limit": 3, "countrycodes": "in"}, headers={"User-Agent": USER_AGENT}, timeout=30)
        hits = [h for h in r.json() if state.lower().replace(" ", "") in h.get("display_name", "").lower().replace(" ", "")]
        if hits:
            cache[key] = [float(hits[0]["lat"]), float(hits[0]["lon"])]
            return tuple(cache[key])
    raise RuntimeError(f"could not geocode {key}")


def grid_point(lat: float, lon: float) -> tuple[float, float]:
    return round(round(lat / 0.5) * 0.5, 3), round(round(lon / 0.625) * 0.625, 3)


def weather(lat: float, lon: float) -> pd.DataFrame:
    lat, lon = grid_point(lat, lon)
    path = CACHE / "weather" / f"{lat:.2f}_{lon:.2f}.csv.gz"
    if not path.exists():
        params = {"parameters": "T2M_MAX,T2M_MIN,PRECTOTCORR", "community": "AG", "latitude": f"{lat:.4f}", "longitude": f"{lon:.4f}",
                  "start": "19970601", "end": "20220531", "format": "JSON"}
        for attempt in range(3):
            try:
                p = requests.get(POWER_URL, params=params, timeout=180).json()["properties"]["parameter"]
                break
            except Exception:
                if attempt == 2:
                    raise
                time.sleep(5)
        df = pd.DataFrame({"tmax": p["T2M_MAX"], "tmin": p["T2M_MIN"], "prcp": p["PRECTOTCORR"]})
        df.index = pd.to_datetime(df.index, format="%Y%m%d")
        df = df.replace(-999.0, np.nan).rename_axis("date").reset_index()
        path.parent.mkdir(parents=True, exist_ok=True)
        df.to_csv(path, index=False, compression="gzip")
    df = pd.read_csv(path, parse_dates=["date"])
    df["ag_year"] = np.where(df.date.dt.month >= 6, df.date.dt.year, df.date.dt.year - 1)
    return df


def in_months(m: pd.Series, lo: int, hi: int) -> pd.Series:
    return (m >= lo) & (m <= hi) if lo <= hi else (m >= lo) | (m <= hi)


def longest_dry(prcp: pd.Series) -> int:
    best = run = 0
    for v in prcp.to_numpy():
        run = run + 1 if v < 1 else 0
        best = max(best, run)
    return best


def hazard_counts(w: pd.DataFrame, crop: str) -> pd.DataFrame:
    rows = []
    for year, g in w.groupby("ag_year"):
        if year not in SEASONS:
            continue
        row = {"season": year}
        for i, (var, (lo, hi), cmp, thr) in enumerate(HAZARDS[crop]):
            s = g[in_months(g.date.dt.month, lo, hi)]
            if var == "deficit":
                row[f"h{i}"] = -s.prcp.sum()
            elif var == "dry":
                row[f"h{i}"] = longest_dry(s.prcp)
            else:
                row[f"h{i}"] = float(((s[var] >= thr) if cmp == ">=" else (s[var] <= thr)).sum())
        rows.append(row)
    return pd.DataFrame(rows)


# ---------------------------------------------------------------- farmers

def make_farmers(coords: dict[tuple[str, str], tuple[float, float]], rng: np.random.Generator) -> list[dict]:
    def haversine(a, b):
        p1, p2 = math.radians(a[0]), math.radians(b[0])
        x = math.sin((p2 - p1) / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(math.radians(b[1] - a[1]) / 2) ** 2
        return 2 * 6371 * math.asin(math.sqrt(x))

    farmers, used = [], set()
    for code, dists in DISTRICTS.items():
        first, last = NAMES[LANG[code]]
        for district, crops in dists.items():
            lat, lon = coords[(code, district)]
            n = 4 + int(rng.integers(0, 3))                                    # 4-6 farmers per district
            for k in range(n):
                main = crops[k % len(crops)]
                grows = [main] + [c for c in crops if c != main and rng.random() < 0.45]
                irr_p = IRRIGATION_BY_CROP[main]
                irrigation = str(rng.choice(list(irr_p), p=np.array(list(irr_p.values())) / sum(irr_p.values())))
                practices = []
                if main in ("Tomato", "Banana", "Chilli") and rng.random() < 0.35: practices.append("mulching")
                if main in ("Tomato", "Chilli", "Groundnut") and rng.random() < 0.35: practices.append("raised_beds")
                if main == "Tomato" and rng.random() < 0.12: practices.append("shade_net")
                total = float(np.clip(np.exp(rng.normal(math.log(4.5), 0.6)), 1, 30))
                trust = int(np.clip(rng.normal(80, 8), 55, 98))
                for _ in range(20):
                    name = f"{rng.choice(first)} {rng.choice(last)}"
                    if name not in used:
                        break
                used.add(name)
                flat, flon = lat + rng.normal(0, 0.08), lon + rng.normal(0, 0.08)
                farmers.append({
                    "id": len(farmers), "name": name, "state": code, "district": district, "village": None,
                    "lat": round(flat, 4), "lon": round(flon, 4),
                    "kmFromFpo": int(round(haversine(FPO, (flat, flon)) * 1.2)),            # straight line x 1.2 ~ road distance
                    "totalAcres": round(total, 1), "freeAcres": round(total * float(rng.uniform(0.3, 0.7)), 1),
                    "crops": grows, "irrigation": irrigation,
                    "irrigationReliable": None if irrigation == "rainfed" else bool(rng.random() < 0.72),
                    "practices": practices,
                    "waterlogging": str(rng.choice(["never", "sometimes", "often"], p=[0.5, 0.32, 0.18] if main == "Rice" else [0.62, 0.3, 0.08])),
                    "trust": trust, "onTimePct": int(np.clip(trust - rng.uniform(0, 8), 45, 99)),
                    "pastContracts": int(rng.integers(0, 10)),
                })
    return farmers


# ---------------------------------------------------------------- main

def main() -> None:
    rng = np.random.default_rng(SEED)
    geo_path = CACHE / "geocode.json"
    geo = json.loads(geo_path.read_text()) if geo_path.exists() else {}
    coords = {}
    for code, dists in DISTRICTS.items():
        for district in dists:
            coords[(code, district)] = geocode(geo, STATE[code], district)
    geo_path.write_text(json.dumps(geo, indent=1, sort_keys=True))
    print(f"{len(coords)} districts located", flush=True)

    df = apy()
    climate: dict[str, dict[str, list]] = {}
    sources: dict[str, dict[str, str]] = {}
    weather_rows: dict[str, list] = {}
    for code, dists in DISTRICTS.items():
        for district, crops in dists.items():
            key = f"{code}|{district}"
            w = None
            for crop in crops:
                series = yield_anomalies(df, STATE[code], district, APY_CROP[crop]) if crop in APY_CROP else {}
                if len(series) >= 10:
                    climate.setdefault(crop, {})[key] = [{"season": s, "anomaly": a} for s, a in sorted(series.items())]
                    sources.setdefault(crop, {})[key] = "yield"
                else:
                    if w is None:
                        w = weather(*coords[(code, district)])
                    h = hazard_counts(w, crop)
                    h["key"] = key
                    weather_rows.setdefault(crop, []).append(h)

    # Weather-based anomalies: each hazard as a deviation from that district's own normal, scaled by the
    # spread across all districts (so places with more volatile weather get bigger swings).
    for crop, frames in weather_rows.items():
        h = pd.concat(frames, ignore_index=True)
        cols = [c for c in h.columns if c.startswith("h")]
        dev = h[cols] - h.groupby("key")[cols].transform("mean")
        stress = (dev / dev.std(ddof=0).replace(0, 1)).sum(axis=1)
        h["anomaly"] = (-WEATHER_ANOMALY_SD * stress / (stress.std(ddof=0) or 1)).clip(-0.6, 0.25).round(4)
        for key, g in h.groupby("key"):
            climate.setdefault(crop, {})[key] = [{"season": int(s), "anomaly": float(a)} for s, a in zip(g.season, g.anomaly)]
            sources.setdefault(crop, {})[key] = "weather"

    farmers = make_farmers(coords, rng)
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "farmers.json").write_text(json.dumps(farmers, indent=1, ensure_ascii=False))
    (OUT / "climate.json").write_text(json.dumps({
        "crops": climate, "sources": sources,
        "notes": {
            "yield": "Government of India district crop statistics (APY, DES / India Data Portal, ODC-BY): yield vs median of the previous 5 seasons.",
            "weather": "NASA POWER daily weather (MERRA-2) at the district, scored for weather that hurts the crop; used where yield records are missing.",
            "seasons": f"Agricultural years {SEASONS[0]}-{SEASONS[0] + 1} to {SEASONS[-1]}-{SEASONS[-1] + 1}.",
        },
    }, separators=(",", ":")))

    print(f"{len(farmers)} farmers in {len(coords)} districts, {len(DISTRICTS)} states")
    for crop in sorted(climate):
        src = sources[crop]
        growers = sum(crop in f["crops"] for f in farmers)
        print(f"  {crop:9s} {growers:3d} growers · {len(src):2d} districts · yield records {sum(v == 'yield' for v in src.values()):2d}, weather {sum(v == 'weather' for v in src.values()):2d}")


if __name__ == "__main__":
    main()
