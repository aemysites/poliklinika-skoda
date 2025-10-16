/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns14)'];

  // Find all immediate column divs
  const colDivs = element.querySelectorAll(':scope > div > .col');

  // Defensive: fallback if structure changes (e.g., columns are direct children)
  let columns = [];
  if (colDivs.length) {
    columns = Array.from(colDivs);
  } else {
    // fallback: try direct children
    columns = Array.from(element.children);
  }

  // For each column, extract the image and the label (centered text)
  const columnCells = columns.map((col) => {
    // Find the image (first img in the column)
    const img = col.querySelector('img');
    // Find the label (first strong or div with centered text)
    let label = null;
    // Try strong inside a div with text-align:center
    label = col.querySelector('div[style*="text-align:center"] strong');
    // Fallback: any strong
    if (!label) label = col.querySelector('strong');
    // Fallback: any div with centered text
    if (!label) label = col.querySelector('div[style*="text-align:center"]');
    // Defensive: clone label if it's a text node
    let labelElem = null;
    if (label) {
      labelElem = label.cloneNode(true);
    }
    // Compose cell content: image above label
    const cellContent = [];
    if (img) cellContent.push(img);
    if (labelElem) cellContent.push(document.createElement('br'), labelElem);
    return cellContent;
  });

  // Compose the table rows
  const rows = [
    headerRow,
    columnCells
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
