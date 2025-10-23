# Arduino.ua Menu Graph Visualization

An interactive visualization of the Arduino.ua website menu structure, built with Python web scraping and D3.js graph visualization.

🌐 **[View Live Demo](https://flashbag.github.io/arduino.ua-menu-graph/)**

## 📋 Overview

This project consists of two main components:

1. **Python Web Scraper** - Extracts menu structure from arduino.ua website
2. **JavaScript Graph Viewer** - Visualizes the menu hierarchy as an interactive graph

## 🚀 Features

- **Automated Scraping**: GitHub Actions workflow runs daily to fetch latest menu structure
- **Interactive Visualization**: 
  - Zoom and pan
  - Drag nodes
  - Click nodes to view details
  - Toggle labels on/off
  - Responsive design
- **Beautiful UI**: Gradient background and smooth animations
- **GitHub Pages**: Automatically deployed for public access

## 🏗️ Project Structure

```
.
├── scraper.py              # Python web scraper
├── requirements.txt        # Python dependencies
├── index.html             # Main HTML page
├── graph.js               # D3.js visualization logic
├── data/
│   └── menu-data.json     # Scraped menu data (generated)
└── .github/
    └── workflows/
        └── deploy.yml     # GitHub Actions workflow
```

## 🛠️ Local Development

### Prerequisites

- Python 3.8+
- Modern web browser
- (Optional) Local web server for testing

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/flashbag/arduino.ua-menu-graph.git
   cd arduino.ua-menu-graph
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the scraper**:
   ```bash
   python scraper.py
   ```
   This will create `data/menu-data.json` with the scraped menu structure.

4. **View the visualization**:
   
   Open `index.html` in a web browser, or use a local server:
   
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```
   
   Then navigate to `http://localhost:8000`

## 📦 Dependencies

### Python (scraper)
- `requests` - HTTP library for fetching web pages
- `beautifulsoup4` - HTML parsing library
- `lxml` - XML/HTML parser

### JavaScript (viewer)
- `D3.js v7` - Data visualization library (loaded via CDN)

## 🔄 Automated Deployment

The project uses GitHub Actions to:
1. Run the scraper daily at midnight UTC
2. Generate fresh menu data
3. Deploy to GitHub Pages automatically

The workflow is also triggered on:
- Push to main branch
- Manual workflow dispatch

## 🎨 Customization

### Modify Scraping Logic

Edit `scraper.py` to change:
- Target URL
- HTML selectors
- Data structure
- Error handling

### Customize Visualization

Edit `graph.js` and `index.html` to modify:
- Colors and styling
- Node sizes and spacing
- Force simulation parameters
- UI controls

## 📊 Data Format

The scraped data is stored in JSON format:

```json
{
  "name": "Root Node",
  "url": "https://example.com",
  "children": [
    {
      "name": "Child Node",
      "url": "https://example.com/child",
      "children": []
    }
  ]
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🔗 Links

- [Live Demo](https://flashbag.github.io/arduino.ua-menu-graph/)
- [Arduino.ua Website](https://arduino.ua)
- [D3.js Documentation](https://d3js.org/)

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.