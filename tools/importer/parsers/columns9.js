/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // 1. Header row
  const headerRow = ['Columns (columns9)'];

  // 2. Find the main row with columns
  // The structure is: element > ... > row (with class 'row') > col (left) and col (right)
  const row = element.querySelector('.row');
  if (!row) return;

  // Get columns
  const cols = row.querySelectorAll(':scope > .col');
  if (cols.length < 2) return;

  // Left column: contains the date (number and month)
  // Find the first paragraph block in col[0] (with h3 and month)
  const leftColBlocks = cols[0].querySelectorAll('.component-paragraph');
  let leftColContent = [];
  leftColBlocks.forEach(block => {
    // Only add non-empty blocks
    if (block && block.textContent.trim()) leftColContent.push(block);
  });
  // Defensive: if nothing found, fallback to col[0] content
  if (leftColContent.length === 0) leftColContent = [cols[0]];

  // Right column: event info (heading and description)
  const rightColBlocks = cols[1].querySelectorAll('.component-paragraph');
  let rightColContent = [];
  rightColBlocks.forEach(block => {
    if (block && block.textContent.trim()) rightColContent.push(block);
  });
  if (rightColContent.length === 0) rightColContent = [cols[1]];

  // 2nd row: two columns
  const contentRow = [leftColContent, rightColContent];

  // Build table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(table);
}
