#!/usr/bin/env python3
"""
Quick test of the Vietnam Red List fetcher with the Elephas maximus example.
"""

import sys
import os

# Add the scripts directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fetch_vnredlist_status import fetch_conservation_status, scientific_name_to_url_slug, BASE_URL

def test_elephas_maximus():
    """Test with the example species: Elephas maximus"""
    scientific_name = "Elephas maximus"
    
    print("Testing Vietnam Red List Fetcher")
    print("=" * 50)
    print(f"\nTest species: {scientific_name}")
    
    # Test URL generation
    slug = scientific_name_to_url_slug(scientific_name)
    url = f"{BASE_URL}/{slug}/"
    print(f"Generated URL: {url}")
    print(f"Expected URL: http://vnredlist.vast.vn/elephas-maximus/")
    
    # Test status fetching
    print(f"\nFetching conservation status...")
    status = fetch_conservation_status(scientific_name)
    
    if status:
        print(f"\n✓ SUCCESS!")
        print(f"  Conservation Status: {status}")
        print(f"  Expected: CR (Critically Endangered)")
    else:
        print(f"\n✗ FAILED to fetch status")
        return False
    
    return True

if __name__ == '__main__':
    success = test_elephas_maximus()
    sys.exit(0 if success else 1)
