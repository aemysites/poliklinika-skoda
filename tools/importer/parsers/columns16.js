/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct child by class
  function getDirectChild(parent, className) {
    return Array.from(parent.children).find((el) => el.classList && el.classList.contains(className));
  }

  // Find the main footer holder
  const footerHolder = element.querySelector('.sa-footer__holder');
  if (!footerHolder) return;

  // Get the columns: links, contact, other-links, copyright
  const links = getDirectChild(footerHolder, 'sa-footer__links');
  const contact = getDirectChild(footerHolder, 'sa-footer__contact');
  const otherLinks = getDirectChild(footerHolder, 'sa-footer__other-links');
  const copyright = getDirectChild(footerHolder, 'sa-footer__copyright');

  // --- First Row: Block Name ---
  const headerRow = ['Columns (columns16)'];

  // --- Second Row: 3 columns ---
  // Column 1: Main navigation links (first-menu & second-menu)
  let col1Content = [];
  if (links) {
    const firstMenu = getDirectChild(links, 'sa-footer__first-menu');
    const secondMenu = getDirectChild(links, 'sa-footer__second-menu');
    if (firstMenu) col1Content.push(...firstMenu.querySelectorAll('a'));
    if (secondMenu) col1Content.push(...secondMenu.querySelectorAll('a'));
  }
  // Column 2: Contact info (phone & email)
  let col2Content = [];
  if (contact) {
    const phone = contact.querySelector('.sa-footer__phone a');
    const email = contact.querySelector('.sa-footer__email a');
    if (phone) col2Content.push(phone);
    if (email) col2Content.push(email);
  }
  // Column 3: Legal links (all in one cell)
  let col3Content = [];
  if (otherLinks) {
    col3Content = Array.from(otherLinks.querySelectorAll('a'));
  }

  const secondRow = [col1Content, col2Content, col3Content];

  // --- Third Row: Copyright in first cell, others empty ---
  const thirdRow = [copyright ? copyright.textContent.trim() : '', '', ''];

  // Build table
  const cells = [headerRow, secondRow, thirdRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(block);
}
