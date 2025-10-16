/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns18)'];

  // Defensive: get all top-level columns
  // The structure is: div.lfr-layout-structure-item-row > div.row > div.col
  const row = element.querySelector(':scope > div.row');
  const columns = row ? Array.from(row.children) : [];

  // Helper to extract all direct children of a column
  function extractColumnContent(col) {
    const content = [];
    // Find image (only one per column)
    const img = col.querySelector('img');
    if (img) {
      content.push(img);
    }
    // Find all text blocks (p tags)
    // Only direct children of the column's containers
    const textContainers = Array.from(col.querySelectorAll(':scope > div'));
    textContainers.forEach((container) => {
      const paragraphs = Array.from(container.querySelectorAll('p'));
      paragraphs.forEach((p) => {
        content.push(p);
      });
    });
    return content;
  }

  // Extract content for each column
  const colCells = columns.map((col) => {
    const content = extractColumnContent(col);
    // If no content, add an empty string
    return content.length ? content : [''];
  });

  // Build the table rows
  const rows = [
    headerRow,
    colCells
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
