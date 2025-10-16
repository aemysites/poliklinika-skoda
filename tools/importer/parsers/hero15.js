/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero15)'];

  // 2. Find the hero-image block (the main content block)
  const heroImage = element.querySelector('.hero-image');
  const heroBlock = heroImage || element;

  // 3. Extract the background image (picture/img)
  let bgImage = null;
  if (heroBlock) {
    bgImage = heroBlock.querySelector('picture') || heroBlock.querySelector('img');
  }

  // 4. Extract all possible headline and subheadline text content
  // This ensures we don't miss text by only picking the first match
  const contentCell = [];
  // Headline(s)
  const headlineWrappers = heroBlock.querySelectorAll('.hero-image__headline');
  headlineWrappers.forEach(hw => {
    hw.querySelectorAll('p, h1, h2, h3, h4, h5, h6').forEach(el => {
      if (el.textContent && el.textContent.trim()) contentCell.push(el.cloneNode(true));
    });
  });
  // Subheadline(s)
  const subheadlineWrappers = heroBlock.querySelectorAll('.hero-image__subheadline');
  subheadlineWrappers.forEach(sw => {
    sw.querySelectorAll('p, h1, h2, h3, h4, h5, h6').forEach(el => {
      if (el.textContent && el.textContent.trim()) contentCell.push(el.cloneNode(true));
    });
  });
  // Also include any h1-h6, p inside heroBlock that aren't in headline/subheadline
  heroBlock.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach(el => {
    // Avoid duplicates
    if (!contentCell.some(node => node.textContent === el.textContent) && el.textContent && el.textContent.trim()) {
      contentCell.push(el.cloneNode(true));
    }
  });

  // 5. Extract CTA (optional)
  const actions = heroBlock.querySelector('.hero-image__actions, .hero-image__links');
  if (actions) {
    actions.querySelectorAll('a, button').forEach(cta => {
      contentCell.push(cta.cloneNode(true));
    });
  }

  // 6. Build the table rows
  const rows = [
    headerRow,
    [bgImage ? bgImage : ''],
    [contentCell.length ? contentCell : '']
  ];

  // 7. Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
