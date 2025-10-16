/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct children divs
  const directDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Find the logo image (SVG or IMG)
  let logoImg = null;
  for (const div of directDivs) {
    const img = div.querySelector('img');
    if (img && img.src && img.src.includes('skofit-1-svg')) {
      logoImg = img;
      break;
    }
  }

  // Find heading (h1)
  let heading = null;
  for (const div of directDivs) {
    const h1 = div.querySelector('h1');
    if (h1) {
      heading = h1;
      break;
    }
  }

  // Find subheading/paragraph
  let subheading = null;
  for (const div of directDivs) {
    const p = div.querySelector('p');
    if (p) {
      subheading = p;
      break;
    }
  }

  // Find CTA buttons (two main CTAs)
  let ctaButtons = [];
  // First, look for row with columns (the button group)
  for (const div of directDivs) {
    const row = div.querySelector('.row');
    if (row) {
      // Find all anchor tags with button classes inside columns
      const colDivs = Array.from(row.querySelectorAll('.col'));
      for (const col of colDivs) {
        const btn = col.querySelector('a.btn');
        if (btn) {
          ctaButtons.push(btn);
        }
      }
    }
  }

  // Defensive: If no buttons found, look for any .btn in direct children
  if (ctaButtons.length === 0) {
    for (const div of directDivs) {
      const btn = div.querySelector('a.btn');
      if (btn) ctaButtons.push(btn);
    }
  }

  // Compose the content for row 3: logo, heading, subheading, buttons
  const contentRow = [];
  if (logoImg) contentRow.push(logoImg);
  if (heading) contentRow.push(heading);
  if (subheading) contentRow.push(subheading);
  if (ctaButtons.length) {
    // Group buttons in a div for horizontal layout
    const btnGroup = document.createElement('div');
    btnGroup.style.display = 'flex';
    btnGroup.style.gap = '1em';
    ctaButtons.forEach(btn => btnGroup.appendChild(btn));
    contentRow.push(btnGroup);
  }

  // Find background image from style attribute on the top-level element
  let bgImgUrl = null;
  const bgStyle = element.getAttribute('style');
  if (bgStyle) {
    const match = bgStyle.match(/url\(([^)]+)\)/);
    if (match && match[1]) {
      bgImgUrl = match[1].replace(/^['"]|['"]$/g, '');
    }
  }
  // Defensive: If not found, look for a direct image child
  if (!bgImgUrl) {
    for (const div of directDivs) {
      const img = div.querySelector('img');
      if (img && img.src) {
        bgImgUrl = img.src;
        break;
      }
    }
  }

  // Create background image element if found
  let bgImgEl = null;
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = '';
    bgImgEl.style.width = '100%';
  }

  // Build table rows
  const headerRow = ['Hero (hero31)'];
  const bgRow = [bgImgEl ? bgImgEl : ''];
  const contentRowArr = [contentRow];

  const cells = [headerRow, bgRow, contentRowArr];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
