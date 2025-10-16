/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Video (video38)
  const headerRow = ['Video (video38)'];

  // Extract all text content from the original HTML (including hidden alert text)
  let textContent = '';
  const alert = element.querySelector('.error-message');
  if (alert) {
    textContent = Array.from(alert.querySelectorAll('p'))
      .map(p => p.textContent.trim())
      .filter(Boolean)
      .join(' ');
  }

  const contentRow = [textContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
