/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card columns in the row
  const cardCols = Array.from(element.querySelectorAll('.row > .col'));

  // Prepare table rows
  const rows = [];
  // Block header row (must match block name exactly)
  rows.push(['Cards (cards11)']);

  cardCols.forEach((col) => {
    // Defensive: Find the card root
    const card = col.querySelector('.image-text-cta.vertical-layout');
    if (!card) return;

    // Image: first image inside the card
    const imgWrapper = card.querySelector('.image-text-cta__picture');
    let img = imgWrapper ? imgWrapper.querySelector('img') : null;

    // Text content: title, description, CTA
    const textWrap = card.querySelector('.image-text-cta__description');
    let title = textWrap ? textWrap.querySelector('h2, h3, .text-cta__title') : null;
    let description = textWrap ? textWrap.querySelector('.text-cta__content') : null;

    // CTA: anchor link and button text
    let ctaWrap = textWrap ? textWrap.querySelector('.text-cta__link') : null;
    let ctaBtn = ctaWrap ? ctaWrap.querySelector('.btn') : null;
    let ctaLink = ctaBtn ? ctaBtn.querySelector('a') : null;
    let ctaText = ctaBtn ? ctaBtn.querySelector('.btn__text') : null;

    // Compose text cell
    const textCell = document.createElement('div');
    if (title) textCell.appendChild(title);
    if (description) textCell.appendChild(description);
    if (ctaLink && ctaText) {
      // Compose CTA: use link, add button text
      const ctaDiv = document.createElement('div');
      ctaDiv.appendChild(ctaLink);
      ctaDiv.appendChild(ctaText);
      textCell.appendChild(ctaDiv);
    }

    rows.push([
      img || '',
      textCell
    ]);
  });

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
