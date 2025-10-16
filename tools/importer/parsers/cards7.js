/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row for Cards (cards7)
  const headerRow = ['Cards (cards7)'];

  // Helper to extract image from background-image style
  function extractImageFromStyle(style) {
    const urlMatch = style.match(/url\(([^)]+)\)/);
    if (urlMatch) {
      const img = document.createElement('img');
      img.src = urlMatch[1].replace(/['"]/g, '');
      img.loading = 'lazy';
      return img;
    }
    return null;
  }

  // Get all card columns
  const cardColumns = Array.from(element.querySelectorAll('.row > .col'));
  const rows = [headerRow];

  cardColumns.forEach((col) => {
    // Get card container with background image
    const cardContainer = col.querySelector('[style*="background-image"]');
    let imageEl = null;
    if (cardContainer && cardContainer.getAttribute('style')) {
      imageEl = extractImageFromStyle(cardContainer.getAttribute('style'));
    }

    // Get card text content (title, description)
    let textContent = '';
    // Find the paragraph block that contains all text
    const paragraph = cardContainer && cardContainer.querySelector('.component-paragraph');
    if (paragraph) {
      // Use the entire innerHTML of the paragraph block to ensure all text is captured
      textContent += paragraph.innerHTML;
    }

    // Get CTA button (link)
    let ctaEl = null;
    const btnContainer = cardContainer && cardContainer.querySelector('.btn.btn-primary');
    if (btnContainer) {
      // Prefer the .btn__text link if present
      const btnText = btnContainer.querySelector('.btn__text a');
      if (btnText) {
        ctaEl = btnText;
      } else {
        // Fallback to .btn__link
        const btnLink = btnContainer.querySelector('.btn__link');
        if (btnLink) {
          ctaEl = btnLink;
        }
      }
    }

    // Compose text cell
    const textCell = document.createElement('div');
    // Add all text content from the paragraph block
    if (textContent) {
      textCell.innerHTML = textContent;
    }
    // Add CTA if present
    if (ctaEl) {
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(ctaEl.cloneNode(true));
    }

    // Only add row if there is some content
    if (imageEl || textCell.textContent.trim()) {
      rows.push([
        imageEl || '',
        textCell
      ]);
    }
  });

  // Create block table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
