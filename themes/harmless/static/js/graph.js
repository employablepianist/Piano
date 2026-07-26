// Site graph — D3.js force simulation
// Nodes from sitemap.xml, edges from backlinks.json

Promise.all([
  fetch('/sitemap.xml').then(r => r.text()),
  fetch('/backlinks.json').then(r => r.json())
]).then(([sitemapXml, backlinks]) => {
  // Parse sitemap: extract URLs and titles from <loc> tags
  const parser = new DOMParser();
  const xml = parser.parseFromString(sitemapXml, 'text/xml');
  const urls = [...xml.querySelectorAll('loc')]
    .map(loc => {
      const u = loc.textContent;
      // Strip base URL (supports both prod and dev)
      return u.replace('https://4779.ru', '').replace(/^https?:\/\/[^\/]+/, '');
    })
    .filter(u => (u.startsWith('/p/') || u.startsWith('/w/')) && !u.match(/^\/[pw]\/$/));

  // Find actual page titles in ALL links (both outgoing and incoming)
  const allPaths = new Set(urls);

  // Build nodes from sitemap URLs (title = filename from path)
  const nodes = urls.map(url => {
    const parts = url.replace(/\/$/, '').split('/');
    const last = parts[parts.length - 1];
    // Pretty title: replace hyphens with spaces, capitalize
    const title = last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ');
    return {
      id: url,
      title: title,
      section: url.startsWith('/p/') ? 'blog' : 'wiki'
    };
  });

  // Build edge list from backlinks (only between sitemap pages)
  const links = [];
  for (const [target, sources] of Object.entries(backlinks)) {
    if (!allPaths.has(target)) continue;
    for (const src of sources) {
      const srcPath = typeof src === 'string' ? src : src.path;
      if (allPaths.has(srcPath)) {
        links.push({ source: target, target: srcPath });
      }
    }
  }

  // Count backlinks per node
  const backlinkCount = {};
  links.forEach(l => {
    backlinkCount[l.target] = (backlinkCount[l.target] || 0) + 1;
  });

  // Update titles from backlinks
  let titleUpdates = 0;
  for (const [target, sources] of Object.entries(backlinks)) {
    for (const src of sources) {
      const srcData = typeof src === 'string' ? { path: src, title: src } : src;
      const node = nodes.find(n => n.id === srcData.path);
      if (node && srcData.title && !srcData.title.startsWith('/')) {
        node.title = srcData.title;
        titleUpdates++;
      }
    }
  }

  const data = { nodes, links };

  // ── D3 rendering ──
  const width = document.getElementById('graph').clientWidth;
  const height = Math.max(600, window.innerHeight * 0.7);

  const svg = d3.select('#graph')
    .append('svg')
    .attr('viewBox', [0, 0, width, height]);

  const link = svg.append('g')
    .attr('stroke', '#d4d4d4')
    .attr('stroke-opacity', 0.4)
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-width', 0.5);

  const node = svg.append('g')
    .selectAll('a')
    .data(nodes)
    .join('a')
    .attr('href', d => d.id)
    .attr('class', 'node')
    .append('text')
    .text(d => d.title)
    .attr('text-anchor', 'middle')
    .attr('font-size', d => 11 + (backlinkCount[d.id] || 0) * 0.8)
    .attr('fill', d => d.section === 'blog' ? '#3b82f6' : '#555')
    .attr('cursor', 'pointer')
    .on('mouseenter', function(_, d) {
      d3.select(this).attr('font-weight', 'bold').attr('fill', '#3b82f6');
      link.attr('stroke', l => (l.source.id === d.id || l.target.id === d.id) ? '#3b82f6' : '#d4d4d4')
          .attr('stroke-opacity', l => (l.source.id === d.id || l.target.id === d.id) ? 0.8 : 0.4)
          .attr('stroke-width', l => (l.source.id === d.id || l.target.id === d.id) ? 1.5 : 0.5);
      node.attr('opacity', n => (n.id === d.id || links.some(l => (l.source.id === d.id && l.target.id === n.id) || (l.target.id === d.id && l.source.id === n.id))) ? 1 : 0.2);
    })
    .on('mouseleave', function(_, d) {
      d3.select(this).attr('font-weight', null).attr('fill', d.section === 'blog' ? '#3b82f6' : '#555');
      link.attr('stroke', '#d4d4d4').attr('stroke-opacity', 0.4).attr('stroke-width', 0.5);
      node.attr('opacity', 1);
    });

  const sim = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(60).strength(0.4))
    .force('charge', d3.forceManyBody().strength(-20))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(d => Math.max(25, (d.title?.length || 5) * 3)))
    .on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      node
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

  svg.call(d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([0.3, 5])
    .on('zoom', ({transform}) => {
      svg.selectAll('g').attr('transform', transform);
    }));
});
