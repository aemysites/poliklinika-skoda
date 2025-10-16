/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children with a selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(child => child.matches(selector));
  }

  // Find left and right columns
  // The structure is: opening-time__table (left), opening-time__info (right)
  const leftCol = element.querySelector('.opening-time__table');
  const rightCol = element.querySelector('.opening-time__info');

  // Defensive: if not found, fallback to first two children
  let leftContent = leftCol;
  let rightContent = rightCol;
  if (!leftContent || !rightContent) {
    // Try to find columns by order
    const cols = element.querySelectorAll(':scope > div > div');
    leftContent = cols[0] || null;
    rightContent = cols[1] || null;
  }

  // Compose left column cell
  // For left: grab the sa-table block (contains title, subtitle, table, caption), and any paragraphs below
  let leftCellContent = [];
  if (leftContent) {
    // Find the sa-table block
    const saTable = leftContent.querySelector('.sa-table');
    if (saTable) leftCellContent.push(saTable);
    // Find any paragraphs or warnings below the table (e.g., .component-paragraph)
    // These are direct children after the sa-table
    const extraParas = getDirectChildren(leftContent, '.lfr-layout-structure-item-basic-component-paragraph');
    extraParas.forEach(para => {
      leftCellContent.push(para);
    });
    // Also include any .text-warning spans that are not inside .component-paragraph (for completeness)
    const warningSpans = leftContent.querySelectorAll('.text-warning');
    warningSpans.forEach(span => {
      // Only add if not already included in extraParas
      if (!leftCellContent.includes(span)) {
        leftCellContent.push(span);
      }
    });
  }

  // Compose right column cell
  // For right: grab ALL content inside opening-time__info, preserving semantic block structure
  let rightCellContent = [];
  if (rightContent) {
    // Only add meaningful children (skip spacers)
    Array.from(rightContent.children).forEach(child => {
      if (child.classList && child.classList.contains('spacer')) return;
      // For each child, push the child itself (preserving block structure)
      rightCellContent.push(child);
    });
  }

  // Table structure
  // Header row: always block name
  const headerRow = ['Columns (columns1)'];
  // Second row: left and right columns
  const secondRow = [leftCellContent, rightCellContent];

  // Create table
  const cells = [headerRow, secondRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(block);
}
