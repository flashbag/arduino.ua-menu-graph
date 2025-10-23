#!/usr/bin/env python3
"""
Simple test for the scraper module
"""

import json
import os
import sys

def test_scraper():
    """Test the scraper functionality"""
    print("Testing scraper...")
    
    # Import the scraper
    try:
        import scraper
    except ImportError as e:
        print(f"❌ Failed to import scraper: {e}")
        return False
    
    # Test the scrape_menu function
    try:
        result = scraper.scrape_menu("https://arduino.ua")
        
        # Validate structure
        assert "name" in result, "Missing 'name' field"
        assert "url" in result, "Missing 'url' field"
        assert "children" in result, "Missing 'children' field"
        assert isinstance(result["children"], list), "children should be a list"
        
        print(f"✓ Scraper returned valid structure")
        print(f"✓ Root name: {result['name']}")
        print(f"✓ Children count: {len(result['children'])}")
        
        # Validate children structure
        if result["children"]:
            child = result["children"][0]
            assert "name" in child, "Child missing 'name' field"
            assert "url" in child, "Child missing 'url' field"
            assert "children" in child, "Child missing 'children' field"
            print(f"✓ Child structure is valid")
        
        return True
        
    except Exception as e:
        print(f"❌ Scraper test failed: {e}")
        return False

def test_json_output():
    """Test that JSON output is valid"""
    print("\nTesting JSON output...")
    
    json_file = "data/menu-data.json"
    
    if not os.path.exists(json_file):
        print(f"⚠ JSON file not found at {json_file}, running scraper...")
        import scraper
        scraper.main()
    
    try:
        with open(json_file, 'r') as f:
            data = json.load(f)
        
        print(f"✓ JSON file is valid")
        print(f"✓ Top-level items: {len(data.get('children', []))}")
        return True
        
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON: {e}")
        return False
    except Exception as e:
        print(f"❌ Error reading JSON: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("Running scraper tests")
    print("=" * 50)
    
    test1 = test_scraper()
    test2 = test_json_output()
    
    print("\n" + "=" * 50)
    if test1 and test2:
        print("✓ All tests passed!")
        sys.exit(0)
    else:
        print("❌ Some tests failed")
        sys.exit(1)
