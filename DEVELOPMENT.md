# Developer Guide

## Architecture

### Components

1. **Web Scraper (Python)**
   - Location: `scraper.py`
   - Purpose: Extract menu structure from arduino.ua
   - Output: JSON data in `data/menu-data.json`
   - Dependencies: requests, beautifulsoup4, lxml

2. **Graph Viewer (JavaScript)**
   - Location: `graph.js`, `index.html`
   - Purpose: Interactive visualization of menu data
   - Technology: D3.js v7 force-directed graph
   - Features: zoom, pan, drag, node info display

3. **CI/CD Pipeline**
   - Location: `.github/workflows/deploy.yml`
   - Triggers: push to main, daily schedule, manual
   - Actions: scrape data → deploy to GitHub Pages

## Data Flow

```
arduino.ua → scraper.py → data/menu-data.json → graph.js → D3.js visualization
```

## Local Development

### Running the Scraper

```bash
python3 scraper.py
```

This creates/updates `data/menu-data.json`.

### Testing the Scraper

```bash
python3 test_scraper.py
```

### Viewing the Visualization

Start a local server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Customization

### Modifying the Scraper

Edit `scraper.py`:

- **Change target URL**: Modify the `url` parameter in `scrape_menu()`
- **Adjust selectors**: Update the BeautifulSoup selectors to match your target site's HTML structure
- **Modify data structure**: Change the output format in the `menu_data` dictionary

### Customizing the Visualization

Edit `graph.js`:

- **Colors**: Modify the `fill` attribute in node creation
- **Layout**: Adjust force simulation parameters:
  - `linkDistance`: Distance between connected nodes
  - `chargeStrength`: Repulsion/attraction force
  - `collisionRadius`: Node collision detection
- **Node sizes**: Change `config.nodeRadius`

Edit `index.html`:

- **Styling**: Update CSS in `<style>` section
- **UI controls**: Add/remove buttons in `.controls` section

## Data Format

### Input (scraped data)

```json
{
  "name": "Root",
  "url": "https://example.com",
  "children": [
    {
      "name": "Child",
      "url": "https://example.com/child",
      "children": []
    }
  ]
}
```

### Processing

The `hierarchyToGraph()` function in `graph.js` converts this hierarchical structure into:

- **Nodes array**: Each node has `id`, `name`, `url`, `children`, `level`
- **Links array**: Each link has `source` and `target` (node IDs)

## Deployment

### GitHub Pages Configuration

The project automatically deploys to GitHub Pages via GitHub Actions:

1. Workflow runs on push to main branch
2. Scraper executes and generates fresh data
3. Static files deployed to gh-pages branch
4. Site available at `https://[username].github.io/[repo-name]`

### Manual Deployment

To trigger a deployment manually:

1. Go to Actions tab in GitHub
2. Select "Scrape and Deploy to GitHub Pages"
3. Click "Run workflow"

## Troubleshooting

### Scraper Issues

**Problem**: Connection errors when scraping
- **Solution**: The scraper includes fallback sample data. Check your internet connection and target site availability.

**Problem**: Wrong data extracted
- **Solution**: The target site's HTML structure may have changed. Update the CSS selectors in `scraper.py`.

### Visualization Issues

**Problem**: Graph doesn't display
- **Solution**: Check browser console for errors. Ensure `data/menu-data.json` exists and D3.js loads correctly.

**Problem**: Nodes overlap too much
- **Solution**: Adjust `chargeStrength` (more negative = more repulsion) and `linkDistance` in `graph.js`.

### GitHub Actions Issues

**Problem**: Workflow fails
- **Solution**: Check Actions logs. Common issues:
  - Python dependency installation failures
  - Scraper timeouts
  - GitHub Pages not enabled in repository settings

## Best Practices

1. **Error Handling**: The scraper includes error handling and fallback data
2. **Rate Limiting**: Consider adding delays between requests when scraping multiple pages
3. **Caching**: GitHub Actions caches Python dependencies for faster builds
4. **Testing**: Run `test_scraper.py` before committing changes
5. **Security**: Use CodeQL and dependency scanning (included in workflow)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## Resources

- [D3.js Documentation](https://d3js.org/)
- [BeautifulSoup Documentation](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
