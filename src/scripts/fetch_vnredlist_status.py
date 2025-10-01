#!/usr/bin/env python3
"""
Fetch Vietnam Red List conservation status data for species.

This script fetches conservation status ("Phân hạng bảo tồn") from the Vietnamese Red List
website (vnredlist.vast.vn) for species listed in the project's JSON data files.

Output format matches the structure of other conservation law files in src/lib/
"""

import json
import os
import re
import sys
import time
from typing import Dict, List, Optional, Set
from urllib.parse import quote

import requests
from bs4 import BeautifulSoup


BASE_URL = "http://vnredlist.vast.vn"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
}

# Cache to avoid duplicate requests
species_cache: Dict[str, Optional[str]] = {}


def normalize_scientific_name(name: str) -> str:
    """Normalize scientific name for URL construction."""
    # Remove author names and years (e.g., "Linnaeus, 1758")
    name = re.sub(r'\s+[A-Z][a-z]+.*\d{4}.*$', '', name)
    # Remove subspecies indicators and extra info
    name = re.sub(r'\s+(var\.|subsp\.|f\.).*$', '', name)
    # Clean up extra whitespace
    name = ' '.join(name.split())
    return name.strip()


def scientific_name_to_url_slug(scientific_name: str) -> str:
    """Convert scientific name to URL slug format."""
    normalized = normalize_scientific_name(scientific_name)
    # Convert to lowercase and replace spaces with hyphens
    slug = normalized.lower().replace(' ', '-')
    return slug


