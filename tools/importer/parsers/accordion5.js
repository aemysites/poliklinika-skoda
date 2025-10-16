/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion5) block parsing
  // Header row must be a single cell, not <th>, and match guidelines
  const rows = [['Accordion (accordion5)']];

  // Find all rows representing accordion items
  // Each row: .row > .col (text) + .col (video)
  const rowEls = element.querySelectorAll(':scope > div.lfr-layout-structure-item-row');

  rowEls.forEach((rowEl) => {
    // Find columns
    const cols = rowEl.querySelectorAll(':scope > div.row > div.col');
    if (cols.length < 2) return;

    // Title cell: left column (full rich text content)
    const leftCol = cols[0];
    let titleCell = leftCol.querySelector('.component-paragraph, [data-lfr-editable-type="rich-text"]');
    if (!titleCell) titleCell = leftCol;

    // Content cell: right column (video placeholder)
    const rightCol = cols[1];
    let contentCell = rightCol.querySelector('.video-url') || rightCol.querySelector('.video-container');
    if (!contentCell) contentCell = rightCol;

    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
