#!/usr/bin/env python3
"""
Script to fetch IUCN Red List conservation status for species in the conservation law lookup database.
This script reads all species data from JSON files, queries the IUCN Red List API v4,
and saves the conservation status to a JSON file.
"""

import json
import os
import time
from pathlib import Path
from typing import Dict, List, Set
import requests
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file
# IUCN Red List API v4 configuration
IUCN_API_BASE_URL = "https://api.iucnredlist.org/api/v4"
# You'll need to get a free API token from https://api.iucnredlist.org/users/sign_up
# For now, using a placeholder - user should replace this
IUCN_API_TOKEN = os.environ.get("IUCN_API_TOKEN", "YOUR_API_TOKEN_HERE")
print(IUCN_API_TOKEN)
def read_species_from_json(file_path: str) -> List[str]:
    """
    Read species scientific names from a JSON file.
    
    Args:
        file_path: Path to the JSON file
        
    Returns:
        List of scientific names
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        scientific_names = []
        for species in data:
            if 'scientific_name' in species and 'value' in species['scientific_name']:
                name = species['scientific_name']['value'].strip()
                if name:
                    scientific_names.append(name)
        
        return scientific_names
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return []

def get_iucn_status(scientific_name: str) -> Dict:
    """
    Query the IUCN Red List API v4 for a species' conservation status.
    
    Args:
        scientific_name: Scientific name of the species (e.g., "Panthera tigris")
        
    Returns:
        Dictionary containing IUCN status information
    """
    try:
        # Split scientific name into genus and species (and optional infra_name)
        name_parts = scientific_name.strip().split()
        
        if len(name_parts) < 2:
            return {
                "scientific_name": scientific_name,
                "category": "Error",
                "error": "Invalid scientific name format (needs at least genus and species)",
                "status": "error"
            }
        
        genus_name = name_parts[0]
        species_name = name_parts[1]
        infra_name = name_parts[2] if len(name_parts) > 2 else None
        
        # Build API v4 URL with query parameters
        url = f"{IUCN_API_BASE_URL}/taxa/scientific_name"
        params = {
            "genus_name": genus_name,
            "species_name": species_name
        }
        
        if infra_name:
            params["infra_name"] = infra_name
        
        # Use Bearer token authentication in header (API v4 requirement)
        headers = {
            "Authorization": f"Bearer {IUCN_API_TOKEN}"
        }
        
        response = requests.get(url, params=params, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            # API v4 actual response structure:
            # - 'taxon' object contains species info
            # - 'assessments' array contains assessment data
            if 'assessments' in data and len(data['assessments']) > 0:
                # Get the latest assessment (should have latest=True)
                latest = None
                for assessment in data['assessments']:
                    if assessment.get('latest', False):
                        latest = assessment
                        break
                
                # If no latest found, use first one
                if latest is None:
                    latest = data['assessments'][0]
                
                # Get common name from taxon object
                common_name = ''
                if 'taxon' in data and 'common_names' in data['taxon']:
                    for cn in data['taxon']['common_names']:
                        if cn.get('main', False):
                            common_name = cn.get('name', '')
                            break
                    # If no main common name, use first one
                    if not common_name and len(data['taxon']['common_names']) > 0:
                        common_name = data['taxon']['common_names'][0].get('name', '')
                
                # Get scope description
                scope = ''
                if 'scopes' in latest and len(latest['scopes']) > 0:
                    scope = latest['scopes'][0].get('description', {}).get('en', '')
                
                # Extract taxonomy data from taxon object
                taxon = data.get('taxon', {})
                
                return {
                    "scientific_name": scientific_name,
                    "assessment_id": latest.get('assessment_id'),
                    "category": latest.get('red_list_category_code', 'Unknown'),
                    "common_name": common_name,
                    "sis_id": taxon.get('sis_id', ''),
                    "year_published": latest.get('year_published', ''),
                    "scope": scope,
                    "url": latest.get('url', ''),
                    "kingdom_name": taxon.get('kingdom_name', ''),
                    "phylum_name": taxon.get('phylum_name', ''),
                    "class_name": taxon.get('class_name', ''),
                    "order_name": taxon.get('order_name', ''),
                    "family_name": taxon.get('family_name', ''),
                    "genus_name": taxon.get('genus_name', ''),
                    "species_name": taxon.get('species_name', ''),
                    "status": "success"
                }
            else:
                return {
                    "scientific_name": scientific_name,
                    "category": "Not Found",
                    "status": "not_found"
                }
        elif response.status_code == 401:
            return {
                "scientific_name": scientific_name,
                "category": "Error",
                "error": "Unauthorized - check your API token",
                "status": "error"
            }
        elif response.status_code == 404:
            return {
                "scientific_name": scientific_name,
                "category": "Not Found",
                "status": "not_found"
            }
        else:
            return {
                "scientific_name": scientific_name,
                "category": "Error",
                "error": f"HTTP {response.status_code}",
                "status": "error"
            }
            
    except Exception as e:
        return {
            "scientific_name": scientific_name,
            "category": "Error",
            "error": str(e),
            "status": "error"
        }

def main():
    """Main function to process all species and fetch IUCN status."""
    
    # Get the project root directory
    script_dir = Path(__file__).parent
    # Go up from scripts to src, then to lib
    lib_dir = script_dir.parent / "lib"
    
    # Define the JSON files to read
    json_files = [
        "nd06_2019.json",
        "nd160_2013.json",
        "nd64_2019.json",
        "nd84_2021.json",
        "tt27_2025.json"
    ]
    
    # Collect all unique scientific names
    all_species: Set[str] = set()
    
    print("Reading species data from JSON files...")
    for json_file in json_files:
        file_path = lib_dir / json_file
        if file_path.exists():
            species_names = read_species_from_json(str(file_path))
            all_species.update(species_names)
            print(f"  {json_file}: {len(species_names)} species")
        else:
            print(f"  Warning: {json_file} not found")
    
    print(f"\nTotal unique species: {len(all_species)}")
    
    # Check if API token is set
    if IUCN_API_TOKEN == "YOUR_API_TOKEN_HERE":
        print("\n⚠️  WARNING: IUCN_API_TOKEN is not set!")
        print("Please set the IUCN_API_TOKEN environment variable or update the script.")
        print("You can get a free token at: https://api.iucnredlist.org/users/sign_up")
        response = input("\nDo you want to continue anyway? (y/n): ")
        if response.lower() != 'y':
            return
    
    # Fetch IUCN status for each species
    iucn_data = []
    formatted_data = []
    total = len(all_species)
    
    print(f"\nFetching IUCN status for {total} species...")
    print("This may take a while. Please be patient.\n")
    
    for i, scientific_name in enumerate(sorted(all_species), 1):
        print(f"[{i}/{total}] Querying: {scientific_name}")
        
        status_data = get_iucn_status(scientific_name)
        iucn_data.append(status_data)
        
        # Print the result
        if status_data['status'] == 'success':
            print(f"  ✓ Status: {status_data['category']}")
            
            # Format the data in the required structure
            formatted_entry = {
                "scientific_name": {
                    "value": status_data['scientific_name'],
                    "note": ""
                },
                "common_name": {
                    "value": "",  # Will be filled by merge_common_names.py
                    "note": ""
                },
                "common_name_en": {
                    "value": status_data.get('common_name', ''),  # IUCN English name
                    "note": ""
                },
                "kingdom_latin": status_data.get('kingdom_name', ''),
                "kingdom_vi": "",
                "phylum_latin": status_data.get('phylum_name', ''),
                "phylum_vi": "",
                "class_latin": status_data.get('class_name', ''),
                "class_vi": "",
                "order_latin": status_data.get('order_name', ''),
                "order_vi": "",
                "family_latin": status_data.get('family_name', ''),
                "family_vi": "",
                "note": "",
                "laws": [
                    {
                        "name": {
                            "vi": "IUCN",
                            "en": "IUCN"
                        },
                        "value": status_data['category'],
                        "note": status_data.get('url', '')
                    }
                ]
            }
            formatted_data.append(formatted_entry)
            
        elif status_data['status'] == 'not_found':
            print(f"  ⚠ Not found in IUCN database")
        else:
            print(f"  ✗ Error: {status_data.get('error', 'Unknown error')}")
        
        # Rate limiting: IUCN API allows reasonable request rates
        # Add a small delay to be respectful
        time.sleep(0.5)
    
    # Save the formatted results to a JSON file
    output_file = lib_dir / "iucn_status.json"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(formatted_data, f, indent=4, ensure_ascii=False)
    
    print(f"\n✓ IUCN status data saved to: {output_file}")
    print(f"  Format: Structured JSON matching existing data format")
    print(f"  Species with IUCN status: {len(formatted_data)}")
    
    # Print summary statistics
    categories = {}
    for item in iucn_data:
        category = item.get('category', 'Unknown')
        categories[category] = categories.get(category, 0) + 1
    
    print("\nSummary:")
    print("-" * 50)
    for category, count in sorted(categories.items()):
        print(f"  {category}: {count}")
    print("-" * 50)
    print(f"  Total queried: {len(iucn_data)}")
    print(f"  Successfully found: {len(formatted_data)}")
    print(f"  Not found: {categories.get('Not Found', 0)}")

if __name__ == "__main__":
    main()
