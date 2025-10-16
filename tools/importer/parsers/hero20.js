/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero20)'];

  // 2. Find the hero image (background)
  // Defensive: look for <img> inside <picture> inside .hero-image
  let imgEl = null;
  const heroImageDiv = element.querySelector('.hero-image');
  if (heroImageDiv) {
    const picture = heroImageDiv.querySelector('picture');
    if (picture) {
      // Reference the existing <img> element
      imgEl = picture.querySelector('img');
    }
  }

  // 3. Find headline and subheadline
  let headline = null;
  let subheadline = null;
  // Defensive: headline is inside .hero-image__headline, subheadline in .hero-image__subheadline
  const headlineDiv = element.querySelector('.hero-image__headline');
  if (headlineDiv) {
    // Find first <p> or direct text
    headline = headlineDiv.querySelector('p, h1, h2, h3, h4, h5, h6');
    if (!headline) {
      // fallback: use textContent
      headline = document.createElement('div');
      headline.textContent = headlineDiv.textContent.trim();
    }
  }
  const subheadlineDiv = element.querySelector('.hero-image__subheadline');
  if (subheadlineDiv) {
    subheadline = subheadlineDiv.querySelector('p, h1, h2, h3, h4, h5, h6');
    if (!subheadline) {
      // fallback: use textContent
      subheadline = document.createElement('div');
      subheadline.textContent = subheadlineDiv.textContent.trim();
    }
  }

  // 4. Find CTA (call-to-action) - look for anchor inside .hero-image__actions or .hero-image__links
  let cta = null;
  const actionsDiv = element.querySelector('.hero-image__actions');
  if (actionsDiv) {
    const linksDiv = actionsDiv.querySelector('.hero-image__links');
    if (linksDiv) {
      const anchor = linksDiv.querySelector('a');
      if (anchor) {
        cta = anchor;
      }
    }
  }

  // 5. Compose the text cell (headline, subheadline, CTA)
  const textCellContent = [];
  if (headline) textCellContent.push(headline);
  if (subheadline) textCellContent.push(subheadline);
  if (cta) textCellContent.push(cta);

  // 6. Table rows
  const imageRow = [imgEl ? imgEl : ''];
  const textRow = [textCellContent.length ? textCellContent : ''];

  // 7. Create table
  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 8. Replace original element
  element.replaceWith(table);
}
