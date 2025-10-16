/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns34)'];

  // Find the row containing columns
  let rowDiv = element.querySelector('.row');
  if (!rowDiv) {
    rowDiv = element.querySelector('div[class*="row"]');
  }
  if (!rowDiv) {
    rowDiv = element;
  }

  // Each column is a .col inside the row
  const colDivs = Array.from(rowDiv.querySelectorAll(':scope > .col'));
  const columns = colDivs.length ? colDivs : Array.from(rowDiv.children);

  // Build the columns row
  const columnsRow = columns.map((col) => {
    // Find the image (icon)
    const img = col.querySelector('img');
    // Find the paragraph block (label + link)
    const para = col.querySelector('.component-paragraph');
    let fragment = document.createElement('div');
    if (img) fragment.appendChild(img);
    if (para) {
      // Only append the inner content to avoid extra wrappers
      Array.from(para.childNodes).forEach((node) => fragment.appendChild(node.cloneNode(true)));
    }
    // If nothing found, fallback to col's children
    if (!img && !para) {
      Array.from(col.childNodes).forEach((node) => fragment.appendChild(node.cloneNode(true)));
    }
    return fragment.childNodes.length === 1 ? fragment.firstChild : fragment;
  });

  // Compose the table
  const cells = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
