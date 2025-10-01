# Quick Start Guide - Vietnam Red List Fetcher

## TL;DR

Fetch conservation status from Vietnam Red List for all your species:

```bash
# 1. Install dependencies
cd src/scripts
pip install requests beautifulsoup4

# 2. Run the script
python fetch_vnredlist_status.py

# 3. Output will be saved to: src/lib/vnredlist_status.json
```

## What you get

A JSON file with Vietnam Red List conservation status for each species:

```json
{
  "scientific_name": "Elephas maximus",
  "laws": [
    {
      "name": { "vi": "Danh lục Đỏ Việt Nam", "en": "Vietnam Red List" },
      "value": "CR",
      "note": "http://vnredlist.vast.vn/elephas-maximus/"
    }
  ]
}
```

## Status codes

| Code | Meaning               | Vietnamese      |
| ---- | --------------------- | --------------- |
| CR   | Critically Endangered | Cực kỳ nguy cấp |
| EN   | Endangered            | Nguy cấp        |
| VU   | Vulnerable            | Sẽ nguy cấp     |
| NT   | Near Threatened       | Sắp bị đe dọa   |
| LC   | Least Concern         | Ít quan tâm     |
| DD   | Data Deficient        | Thiếu dữ liệu   |

## Notes

- Script includes 1.5s delay between requests (be patient!)
- Not all species may have entries on the website
- Test with: `python test_fetch_vnredlist.py`
- Full docs: See `README_VNREDLIST.md`
