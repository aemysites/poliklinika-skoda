/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero19) block: 1 column, 3 rows
  // Row 1: block name
  // Row 2: background image (optional, none in this case)
  // Row 3: heading/subheading/cta (text content)

  // Row 1: header
  const headerRow = ['Hero (hero19)'];

  // Row 2: background image (none in this HTML)
  const bgRow = [''];

  // Row 3: text content
  // Instead of passing the original element, pass its inner HTML as a string
  const contentRow = [element.innerHTML];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
