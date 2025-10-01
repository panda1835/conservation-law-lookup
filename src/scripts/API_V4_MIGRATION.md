# IUCN API v4 Migration Summary

## Changes Made to `fetch_iucn_status.py`

### API Configuration

- **Base URL**: Updated from `https://apiv3.iucnredlist.org/api/v3` to `https://api.iucnredlist.org/api/v4`
- **Token Registration**: Updated URL from `https://apiv3.iucnredlist.org/api/v3/token` to `https://api.iucnredlist.org/users/sign_up`

### API Endpoint Changes

- **Old (v3)**: `GET /species/{scientific_name}?token={token}`
- **New (v4)**: `GET /taxa/scientific_name?genus_name={genus}&species_name={species}&infra_name={infrarank}`

### Authentication Method

- **Old (v3)**: Query parameter `?token={token}`
- **New (v4)**: Bearer token in Authorization header `Authorization: Bearer {token}`

### Request Structure

The v4 API requires scientific names to be split into components:

```python
# Example: "Panthera tigris"
params = {
    "genus_name": "Panthera",      # Required
    "species_name": "tigris",       # Required
    "infra_name": "tigris"          # Optional (for subspecies)
}

headers = {
    "Authorization": f"Bearer {IUCN_API_TOKEN}"
}
```

### Response Structure Changes

**v3 Response:**

```json
{
  "result": [
    {
      "taxonid": 123,
      "category": "EN",
      "main_common_name": "Tiger",
      "population_trend": "Decreasing",
      "assessment_date": "2021-01-01"
    }
  ]
}
```

**v4 Response (Actual):**

```json
{
  "taxon": {
    "sis_id": 44724,
    "scientific_name": "Abies delavayi subsp. fansipanensis",
    "genus_name": "Abies",
    "species_name": "delavayi",
    "infra_name": "fansipanensis",
    "common_names": [
      { "main": true, "name": "Fansipan Fir", "language": "eng" }
    ]
  },
  "assessments": [
    {
      "assessment_id": 10943353,
      "red_list_category_code": "CR",
      "year_published": "2011",
      "latest": true,
      "url": "https://www.iucnredlist.org/species/44724/10943353",
      "scopes": [{ "description": { "en": "Global" }, "code": "1" }]
    }
  ]
}
```

**Key Differences:**

- Category is in `red_list_category_code` not `category`
- Common names are in `taxon.common_names[]` array
- Taxon info is in separate `taxon` object
- Assessments have `latest` boolean flag
- Scope is an object with description and code

### Output Data Changes

New fields added to the output JSON:

- `assessment_id`: Unique identifier for the specific assessment
- `sis_id`: Species Information Service ID (from taxon object)
- `year_published`: Publication year
- `scope`: Assessment scope (e.g., "Global", "Mediterranean")
- `url`: Direct link to the species assessment page

Renamed/Changed fields:

- `main_common_name` → `common_name` (extracted from taxon.common_names array)
- `taxonid` → `sis_id` (from taxon.sis_id)
- `category` now comes from `red_list_category_code` in assessment

Removed fields (not in v4 response):

- `population_trend`: Not returned in basic taxa/scientific_name endpoint
- `assessment_date`: Not included in basic response (use full assessment endpoint for details)

## Testing

Run the test script to verify the integration:

```bash
python3 src/scripts/test_api_v4.py
```

## Usage

The usage remains the same:

```bash
export IUCN_API_TOKEN="your_token_here"
python3 src/scripts/fetch_iucn_status.py
```

## Documentation Updates

- Updated `README.md` with API v4 information
- Added section explaining Bearer token authentication
- Updated all API URLs to point to v4 endpoints
