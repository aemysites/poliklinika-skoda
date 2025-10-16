/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns (columns24)
  const headerRow = ['Columns (columns24)'];

  // Find the row containing the columns
  const row = element.querySelector('.row');
  if (!row) return;
  // Get all immediate child columns
  const cols = Array.from(row.children);

  // For each column, extract the button/link if present, else empty string
  const columnCells = cols.map((col) => {
    const link = col.querySelector('a');
    return link ? link : '';
  });

  // Build the table rows
  const tableRows = [
    headerRow,
    columnCells,
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
