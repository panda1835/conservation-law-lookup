# IUCN Status Fetcher - Output Format

## Overview

The script now outputs IUCN Red List data in the same format as your existing Vietnamese conservation law data files, making it easy to integrate or compare.

## Output Structure

Each species entry follows this format:

```json
{
  "scientific_name": {
    "value": "Panthera tigris",
    "note": ""
  },
  "common_name_en": {
    "value": "Tiger",
    "note": ""
  },
  "kingdom_latin": "ANIMALIA",
  "kingdom_vi": "",
  "phylum_latin": "CHORDATA",
  "phylum_vi": "",
  "class_latin": "MAMMALIA",
  "class_vi": "",
  "order_latin": "CARNIVORA",
  "order_vi": "",
  "family_latin": "FELIDAE",
  "family_vi": "",
  "note": "",
  "laws": [
    {
      "name": {
        "vi": "IUCN",
        "en": "IUCN"
      },
      "value": "EN",
      "note": "https://www.iucnredlist.org/species/15955/214862019"
    }
  ]
}
```

## Field Descriptions

### Species Information

- **scientific_name.value**: Full scientific name as queried
- **common_name_en.value**: Primary English common name from IUCN (from taxon.common_names where main=true)

### Taxonomy

All taxonomy fields are populated from the IUCN API v4 taxon object:

- **kingdom_latin**: Kingdom name (e.g., PLANTAE, ANIMALIA)
- **phylum_latin**: Phylum name (e.g., CHORDATA, TRACHEOPHYTA)
- **class_latin**: Class name (e.g., MAMMALIA, PINOPSIDA)
- **order_latin**: Order name (e.g., CARNIVORA, PINALES)
- **family_latin**: Family name (e.g., FELIDAE, PINACEAE)

Vietnamese names (\*\_vi fields) are left empty as they're not provided by IUCN.

### IUCN Status

The `laws` array contains the IUCN Red List category:

- **name**: Always {"vi": "IUCN", "en": "IUCN"}
- **value**: IUCN Red List category code:
  - **CR**: Critically Endangered
  - **EN**: Endangered
  - **VU**: Vulnerable
  - **NT**: Near Threatened
  - **LC**: Least Concern
  - **DD**: Data Deficient
  - **EW**: Extinct in the Wild
  - **EX**: Extinct
- **note**: Direct URL to the species assessment page on iucnredlist.org

## Output File

- **Location**: `src/lib/iucn_status.json`
- **Format**: JSON array of species objects
- **Encoding**: UTF-8 with support for special characters
- **Indentation**: 4 spaces for readability

## Important Notes

1. **Only successful queries are saved**: Species not found in IUCN database or with errors are excluded from the output file

2. **Latest assessments**: The script uses the assessment marked as `latest: true` in the API response

3. **Empty Vietnamese fields**: Since IUCN doesn't provide Vietnamese translations, all `*_vi` fields are empty strings

4. **Common names**: The script prioritizes the common name marked as "main" in the IUCN database, defaulting to the first available if no main name exists

5. **Taxonomy data**: All taxonomy information comes directly from the IUCN API and may use different formatting than Vietnamese law documents

## Usage in Your Application

This format allows you to:

- Directly compare IUCN categories with Vietnamese conservation law categories
- Display species information consistently across all data sources
- Filter and search using the same structure as existing data
- Easily merge or display IUCN status alongside Vietnamese legal status

Example comparison in your UI:

```
Species: Panthera tigris (Tiger)
Vietnamese Status: Group IA (ND 06/2019)
IUCN Status: EN - Endangered
```
