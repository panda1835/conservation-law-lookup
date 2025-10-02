#!/usr/bin/env python3
"""
Script to convert CSV file to JSON format similar to images.json
with an additional 'source' field.
"""

import csv
import json
import sys

def csv_to_json(csv_file_path, output_json_path=None):
    """
    Convert CSV file to JSON format with structure:
    {
        "Species Name": [
            {
                "image_url": "URL",
                "attribute": "Attribution text",
                "source": "Source text"
            }
        ]
    }
    
    Args:
        csv_file_path: Path to input CSV file
        output_json_path: Path to output JSON file (optional)
    """
    # Dictionary to store the data
    species_data = {}
    
    # Read CSV file
    with open(csv_file_path, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        
        for row in reader:
            species_name = row['Tên khoa học'].strip()
            image_url = row['URL ảnh'].strip()
            author = row['Tác giả'].strip()
            source = row['Nguồn'].strip()
            
            # Create the image data object
            image_data = {
                "image_url": image_url,
                "attribute": author,
                "source": source
            }
            
            # Add to species_data dictionary
            if species_name in species_data:
                # If species already exists, append to its list
                species_data[species_name].append(image_data)
            else:
                # Create new entry with a list
                species_data[species_name] = [image_data]
    
    # Convert to JSON
    json_output = json.dumps(species_data, indent=4, ensure_ascii=False)
    
    # Output to file or stdout
    if output_json_path:
        with open(output_json_path, 'w', encoding='utf-8') as jsonfile:
            jsonfile.write(json_output)
        print(f"JSON file created successfully: {output_json_path}")
    else:
        print(json_output)
    
    return species_data

if __name__ == "__main__":
    # Get file paths from command line arguments
    if len(sys.argv) < 2:
        print("Usage: python csv_to_json.py <input_csv_file> [output_json_file]")
        print("Example: python csv_to_json.py 'Rùa - Luật.csv' output.json")
        sys.exit(1)
    
    input_csv = sys.argv[1]
    output_json = sys.argv[2] if len(sys.argv) > 2 else None
    
    try:
        csv_to_json(input_csv, output_json)
    except FileNotFoundError:
        print(f"Error: File '{input_csv}' not found.")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
