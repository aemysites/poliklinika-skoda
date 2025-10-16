/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Columns (columns13)'];

  // Find the row containing columns
  const row = element.querySelector('.row');
  if (!row) return;
  const columns = Array.from(row.children).filter(col => col.classList.contains('col'));
  if (columns.length < 2) return;

  // For each column, extract BOTH the anchor link and the button label
  const cells = columns.map(col => {
    const btn = col.querySelector('.btn');
    if (!btn) return '';
    const link = btn.querySelector('a');
    const btnText = btn.querySelector('.btn__text');
    // Compose cell: anchor (if present) and label (if present)
    const cellContent = [];
    if (link) {
      // Clone the anchor so we don't move it from the DOM
      const a = link.cloneNode(true);
      cellContent.push(a);
    }
    if (btnText) {
      cellContent.push(document.createTextNode(btnText.textContent.trim()));
    }
    return cellContent.length === 1 ? cellContent[0] : cellContent;
  });

  // Compose the table rows
  const tableRows = [
    headerRow,
    cells
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
