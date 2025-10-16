/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as required
  const headerRow = ['Hero (hero30)'];

  // No image present in the screenshot or HTML, so row 2 is empty
  const imageRow = [''];

  // Compose the content row with heading and subheading only (NO FORM)
  const contentRowContent = [];

  // Find the newsletter text container
  const newsletterText = element.querySelector('.newsletter__text');
  if (newsletterText) {
    // Extract heading and subheading
    const headingEl = newsletterText.querySelector('.newsletter__text-heading');
    const subheadingEl = newsletterText.querySelector('.newsletter__text-paragraph');
    if (headingEl) {
      // Convert to heading element (h1)
      const h1 = document.createElement('h1');
      h1.innerHTML = headingEl.innerHTML;
      contentRowContent.push(h1);
    }
    if (subheadingEl) {
      // Use a clean <p> element for subheading
      const p = document.createElement('p');
      p.textContent = subheadingEl.textContent;
      contentRowContent.push(p);
    }
  }

  // Only add content if present
  const contentRow = [contentRowContent.length ? contentRowContent : ''];

  // Compose table rows
  const rows = [
    headerRow,
    imageRow,
    contentRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