def fetch_conservation_status(scientific_name: str) -> Optional[str]:
    """
    Fetch conservation status for a species from Vietnam Red List website.
    
    Args:
        scientific_name: Scientific name of the species
        
    Returns:
        Conservation status code (e.g., "CR", "EN", "VU", "NT", "LC") or None if not found
    """
    # Check cache first
    if scientific_name in species_cache:
        return species_cache[scientific_name]
    
    try:
        slug = scientific_name_to_url_slug(scientific_name)
        url = f"{BASE_URL}/{slug}/"
        
        print(f"  Fetching: {url}")
        response = requests.get(url, headers=HEADERS, timeout=30)
        
        # If not found, try without the species epithet (for some edge cases)
        if response.status_code == 404:
            # Try with just genus
            parts = scientific_name.split()
            if len(parts) > 1:
                genus_slug = parts[0].lower()
                url = f"{BASE_URL}/{genus_slug}-{parts[1].lower()}/"
                print(f"  Retry: {url}")
                response = requests.get(url, headers=HEADERS, timeout=30)
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for the conservation status section
            # The structure is: <h3>Phân hạng bảo tồn</h3> followed by <p>STATUS</p>
            headings = soup.find_all(['h3', 'h4'])
            for heading in headings:
                if 'Phân hạng bảo tồn' in heading.get_text():
                    # Get the next sibling element
                    next_elem = heading.find_next_sibling(['p', 'div'])
                    if next_elem:
                        status_text = next_elem.get_text().strip()
                        # Extract status code (CR, EN, VU, NT, LC, DD, etc.)
                        status_match = re.search(r'\b(CR|EN|VU|NT|LC|DD|EW|EX|NE)\b', status_text)
                        if status_match:
                            status = status_match.group(1)
                            species_cache[scientific_name] = status
                            print(f"    ✓ Found: {status}")
                            return status
            
            # Alternative: Look in the assessment information section
            assessment_section = soup.find('h2', string=re.compile(r'Thông tin đánh giá'))
            if assessment_section:
                # Look for "Phân hạng" subsection
                section_content = assessment_section.find_next('div')
                if section_content:
                    status_text = section_content.get_text()
                    status_match = re.search(r'Phân hạng[:\s]+([A-Z]{1,2})', status_text)
                    if status_match:
                        status = status_match.group(1)
                        species_cache[scientific_name] = status
                        print(f"    ✓ Found: {status}")
                        return status
            
            print(f"    ✗ No status found on page")
        else:
            print(f"    ✗ HTTP {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"    ✗ Error: {e}")
    except Exception as e:
        print(f"    ✗ Unexpected error: {e}")
    
    species_cache[scientific_name] = None
    return None


def load_species_from_json_files(lib_dir: str) -> List[Dict]:
    """
    Load all unique species from JSON files in the lib directory.
    
    Args:
        lib_dir: Path to the lib directory containing JSON files
        
    Returns:
        List of unique species with their scientific names and taxonomic info
    """
    species_set: Set[str] = set()
    species_list: List[Dict] = []
    
    json_files = [
        'nd06_2019.json',
        'nd160_2013.json',
        'nd64_2019.json',
        'nd84_2021.json',
        'tt27_2025.json',
        'iucn_status.json'
    ]
    
    for json_file in json_files:
        file_path = os.path.join(lib_dir, json_file)
        if not os.path.exists(file_path):
            print(f"Warning: {json_file} not found, skipping...")
            continue
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            for entry in data:
                sci_name = entry.get('scientific_name', {}).get('value', '').strip()
                if sci_name and sci_name not in species_set:
                    species_set.add(sci_name)
                    
                    # Extract taxonomic information
                    species_info = {
                        'scientific_name': {
                            'value': sci_name,
                            'note': entry.get('scientific_name', {}).get('note', '')
                        },
                        'common_name': entry.get('common_name', {
                            'value': '',
                            'note': ''
                        }),
                        'kingdom_latin': entry.get('kingdom_latin', ''),
                        'kingdom_vi': entry.get('kingdom_vi', ''),
                        'phylum_latin': entry.get('phylum_latin', ''),
                        'phylum_vi': entry.get('phylum_vi', ''),
                        'class_latin': entry.get('class_latin', ''),
                        'class_vi': entry.get('class_vi', ''),
                        'order_latin': entry.get('order_latin', ''),
                        'order_vi': entry.get('order_vi', ''),
                        'family_latin': entry.get('family_latin', ''),
                        'family_vi': entry.get('family_vi', ''),
                        'note': entry.get('note', ''),
                    }
                    species_list.append(species_info)
                    
        except json.JSONDecodeError as e:
            print(f"Error reading {json_file}: {e}")
        except Exception as e:
            print(f"Error processing {json_file}: {e}")
    
    return species_list


def create_vnredlist_json(species_list: List[Dict], output_path: str, delay: float = 1.0):
    """
    Fetch conservation status for all species and create output JSON file.
    
    Args:
        species_list: List of species to fetch data for
        output_path: Path to save the output JSON file
        delay: Delay in seconds between requests to avoid overwhelming the server
    """
    results = []
    total = len(species_list)
    
    print(f"\nFetching Vietnam Red List status for {total} species...\n")
    
    for idx, species in enumerate(species_list, 1):
        sci_name = species['scientific_name']['value']
        print(f"[{idx}/{total}] {sci_name}")
        
        status = fetch_conservation_status(sci_name)
        
        if status:
            species_entry = species.copy()
            species_entry['laws'] = [
                {
                    'name': {
                        'vi': 'Danh lục Đỏ Việt Nam',
                        'en': 'Vietnam Red List'
                    },
                    'value': status,
                    'note': f"{BASE_URL}/{scientific_name_to_url_slug(sci_name)}/"
                }
            ]
            results.append(species_entry)
        
        # Be polite to the server
        if idx < total:
            time.sleep(delay)
    
    # Save results
    print(f"\n\nSaving {len(results)} entries to {output_path}...")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Done! Found status for {len(results)} out of {total} species.")
    print(f"\nSummary:")
    print(f"  - Total species checked: {total}")
    print(f"  - Species with status: {len(results)}")
    print(f"  - Species without status: {total - len(results)}")


def main():
    """Main entry point."""
    # Determine paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    lib_dir = os.path.join(project_root, 'lib')
    output_path = os.path.join(lib_dir, 'vnredlist_status.json')
    
    print("Vietnam Red List Status Fetcher")
    print("=" * 50)
    print(f"Library directory: {lib_dir}")
    print(f"Output file: {output_path}")
    
    # Check if requests and beautifulsoup4 are available
    try:
        import requests
        from bs4 import BeautifulSoup
    except ImportError as e:
        print("\n✗ Error: Required packages not installed.")
        print("  Please install them with:")
        print("  pip install requests beautifulsoup4")
        sys.exit(1)
    
    # Load species from existing JSON files
    species_list = load_species_from_json_files(lib_dir)
    
    if not species_list:
        print("\n✗ No species found in JSON files.")
        sys.exit(1)
    
    # Fetch data and create output file
    create_vnredlist_json(species_list, output_path, delay=1.5)


if __name__ == '__main__':
    main()
