/* global WebImporter */
export default function parse(element, { document }) {
  // Cards block header row
  const headerRow = ['Cards (cards22)'];
  const rows = [headerRow];

  // Find all card columns (each .col contains one card)
  const cardCols = element.querySelectorAll('.row.align-items-start > .col');

  cardCols.forEach((col) => {
    // Defensive: find the news__item inside each col
    const card = col.querySelector('.news__item');
    if (!card) return;

    // --- IMAGE ---
    // Find the image inside .news__item-image-holder
    let imageEl = null;
    const imgHolder = card.querySelector('.news__item-image-holder');
    if (imgHolder) {
      imageEl = imgHolder.querySelector('img');
    }
    // Defensive: if no image, skip this card
    if (!imageEl) return;

    // --- TEXT ---
    // Find the text container
    const textHolder = card.querySelector('.news__item-texts');
    if (!textHolder) return;

    // Title (heading)
    const titleEl = textHolder.querySelector('.news__item-heading');
    // Date
    const dateEl = textHolder.querySelector('.news__item-date');
    // Description/category
    const descEl = textHolder.querySelector('.news__item-text');

    // Compose text cell
    const textCell = document.createElement('div');
    // Add title
    if (titleEl) {
      const h3 = document.createElement('h3');
      h3.textContent = titleEl.textContent.trim();
      textCell.appendChild(h3);
    }
    // Add date
    if (dateEl && dateEl.textContent.trim()) {
      const dateP = document.createElement('p');
      dateP.innerHTML = `<strong>${dateEl.textContent.trim()}</strong>`;
      textCell.appendChild(dateP);
    }
    // Add description/category (always add <p>, even if empty)
    if (descEl) {
      const descP = document.createElement('p');
      descP.textContent = descEl.textContent.trim();
      textCell.appendChild(descP);
    }

    // --- CTA ---
    // Find the link for CTA
    const linkEl = card.querySelector('.news__item-link');
    if (linkEl && linkEl.href) {
      // Find the button text
      const btnSpan = linkEl.querySelector('.btn');
      const ctaText = btnSpan ? btnSpan.textContent.trim() : linkEl.textContent.trim();
      const a = document.createElement('a');
      a.href = linkEl.href;
      a.textContent = ctaText || 'Otevřít detail';
      a.className = 'cta';
      textCell.appendChild(a);
    }

    // Add row for this card: [image, text]
    rows.push([imageEl, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
