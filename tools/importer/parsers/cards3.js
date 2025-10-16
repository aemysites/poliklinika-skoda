/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards3) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards3)'];
  const rows = [headerRow];

  // Find all card containers (less specific selector for flexibility)
  const cardRoots = element.querySelectorAll('.sa-gallery__item');

  cardRoots.forEach((card) => {
    // --- IMAGE COLUMN ---
    const picture = card.querySelector('picture');
    let imageEl = null;
    if (picture) {
      imageEl = picture;
    }

    // --- TEXT COLUMN ---
    const detail = card.querySelector('.sa-gallery__item__detail');
    const textContent = [];
    if (detail) {
      // Title
      const title = detail.querySelector('.sa-gallery__item__title');
      if (title && title.textContent.trim()) {
        const h3 = document.createElement('h3');
        h3.textContent = title.textContent.trim();
        textContent.push(h3);
      }
      // Description
      const desc = detail.querySelector('.sa-gallery__item__content');
      if (desc && desc.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textContent.push(p);
      }
      // CTA/Button
      const btn = detail.querySelector('.sa-gallery__item__button');
      if (btn && btn.textContent.trim()) {
        let linkHref = '';
        const link = card.querySelector('.sa-gallery__item__link');
        if (link && link.getAttribute('href')) {
          linkHref = link.getAttribute('href');
        }
        if (linkHref && linkHref !== '#') {
          const a = document.createElement('a');
          a.href = linkHref;
          a.textContent = btn.textContent.trim();
          textContent.push(a);
        } else {
          const div = document.createElement('div');
          div.textContent = btn.textContent.trim();
          textContent.push(div);
        }
      }
    }
    // Defensive: if no text content, add empty string
    if (textContent.length === 0) textContent.push('');
    rows.push([imageEl, textContent]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
