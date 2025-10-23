// Graph visualization using D3.js
(function() {
    'use strict';

    // Configuration
    const config = {
        width: 0,  // Will be set dynamically
        height: 600,
        nodeRadius: 8,
        linkDistance: 100,
        chargeStrength: -300,
        collisionRadius: 30
    };

    let svg, simulation, link, node, label;
    let graphData = null;
    let showLabels = true;

    // Initialize the visualization
    function init() {
        const container = document.getElementById('graph');
        config.width = container.clientWidth;

        // Load and display data
        loadData();

        // Setup event listeners
        document.getElementById('resetBtn').addEventListener('click', resetView);
        document.getElementById('expandBtn').addEventListener('click', expandAll);
        document.getElementById('collapseBtn').addEventListener('click', collapseAll);
        document.getElementById('showLabelsToggle').addEventListener('change', toggleLabels);

        // Handle window resize
        window.addEventListener('resize', handleResize);
    }

    // Load data from JSON file
    async function loadData() {
        try {
            const response = await fetch('data/menu-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            graphData = await response.json();
            
            document.getElementById('loading').style.display = 'none';
            document.getElementById('error').style.display = 'none';
            
            createGraph(graphData);
        } catch (error) {
            console.error('Error loading data:', error);
            document.getElementById('loading').style.display = 'none';
            const errorDiv = document.getElementById('error');
            errorDiv.textContent = `Error loading data: ${error.message}. Make sure data/menu-data.json exists.`;
            errorDiv.style.display = 'block';
        }
    }

    // Convert hierarchical data to graph format
    function hierarchyToGraph(data) {
        const nodes = [];
        const links = [];

        function traverse(node, parent = null) {
            const nodeData = {
                id: nodes.length,
                name: node.name,
                url: node.url,
                children: node.children || [],
                level: parent ? parent.level + 1 : 0
            };
            nodes.push(nodeData);

            if (parent) {
                links.push({
                    source: parent.id,
                    target: nodeData.id
                });
            }

            if (node.children && node.children.length > 0) {
                node.children.forEach(child => traverse(child, nodeData));
            }
        }

        traverse(data);
        return { nodes, links };
    }

    // Create the graph visualization
    function createGraph(data) {
        const container = document.getElementById('graph');
        container.innerHTML = ''; // Clear previous graph

        const { nodes, links } = hierarchyToGraph(data);

        // Create SVG
        svg = d3.select('#graph')
            .append('svg')
            .attr('width', config.width)
            .attr('height', config.height);

        // Add zoom behavior
        const g = svg.append('g');
        
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });
        
        svg.call(zoom);

        // Create arrow marker for links
        svg.append('defs').selectAll('marker')
            .data(['end'])
            .enter().append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 20)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#999');

        // Create force simulation
        simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(config.linkDistance))
            .force('charge', d3.forceManyBody().strength(config.chargeStrength))
            .force('center', d3.forceCenter(config.width / 2, config.height / 2))
            .force('collision', d3.forceCollide().radius(config.collisionRadius));

        // Create links
        link = g.append('g')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .attr('class', 'link')
            .attr('marker-end', 'url(#arrowhead)');

        // Create nodes
        const nodeGroup = g.append('g')
            .selectAll('g')
            .data(nodes)
            .enter().append('g')
            .attr('class', 'node')
            .call(drag(simulation));

        node = nodeGroup.append('circle')
            .attr('r', d => d.level === 0 ? config.nodeRadius * 2 : config.nodeRadius)
            .attr('fill', d => {
                const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];
                return colors[d.level % colors.length];
            })
            .on('click', handleNodeClick)
            .on('mouseover', handleNodeMouseOver)
            .on('mouseout', handleNodeMouseOut);

        // Create labels
        label = nodeGroup.append('text')
            .text(d => d.name)
            .attr('x', 12)
            .attr('y', 4)
            .style('font-size', d => d.level === 0 ? '14px' : '12px')
            .style('font-weight', d => d.level === 0 ? 'bold' : 'normal')
            .style('fill', '#333')
            .style('display', showLabels ? 'block' : 'none');

        // Update positions on each tick
        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            nodeGroup.attr('transform', d => `translate(${d.x},${d.y})`);
        });
    }

    // Drag behavior
    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }

    // Handle node click
    function handleNodeClick(event, d) {
        event.stopPropagation();
        showNodeInfo(d);
    }

    // Handle node mouse over
    function handleNodeMouseOver(event, d) {
        d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('r', (d.level === 0 ? config.nodeRadius * 2 : config.nodeRadius) * 1.5);
    }

    // Handle node mouse out
    function handleNodeMouseOut(event, d) {
        d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('r', d.level === 0 ? config.nodeRadius * 2 : config.nodeRadius);
    }

    // Show node information
    function showNodeInfo(d) {
        const panel = document.getElementById('infoPanel');
        const title = document.getElementById('infoTitle');
        const url = document.getElementById('infoUrl');
        const children = document.getElementById('infoChildren');

        title.textContent = d.name;
        url.textContent = d.url;
        url.href = d.url;
        children.textContent = d.children.length;

        panel.classList.add('active');
    }

    // Reset view to initial position
    function resetView() {
        if (svg) {
            svg.transition()
                .duration(750)
                .call(d3.zoom().transform, d3.zoomIdentity);
        }
        if (simulation) {
            simulation.alpha(1).restart();
        }
    }

    // Expand all nodes
    function expandAll() {
        // This is a placeholder - would need actual expand/collapse logic
        console.log('Expand all nodes');
    }

    // Collapse all nodes
    function collapseAll() {
        // This is a placeholder - would need actual expand/collapse logic
        console.log('Collapse all nodes');
    }

    // Toggle label visibility
    function toggleLabels(event) {
        showLabels = event.target.checked;
        if (label) {
            label.style('display', showLabels ? 'block' : 'none');
        }
    }

    // Handle window resize
    function handleResize() {
        const container = document.getElementById('graph');
        config.width = container.clientWidth;

        if (svg) {
            svg.attr('width', config.width);
            
            if (simulation) {
                simulation.force('center', d3.forceCenter(config.width / 2, config.height / 2));
                simulation.alpha(0.3).restart();
            }
        }
    }

    // Start the application when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
