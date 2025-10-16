/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract cards from the gallery rows
  function extractCardsFromRow(row) {
    // Each card is a .col with an <a> inside
    return Array.from(row.querySelectorAll('.col a')).map((a) => {
      // Find the year (title)
      const title = a.querySelector('h4');
      // Find the image
      const img = a.querySelector('img');
      if (title && img) {
        // First cell: image (inside link)
        const imgLink = document.createElement('a');
        imgLink.href = a.href;
        imgLink.style.color = 'inherit';
        imgLink.style.textDecoration = 'none';
        imgLink.appendChild(img.cloneNode(true));
        // Second cell: title (inside link)
        const titleLink = document.createElement('a');
        titleLink.href = a.href;
        titleLink.style.color = 'inherit';
        titleLink.style.textDecoration = 'none';
        titleLink.appendChild(title.cloneNode(true));
        return [imgLink, titleLink];
      }
      return null;
    }).filter(Boolean);
  }

  // Find all gallery containers (rows)
  const galleryContainers = Array.from(element.querySelectorAll('.lfr-layout-structure-item-row'));

  // Collect all cards from all rows
  let cards = [];
  galleryContainers.forEach((row) => {
    cards = cards.concat(extractCardsFromRow(row));
  });

  // Defensive: If no cards found, do nothing
  if (cards.length === 0) return;

  // Build the table rows: header, then one row per card
  const rows = [];
  rows.push(['Cards (cards29)']);
  cards.forEach(([imgLink, titleLink]) => {
    rows.push([imgLink, titleLink]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
