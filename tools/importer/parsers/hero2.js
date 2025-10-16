/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image from inline style
  function getBackgroundImageUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image[^:]*:\s*url\(([^)]+)\)/);
    if (match && match[1]) return match[1];
    // Also check for custom property
    const customMatch = style.match(/--lfr-background-image-[^:]+:\s*url\(([^)]+)\)/);
    if (customMatch && customMatch[1]) return customMatch[1];
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero2)'];

  // 2. Background image row
  let bgImgUrl = getBackgroundImageUrl(element);
  let bgImgEl = null;
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
  }
  const bgImgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row: Title, subheading, paragraph(s), CTA
  // Find the main heading (h1)
  let titleEl = element.querySelector('h1');

  // Find subheading: look for strong/bold paragraph, or h2/h3 after h1
  let subheadingEl = null;
  const h1 = element.querySelector('h1');
  if (h1) {
    let next = h1.nextElementSibling;
    while (next) {
      if (next.tagName === 'H2' || next.tagName === 'H3') {
        subheadingEl = next;
        break;
      }
      if (next.tagName === 'P' && next.querySelector('strong, b')) {
        subheadingEl = next;
        break;
      }
      next = next.nextElementSibling;
    }
  }
  if (!subheadingEl) {
    subheadingEl = Array.from(element.querySelectorAll('p')).find(p => p.querySelector('strong, b'));
  }

  // Find all paragraphs (for descriptive content)
  const paragraphs = Array.from(element.querySelectorAll('p'));
  // Filter out subheading if it's a paragraph
  const descParagraphs = paragraphs.filter(p => p !== subheadingEl);

  // Find CTA: look for a link with visible text
  let ctaEl = null;
  const linkEl = element.querySelector('a[href]');
  if (linkEl && linkEl.textContent.trim()) {
    const btnText = element.querySelector('.btn__text');
    if (btnText) {
      const ctaSpan = document.createElement('span');
      ctaSpan.appendChild(linkEl.cloneNode(true));
      ctaSpan.appendChild(document.createTextNode(' '));
      ctaSpan.appendChild(btnText.cloneNode(true));
      ctaEl = ctaSpan;
    } else {
      ctaEl = linkEl.cloneNode(true);
    }
  }

  // Compose content cell (ensure all content is included)
  const contentEls = [];
  if (titleEl) contentEls.push(titleEl.cloneNode(true));
  if (subheadingEl) contentEls.push(subheadingEl.cloneNode(true));
  descParagraphs.forEach(p => contentEls.push(p.cloneNode(true)));
  if (ctaEl) contentEls.push(ctaEl);
  // Defensive: If nothing, add all text
  if (contentEls.length === 0) {
    contentEls.push(document.createTextNode(element.textContent.trim()));
  }

  const contentRow = [contentEls];

  // Compose table
  const cells = [headerRow, bgImgRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
