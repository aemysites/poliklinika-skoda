/* global WebImporter */
export default function parse(element, { document }) {
  // Extract breadcrumb navigation text
  const breadcrumbNav = element.querySelector('.breadcrumb');
  let breadcrumbText = '';
  if (breadcrumbNav) {
    breadcrumbText = Array.from(breadcrumbNav.querySelectorAll('.breadcrumb-item'))
      .map(li => li.textContent.trim())
      .join(' / ');
  }

  // Extract the carousel block
  const carouselBlock = element.querySelector('.s-carousel.sa-gallery');
  if (!carouselBlock) return;

  // Extract the headline for the carousel (gallery-wide)
  const headlineEl = carouselBlock.querySelector('.sa-gallery__headline');
  const headlineText = headlineEl ? headlineEl.textContent.trim() : '';

  // Extract all carousel items/slides
  const items = Array.from(carouselBlock.querySelectorAll('.s-carousel__item.sa-gallery__record'));
  if (!items.length) return;

  // Build table rows
  const rows = [];
  // Header row: always use the block name
  const headerRow = ['Carousel (carousel25)'];
  rows.push(headerRow);

  items.forEach((item) => {
    // Find the image element (inside <picture> or <img>)
    const imgEl = item.querySelector('img');
    if (!imgEl) return; // skip if no image

    // Text cell: only extract button/CTA if present
    const textCell = [];
    const detailEl = item.querySelector('.sa-gallery__item__detail');
    if (detailEl) {
      const btnEl = detailEl.querySelector('.sa-gallery__item__button');
      if (btnEl && btnEl.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = btnEl.textContent.trim();
        textCell.push(span);
      }
    }
    rows.push([imgEl, textCell.length ? textCell : '']);
  });

  // Create a fragment to hold everything
  const fragment = document.createDocumentFragment();

  // Add breadcrumb navigation as a paragraph if present
  if (breadcrumbText) {
    const p = document.createElement('p');
    p.textContent = breadcrumbText;
    fragment.appendChild(p);
  }

  // Add headline above the carousel table if present
  if (headlineText) {
    const h2 = document.createElement('h2');
    h2.textContent = headlineText;
    fragment.appendChild(h2);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  fragment.appendChild(blockTable);

  // Replace the original element with the fragment
  element.replaceWith(fragment);
}
