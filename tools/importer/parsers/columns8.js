/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns8)'];

  // Find all direct column divs (Bootstrap grid system)
  // Defensive: Only select direct children columns
  const row = element.querySelector('.row');
  const columns = row ? Array.from(row.children).filter(col => col.classList.contains('col')) : [];

  // Edge case: If no columns found, do nothing
  if (columns.length === 0) return;

  // For each column, extract the image and the text
  const columnCells = columns.map((col) => {
    // Find the image (first img in the column)
    const img = col.querySelector('img');
    // Find the text (first p in the column)
    const text = col.querySelector('p');

    // Defensive: only include elements if they exist
    const cellContent = [];
    if (img) cellContent.push(img);
    if (text) cellContent.push(text);
    return cellContent;
  });

  // Build the table rows
  const tableRows = [
    headerRow,
    columnCells
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
