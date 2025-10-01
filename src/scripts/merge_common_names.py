#!/usr/bin/env python3
"""
Script to merge Vietnamese common names from existing data files into IUCN status file.
This script:
1. Reads common names from all existing Vietnamese law data files
2. Updates IUCN status file to include Vietnamese common names
3. Keeps IUCN English common names in common_name_en field
"""

import json
from pathlib import Path
from typing import Dict

def read_common_names_from_files(lib_dir: Path) -> Dict[str, str]:
    """
    Read Vietnamese common names from all existing data files.
    
    Returns:
        Dictionary mapping scientific names to Vietnamese common names
    """
    json_files = [
        "nd06_2019.json",
        "nd160_2013.json",
        "nd64_2019.json",
        "nd84_2021.json",
        "tt27_2025.json"
    ]
    
    common_names_map = {}
    
    print("Reading Vietnamese common names from existing data files...")
    for json_file in json_files:
        file_path = lib_dir / json_file
        if file_path.exists():
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            for species in data:
                if 'scientific_name' in species and 'value' in species['scientific_name']:
                    sci_name = species['scientific_name']['value'].strip()
                    
                    if 'common_name' in species and 'value' in species['common_name']:
                        common_name = species['common_name']['value'].strip()
                        
                        # Only add if we don't have it yet or if current one is empty
                        if sci_name not in common_names_map or not common_names_map[sci_name]:
                            if common_name:
                                common_names_map[sci_name] = common_name
            
            print(f"  {json_file}: Found {len([s for s in data if s.get('common_name', {}).get('value')])} names")
    
    print(f"\nTotal unique Vietnamese common names: {len(common_names_map)}")
    return common_names_map

def update_iucn_with_vietnamese_names(lib_dir: Path):
    """Update IUCN status file with Vietnamese common names."""
    
    # Read Vietnamese common names from existing files
    vietnamese_names = read_common_names_from_files(lib_dir)
    
    # Read current IUCN status file
    iucn_file = lib_dir / "iucn_status.json"
    
    if not iucn_file.exists():
        print(f"\n❌ Error: {iucn_file} not found!")
        print("Please run fetch_iucn_status.py first to generate the IUCN data.")
        return
    
    with open(iucn_file, 'r', encoding='utf-8') as f:
        iucn_data = json.load(f)
    
    print(f"\nUpdating IUCN status file with Vietnamese common names...")
    print(f"Total IUCN entries: {len(iucn_data)}")
    
    updated_count = 0
    no_match_count = 0
    
    for entry in iucn_data:
        sci_name = entry['scientific_name']['value']
        
        # Get Vietnamese common name from existing data
        vietnamese_name = vietnamese_names.get(sci_name, '')
        
        if vietnamese_name:
            # Update the common_name field with Vietnamese name
            entry['common_name'] = {
                "value": vietnamese_name,
                "note": ""
            }
            updated_count += 1
        else:
            # Keep common_name empty if no Vietnamese name found
            entry['common_name'] = {
                "value": "",
                "note": ""
            }
            no_match_count += 1
        
        # Ensure common_name_en exists with IUCN English name
        if 'common_name_en' not in entry:
            entry['common_name_en'] = {
                "value": "",
                "note": ""
            }
    
    # Save updated data
    with open(iucn_file, 'w', encoding='utf-8') as f:
        json.dump(iucn_data, f, indent=4, ensure_ascii=False)
    
    print(f"\n✓ Updated IUCN status file")
    print(f"  Entries with Vietnamese names: {updated_count}")
    print(f"  Entries without Vietnamese names: {no_match_count}")
    print(f"  Total entries: {len(iucn_data)}")
    
    # Show some examples
    print(f"\nExamples of merged entries:")
    for i, entry in enumerate(iucn_data[:3]):
        print(f"\n{i+1}. {entry['scientific_name']['value']}")
        print(f"   Vietnamese: {entry['common_name']['value'] or '(none)'}")
        print(f"   English: {entry.get('common_name_en', {}).get('value', '(none)')}")
        print(f"   IUCN: {entry['laws'][0]['value']}")

def main():
    """Main function."""
    script_dir = Path(__file__).parent
    lib_dir = script_dir.parent / "lib"
    
    print("=" * 60)
    print("IUCN Status - Vietnamese Common Names Merger")
    print("=" * 60)
    
    update_iucn_with_vietnamese_names(lib_dir)
    
    print(f"\n" + "=" * 60)
    print("Done!")
    print("=" * 60)

if __name__ == "__main__":
    main()
