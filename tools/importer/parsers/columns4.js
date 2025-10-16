/* global WebImporter */
export default function parse(element, { document }) {
  // Find the left and right columns
  const leftCol = element.querySelector('.opening-time__table');
  const rightCol = element.querySelector('.opening-time__info');
  if (!leftCol || !rightCol) return;

  // --- LEFT COLUMN CONTENT ---
  // Only include the sa-table (heading, subtitle, table) and the colored time breakdown paragraph
  const leftColContent = [];
  const saTable = leftCol.querySelector('.sa-table');
  if (saTable) leftColContent.push(saTable);
  // Find the colored time breakdown paragraph (yellow text)
  const extraTimeParagraph = element.querySelector('.component-paragraph');
  if (extraTimeParagraph) leftColContent.push(extraTimeParagraph);

  // --- RIGHT COLUMN CONTENT ---
  // Only include content from .opening-time__info (do not duplicate leftCol content)
  // Get all direct children of .opening-time__info that are not spacers
  const rightColContent = [];
  Array.from(rightCol.children).forEach(child => {
    if (!child.className.includes('spacer')) {
      rightColContent.push(child);
    }
  });

  // --- TABLE STRUCTURE ---
  const headerRow = ['Columns (columns4)'];
  const columnsRow = [leftColContent, rightColContent];
  const cells = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
