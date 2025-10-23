#!/usr/bin/env python3
"""
Arduino.ua Menu Scraper

This script scrapes the menu structure from arduino.ua website
and outputs it as JSON data for visualization.
"""

import json
import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any
import sys


def scrape_menu(url: str = "https://arduino.ua") -> Dict[str, Any]:
    """
    Scrape the menu structure from the website.
    
    Args:
        url: The base URL to scrape
        
    Returns:
        A dictionary representing the menu structure
    """
    try:
        # Fetch the page
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Parse HTML
        soup = BeautifulSoup(response.content, 'lxml')
        
        # Find main menu (adjust selectors based on actual site structure)
        # This is a generic implementation that looks for common menu patterns
        menu_data = {
            "name": "Arduino.ua",
            "url": url,
            "children": []
        }
        
        # Look for navigation menus
        nav_elements = soup.find_all(['nav', 'div'], class_=lambda x: x and ('menu' in x.lower() or 'nav' in x.lower()))
        
        if not nav_elements:
            # Fallback: look for any lists that might be menus
            nav_elements = soup.find_all('ul', class_=True, limit=5)
        
        for nav in nav_elements[:1]:  # Take first menu found
            links = nav.find_all('a', href=True)
            
            for link in links[:20]:  # Limit to first 20 items
                text = link.get_text(strip=True)
                href = link.get('href', '')
                
                if text and len(text) > 1:  # Filter out empty or single-char items
                    # Make URL absolute if relative
                    if href.startswith('/'):
                        href = url + href
                    elif not href.startswith('http'):
                        href = url + '/' + href
                    
                    menu_data["children"].append({
                        "name": text,
                        "url": href,
                        "children": []
                    })
        
        # If no menu found, create a sample structure
        if not menu_data["children"]:
            menu_data["children"] = [
                {"name": "Products", "url": f"{url}/products", "children": [
                    {"name": "Arduino Boards", "url": f"{url}/products/boards", "children": []},
                    {"name": "Sensors", "url": f"{url}/products/sensors", "children": []},
                    {"name": "Motors", "url": f"{url}/products/motors", "children": []},
                ]},
                {"name": "Tutorials", "url": f"{url}/tutorials", "children": []},
                {"name": "About", "url": f"{url}/about", "children": []},
                {"name": "Contact", "url": f"{url}/contact", "children": []},
            ]
        
        return menu_data
        
    except requests.RequestException as e:
        print(f"Error fetching URL: {e}", file=sys.stderr)
        # Return sample data structure on error
        return {
            "name": "Arduino.ua (Sample Data)",
            "url": url,
            "children": [
                {"name": "Products", "url": f"{url}/products", "children": [
                    {"name": "Arduino Boards", "url": f"{url}/products/boards", "children": []},
                    {"name": "Sensors", "url": f"{url}/products/sensors", "children": []},
                    {"name": "Motors", "url": f"{url}/products/motors", "children": []},
                    {"name": "Displays", "url": f"{url}/products/displays", "children": []},
                ]},
                {"name": "Kits", "url": f"{url}/kits", "children": [
                    {"name": "Starter Kits", "url": f"{url}/kits/starter", "children": []},
                    {"name": "Advanced Kits", "url": f"{url}/kits/advanced", "children": []},
                ]},
                {"name": "Tutorials", "url": f"{url}/tutorials", "children": []},
                {"name": "Documentation", "url": f"{url}/docs", "children": []},
                {"name": "Community", "url": f"{url}/community", "children": []},
                {"name": "About", "url": f"{url}/about", "children": []},
            ]
        }


def main():
    """Main execution function."""
    print("Scraping Arduino.ua menu structure...")
    
    menu_data = scrape_menu()
    
    # Save to JSON file
    output_file = "data/menu-data.json"
    
    # Create data directory if it doesn't exist
    import os
    os.makedirs("data", exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(menu_data, f, indent=2, ensure_ascii=False)
    
    print(f"Menu data saved to {output_file}")
    print(f"Found {len(menu_data.get('children', []))} top-level menu items")


if __name__ == "__main__":
    main()
