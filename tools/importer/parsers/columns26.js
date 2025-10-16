/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row containing columns
  const row = element.querySelector('.row');
  if (!row) return;
  const columns = Array.from(row.children).filter(col => col.classList.contains('col'));
  if (columns.length < 2) return;

  // Helper: Extract ALL content from a column, including images/icons at the top
  function extractColumnContent(col) {
    const content = [];
    // Find all containers in the column
    const containers = Array.from(col.children).filter(c => c.classList.contains('lfr-layout-structure-item-container'));
    containers.forEach(container => {
      Array.from(container.children).forEach(child => {
        // Image block (should be first/top)
        if (child.classList.contains('lfr-layout-structure-item-basic-component-image')) {
          // Find the actual image (SVG or img)
          const img = child.querySelector('img');
          if (img) {
            // Always clone the image to avoid DOM removal issues
            content.push(img.cloneNode(true));
          }
        }
        // Paragraph block
        else if (child.classList.contains('lfr-layout-structure-item-basic-component-paragraph')) {
          const para = child.querySelector('.component-paragraph');
          if (para) content.push(para.cloneNode(true));
        }
        // Button block
        else if (child.classList.contains('lfr-layout-structure-item-button')) {
          const btn = child.querySelector('.btn');
          if (btn) {
            // Always clone the button before manipulating
            const btnClone = btn.cloneNode(true);
            // Fix: ensure button label is correct (use btn__text if present)
            const btnText = btnClone.querySelector('.btn__text');
            const link = btnClone.querySelector('a');
            if (btnText && link) {
              link.textContent = btnText.textContent;
              btnText.remove();
            }
            content.push(btnClone);
          }
        }
      });
    });
    return content;
  }

  // Extract content for each column
  const colContents = columns.map(extractColumnContent);

  // Each cell is a <div> containing all elements for that column
  const contentRow = colContents.map(items => {
    const cell = document.createElement('div');
    items.forEach(item => cell.appendChild(item));
    return cell;
  });

  // Table header
  const headerRow = ['Columns (columns26)'];

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);
  element.replaceWith(table);
}
