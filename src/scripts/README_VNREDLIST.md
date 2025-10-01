# Vietnam Red List Status Fetcher

This script fetches conservation status data ("Phân hạng bảo tồn") from the Vietnamese Red List website (http://vnredlist.vast.vn) for species in the project's conservation database.

## Overview

The Vietnam Red List is the official assessment of threatened species in Vietnam, maintained by the Vietnam Academy of Science and Technology (VAST) and the Institute of Ecology and Biological Resources (IEBR).

## What it does

1. Reads all species from existing JSON files in `src/lib/`:

   - `nd06_2019.json`
   - `nd160_2013.json`
   - `nd64_2019.json`
   - `nd84_2021.json`
   - `tt27_2025.json`
   - `iucn_status.json`

2. For each unique species, fetches its conservation status from vnredlist.vast.vn

3. Parses the "Phân hạng bảo tồn" (conservation status) field

4. Outputs a JSON file (`vnredlist_status.json`) in the same format as other conservation law files

## Conservation Status Categories

The Vietnam Red List uses IUCN categories:

- **EX** - Extinct (Tuyệt chủng)
- **EW** - Extinct in the Wild (Tuyệt chủng trong tự nhiên)
- **CR** - Critically Endangered (Cực kỳ nguy cấp)
- **EN** - Endangered (Nguy cấp)
- **VU** - Vulnerable (Sẽ nguy cấp)
- **NT** - Near Threatened (Sắp bị đe dọa)
- **LC** - Least Concern (Ít quan tâm)
- **DD** - Data Deficient (Thiếu dữ liệu)
- **NE** - Not Evaluated (Chưa đánh giá)

## Installation

Install required Python packages:

```bash
pip install -r requirements.txt
```

Or install individually:

```bash
pip install requests beautifulsoup4
```

## Usage

Run the script from the scripts directory:

```bash
cd src/scripts
python fetch_vnredlist_status.py
```

Or from the project root:

```bash
python src/scripts/fetch_vnredlist_status.py
```

## Output Format

The script generates `src/lib/vnredlist_status.json` with the following structure:

```json
[
  {
    "scientific_name": {
      "value": "Elephas maximus",
      "note": ""
    },
    "common_name": {
      "value": "Voi châu á",
      "note": ""
    },
    "kingdom_latin": "ANIMALIA",
    "kingdom_vi": "",
    "phylum_latin": "CHORDATA",
    "phylum_vi": "",
    "class_latin": "MAMMALIA",
    "class_vi": "",
    "order_latin": "PROBOSCIDEA",
    "order_vi": "",
    "family_latin": "ELEPHANTIDAE",
    "family_vi": "",
    "note": "",
    "laws": [
      {
        "name": {
          "vi": "Danh lục Đỏ Việt Nam",
          "en": "Vietnam Red List"
        },
        "value": "CR",
        "note": "http://vnredlist.vast.vn/elephas-maximus/"
      }
    ]
  }
]
```

## Features

- **Smart URL construction**: Converts scientific names to URL slugs automatically
- **Caching**: Avoids duplicate requests for the same species
- **Polite scraping**: Includes delays between requests (1.5 seconds) to avoid overwhelming the server
- **Error handling**: Gracefully handles network errors and missing pages
- **Progress tracking**: Shows real-time progress with status indicators

## Rate Limiting

The script includes a 1.5-second delay between requests to be respectful to the vnredlist.vast.vn server. For large datasets, the script may take some time to complete.

## Troubleshooting

### Species not found

Some species may not have entries on the Vietnam Red List website. This is normal and the script will skip them.

### Connection errors

If you experience connection timeouts:

- Check your internet connection
- The vnredlist.vast.vn server may be temporarily unavailable
- Try running the script again later

### HTTP 404 errors

If a species page returns 404, it means:

- The species is not in the Vietnam Red List database
- The scientific name may have changed (taxonomic revision)
- The URL slug format may be different

## Notes

- The script only fetches species that have an entry on the Vietnam Red List website
- Species without entries are not included in the output file
- The script preserves taxonomic information from the source JSON files
- URLs to species pages are included in the `note` field for reference

## Example Run

```
Vietnam Red List Status Fetcher
==================================================
Library directory: /path/to/project/src/lib
Output file: /path/to/project/src/lib/vnredlist_status.json

Fetching Vietnam Red List status for 350 species...

[1/350] Elephas maximus
  Fetching: http://vnredlist.vast.vn/elephas-maximus/
    ✓ Found: CR
[2/350] Panthera tigris
  Fetching: http://vnredlist.vast.vn/panthera-tigris/
    ✓ Found: EN
...

Saving 287 entries to /path/to/project/src/lib/vnredlist_status.json...
✓ Done! Found status for 287 out of 350 species.

Summary:
  - Total species checked: 350
  - Species with status: 287
  - Species without status: 63
```
