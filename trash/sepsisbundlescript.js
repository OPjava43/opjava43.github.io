// Define the correct order of sections
const sectionOrder = ['diagnosis', 'initial_management', 'reassessment'];

// Function to handle adding text when a button is pressed
function addText(text, button) {
    const sectionName = button.getAttribute('data-section');
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');

    // Add the main header if not present
    addMainHeader();

    // Find or create the section div
    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `<strong>${formatSectionTitle(sectionName)}:</strong> <span class="output-text"></span><br>`;
        outputArea.appendChild(sectionDiv);
    }

    const outputText = sectionDiv.querySelector('.output-text');

    // Add button-generated text, ensuring no duplicates
    if (!outputText.textContent.includes(text)) {
        outputText.textContent += (outputText.textContent ? ', ' : '') + text;
    }

    // Mark the button as pressed
    button.classList.add('pressed');

    // Ensure sections are in the correct order
    reorderSections(outputArea);
}

// Function to handle removing text when a button is unpressed
function removeText(text, button) {
    const sectionName = button.getAttribute('data-section');
    const sectionId = `output-${sectionName}`;
    const sectionDiv = document.getElementById(sectionId);

    if (sectionDiv) {
        const outputText = sectionDiv.querySelector('.output-text');

        // Remove the button-generated text
        outputText.textContent = outputText.textContent
            .split(', ')
            .filter(item => item !== text)
            .join(', ');

        // If no text remains, remove the section
        if (!outputText.textContent.trim()) {
            sectionDiv.remove();
        }

        // Unmark the button as pressed
        button.classList.remove('pressed');

        // Remove the main header if there's no content
        removeMainHeader();
    }
}

// Function to handle button clicks
function handleButtonClick(button, text) {
    if (button.classList.contains('pressed')) {
        removeText(text, button);
    } else {
        addText(text, button);
    }
}

// Function to handle real-time text input (free text)
function updateRealTimeText(sectionTitle, textareaId) {
    const textarea = document.getElementById(textareaId);
    const sectionName = textareaId.replace('Text', ''); // Match textarea ID to section ID
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');

    // Add the main header if not present
    addMainHeader();

    // Find or create the section div
    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `<strong>${formatSectionTitle(sectionName)}:</strong> <span class="output-text"></span><br>`;
        outputArea.appendChild(sectionDiv);
    }

    const outputText = sectionDiv.querySelector('.output-text');
    const newText = textarea.value.trim();

    if (newText) {
        // Append free text to existing output without replacing it
        if (!outputText.textContent.includes(newText)) {
            outputText.textContent += (outputText.textContent ? ', ' : '') + newText;
        }
    } else {
        // Remove the entire section and reset buttons if free text is deleted
        sectionDiv.remove();

        // Reset all buttons in this section
        const buttons = document.querySelectorAll(`button[data-section="${sectionName}"]`);
        buttons.forEach(button => button.classList.remove('pressed'));
    }

    // Ensure sections are in the correct order
    reorderSections(outputArea);
}

// Function to format section titles correctly (fixes "Initial_management" issue)
function formatSectionTitle(section) {
    return section
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize each word
}

// Function to reorder sections according to the predefined order
function reorderSections(outputArea) {
    sectionOrder.forEach(section => {
        const sectionDiv = document.getElementById(`output-${section}`);
        if (sectionDiv) {
            outputArea.appendChild(sectionDiv);
        }
    });
}

// Function to add the main header if it's not already present
function addMainHeader() {
    const outputArea = document.getElementById('outputArea');
    if (!outputArea.querySelector('h2')) {
        outputArea.insertAdjacentHTML('afterbegin', `<h2>Sepsis Management</h2><p>Due to a concern for sepsis, the following actions were conducted within three hours of the patient’s arrival to the emergency department:</p>`);
    }
}

// Function to remove the main header if there's no content
function removeMainHeader() {
    const outputArea = document.getElementById('outputArea');
    if (outputArea.children.length === 1) {
        const header = outputArea.querySelector('h2');
        if (header) {
            header.remove();
        }
        const paragraph = outputArea.querySelector('p');
        if (paragraph) {
            paragraph.remove();
        }
    }
}

// Function to copy the output text to the clipboard
function copyToClipboard() {
    const outputArea = document.getElementById('outputArea');
    const range = document.createRange();
    range.selectNode(outputArea);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}

// Function to clear all output and reset all buttons and textareas
function clearOutput() {
    // Clear the output area
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = '';

    // Reset all buttons
    document.querySelectorAll('.pressed').forEach(button => {
        button.classList.remove('pressed');
    });

    // Clear all textareas
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.value = '';
    });
}
