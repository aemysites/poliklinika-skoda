/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards36) block: 2 columns, each row is a card
  // Header row
  const headerRow = ['Cards (cards36)'];
  const rows = [headerRow];

  // Find all card columns (each contains a card)
  // The structure is: .row > .col > ...events__item...
  const cardCols = element.querySelectorAll('.row > .col');

  // Defensive: If no .row > .col, try fallback to all .events__item
  let cardElements = [];
  if (cardCols.length) {
    cardCols.forEach(col => {
      const card = col.querySelector('.events__item');
      if (card) cardElements.push(card);
    });
  } else {
    // fallback: find all .events__item directly
    cardElements = Array.from(element.querySelectorAll('.events__item'));
  }

  cardElements.forEach(card => {
    // --- Image cell ---
    // Find the image inside .events__item-image-holder
    let imageCell = null;
    const imgHolder = card.querySelector('.events__item-image-holder');
    if (imgHolder) {
      // Use the <img> inside <picture>
      const img = imgHolder.querySelector('img');
      if (img) {
        imageCell = img;
      } else if (imgHolder.querySelector('picture')) {
        imageCell = imgHolder.querySelector('picture');
      }
    }

    // --- Text cell ---
    const texts = card.querySelector('.events__item-texts');
    const textCellContent = [];
    if (texts) {
      // Title (heading)
      const heading = texts.querySelector('.events__item-heading');
      if (heading) textCellContent.push(heading);

      // Date range (bold) and day/time
      const dateRange = texts.querySelector('.events__item-date-range');
      if (dateRange) {
        // Compose date range and day/time as a block
        // Date range: combine children
        const dateParts = [];
        dateRange.childNodes.forEach(node => {
          if (node.nodeType === 1 || node.nodeType === 3) {
            dateParts.push(node.cloneNode(true));
          }
        });
        // Wrap in <div>
        const dateDiv = document.createElement('div');
        dateParts.forEach(part => dateDiv.append(part));
        textCellContent.push(dateDiv);
      }
      // Day range
      const dayRange = texts.querySelector('.events__item-day-range');
      if (dayRange) textCellContent.push(dayRange);

      // Description
      const desc = texts.querySelector('.events__item-text');
      if (desc) textCellContent.push(desc);

      // Location
      const location = texts.querySelector('.events__item-location');
      if (location) textCellContent.push(location);
    }

    // --- CTA (button/link) ---
    // Find the link (if present)
    const link = card.querySelector('.events__item-link');
    if (link) {
      // Add the CTA link (with its button) at the end of the text cell
      textCellContent.push(link);
    }

    // Add card row: [image, text]
    rows.push([imageCell, textCellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
