/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero23) block: 1 column, 3 rows
  // Row 1: Header
  const headerRow = ['Hero (hero23)'];

  // Row 2: Background image (none in this case)
  const imageRow = [''];

  // Row 3: Content (heading, subheading, CTA)
  // Find the heading text (h4)
  let headingEl = null;
  // Defensive: search for h1-h6 inside the element
  for (let i = 1; i <= 6; i++) {
    headingEl = element.querySelector(`h${i}`);
    if (headingEl) break;
  }

  // If no heading, fallback to first paragraph or text
  let contentCell;
  if (headingEl) {
    contentCell = headingEl;
  } else {
    // Try to find a paragraph
    const pEl = element.querySelector('p');
    if (pEl) {
      contentCell = pEl;
    } else {
      // Fallback: use all text content
      contentCell = document.createElement('div');
      contentCell.textContent = element.textContent.trim();
    }
  }

  // Compose table rows
  const rows = [
    headerRow,
    imageRow,
    [contentCell]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
