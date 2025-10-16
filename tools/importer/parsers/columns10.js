/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns10)'];

  // Defensive: get immediate column divs
  const row = element.querySelector('.row');
  if (!row) return;
  const columns = row.children;

  // First column: image only
  let leftCell = null;
  const leftCol = columns[0];
  if (leftCol) {
    // Find the image inside the left column
    const img = leftCol.querySelector('img');
    if (img) {
      leftCell = img;
    } else {
      leftCell = document.createTextNode('');
    }
  }

  // Second column: heading, paragraph, button
  let rightCellContent = [];
  const rightCol = columns[1];
  if (rightCol) {
    // Find heading, paragraph, button
    const heading = rightCol.querySelector('h4');
    if (heading) rightCellContent.push(heading);
    const paragraph = rightCol.querySelector('p');
    if (paragraph) rightCellContent.push(paragraph);
    const button = rightCol.querySelector('a');
    if (button) rightCellContent.push(button);
  }

  // Build table rows
  const cells = [
    headerRow,
    [leftCell, rightCellContent]
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
