let isSelectionMode = false;
let selectedElement: Element | null = null;

// Listen for text selection
document.addEventListener('mouseup', handleTextSelection);
document.addEventListener('keyup', handleTextSelection);

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'getSelectedText') {
    const selectedText = window.getSelection()?.toString() || '';
    sendResponse({ text: selectedText });
  }
  
  if (message.action === 'translateSelectedText') {
    translateSelectedText(message.targetLanguage);
  }
  
  if (message.action === 'translatePage') {
    translateEntirePage(message.targetLanguage);
  }

  if (message.action === 'highlightTranslations') {
    highlightTranslatedElements(message.enable);
  }
});

function handleTextSelection() {
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();
  
  if (selectedText && selectedText.length > 0) {
    // Send selected text to side panel
    chrome.runtime.sendMessage({
      action: 'textSelected',
      text: selectedText,
      url: window.location.href
    });
  }
}

async function translateSelectedText(targetLanguage: string) {
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();
  
  if (!selectedText) {
    console.log('No text selected');
    return;
  }

  try {
    // Show loading indicator
    showTranslationTooltip('Translating...', selection);
    
    const response = await chrome.runtime.sendMessage({
      action: 'translateText',
      text: selectedText,
      options: { targetLanguage }
    });

    if (response.error) {
      showTranslationTooltip(`Error: ${response.error}`, selection);
    } else {
      showTranslationTooltip(response.translatedText, selection);
    }
  } catch (error) {
    console.error('Translation error:', error);
    showTranslationTooltip('Translation failed', selection);
  }
}

function showTranslationTooltip(text: string, selection: Selection | null) {
  // Remove existing tooltip
  const existingTooltip = document.getElementById('ai-translator-tooltip');
  if (existingTooltip) {
    existingTooltip.remove();
  }

  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  const tooltip = document.createElement('div');
  tooltip.id = 'ai-translator-tooltip';
  tooltip.style.cssText = `
    position: fixed;
    top: ${rect.bottom + window.scrollY + 5}px;
    left: ${rect.left + window.scrollX}px;
    background: #333;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
    font-family: Arial, sans-serif;
    z-index: 10000;
    max-width: 300px;
    word-wrap: break-word;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    border: 1px solid #555;
  `;
  tooltip.textContent = text;

  document.body.appendChild(tooltip);

  // Remove tooltip after 5 seconds or on click
  setTimeout(() => {
    if (tooltip.parentNode) {
      tooltip.remove();
    }
  }, 5000);

  tooltip.addEventListener('click', () => tooltip.remove());
}

async function translateEntirePage(targetLanguage: string) {
  try {
    // Get all text nodes
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
          
          // Skip script and style tags
          const parent = node.parentElement;
          if (parent && ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes: Text[] = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node as Text);
    }

    // Translate in batches to avoid overwhelming the API
    const batchSize = 10;
    for (let i = 0; i < textNodes.length; i += batchSize) {
      const batch = textNodes.slice(i, i + batchSize);
      const promises = batch.map(async (textNode) => {
        const originalText = textNode.textContent?.trim();
        if (!originalText || originalText.length < 3) return;

        try {
          const response = await chrome.runtime.sendMessage({
            action: 'translateText',
            text: originalText,
            options: { targetLanguage }
          });

          if (!response.error) {
            // Store original text as data attribute
            if (textNode.parentElement) {
              textNode.parentElement.setAttribute('data-original-text', originalText);
              textNode.parentElement.setAttribute('data-translated', 'true');
            }
            textNode.textContent = response.translatedText;
          }
        } catch (error) {
          console.error('Error translating text node:', error);
        }
      });

      await Promise.all(promises);
      
      // Add small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('Page translation completed');
  } catch (error) {
    console.error('Error translating page:', error);
  }
}

function highlightTranslatedElements(enable: boolean) {
  const translatedElements = document.querySelectorAll('[data-translated="true"]');
  
  translatedElements.forEach(element => {
    if (enable) {
      (element as HTMLElement).style.backgroundColor = '#fff3cd';
      (element as HTMLElement).style.border = '1px solid #ffeaa7';
    } else {
      (element as HTMLElement).style.backgroundColor = '';
      (element as HTMLElement).style.border = '';
    }
  });
}

// Handle page visibility changes to clean up tooltips
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    const tooltip = document.getElementById('ai-translator-tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }
});