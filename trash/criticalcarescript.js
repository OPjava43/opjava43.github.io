// Define the order of sections
const sectionOrder = ['totalTime', 'indications', 'specificInterventions'];

// Text that will always appear at the top of the output
const criticalCareTopText = `This critical care time was performed to assess and manage the high probability of imminent, life-threatening deterioration that could result in multi-organ failure. It was exclusive of separately billable procedures and treating other patients and teaching time.`;

// Function to handle adding text when a button is pressed
function addText(text, button) {
    const sectionName = button.getAttribute('data-section');
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');

    // Find or create the section div
    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `<strong>${formatSectionName(sectionName)}:</strong> <span class="output-text"></span><br>`;
        outputArea.appendChild(sectionDiv);
    }

    const outputText = sectionDiv.querySelector('.output-text');

    // Add button-generated text, ensuring no duplicates
    if (!outputText.textContent.includes(text)) {
        outputText.textContent += (outputText.textContent ? ', ' : '') + text;
    }

    // Mark the button as pressed
    button.classList.add('pressed');

    // Ensure the sections are in the correct order
    reorderSections(outputArea);
}

// Function to handle removing text when a button is unpressed
function removeText(text, button) {
    const sectionName = button.getAttribute('data-section');
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');

    const sectionDiv = document.getElementById(sectionId);
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
}

// Function to handle button clicks
function handleButtonClick(button, text) {
    if (button.classList.contains('pressed')) {
        removeText(text, button);
    } else {
        addText(text, button);
    }

    // Add Critical Care header and top text if not already present
    addMainHeader();
}

// Function to add the main Critical Care header and top text if not already present
function addMainHeader() {
    const outputArea = document.getElementById('outputArea');
    if (!outputArea.querySelector('h2')) {
        outputArea.insertAdjacentHTML('afterbegin', `<h2>Critical Care</h2><br><p>${criticalCareTopText}</p><br>`);
    }
}

// Function to handle real-time text input (free text) based on the Intubation script
function updateRealTimeText(sectionTitle, textareaId) {
    const textarea = document.getElementById(textareaId);
    const sectionName = textareaId.replace('Text', ''); // Use the base section name without 'Text'
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');

    // Find the section div or create it if it doesn't exist
    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `<strong>${sectionTitle}:</strong> <span class="output-text"></span><br>`;
        outputArea.appendChild(sectionDiv);
    }

    const outputText = sectionDiv.querySelector('.output-text');
    const newText = textarea.value.trim();

    if (newText) {
        // Append free text to existing output without replacing it
        outputText.textContent += (outputText.textContent ? ', ' : '') + newText;
    } else {
        // Remove the entire section and reset buttons if free text is deleted
        sectionDiv.remove();

        // Reset all buttons in this section
        const buttons = document.querySelectorAll(`button[data-section="${sectionName}"]`);
        buttons.forEach(button => button.classList.remove('pressed'));
    }

    // Ensure the sections are in the correct order
    reorderSections(outputArea);

    // Add the main header if not present
    addMainHeader(outputArea);

    // Remove the header if there's no content
    removeMainHeader(outputArea);
}

// Utility function to capitalize the first letter of a string and format section names
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function to format section names with spaces between words
function formatSectionName(section) {
    return section
        .replace(/([A-Z])/g, ' $1')
        .replace(/^[a-z]/, match => match.toUpperCase())
        .trim();
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

// Function to clear all output and reset all buttons
function clearOutput() {
    // Clear the output area
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = '';

    // Reset all buttons
    document.querySelectorAll('.pressed').forEach(button => {
        button.classList.remove('pressed');
    });
    
    // Clear all textareas (free text inputs)
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.value = '';
    });
}

// Function to remove the main header if there's no content
function removeMainHeader(outputArea) {
    if (!outputArea.innerHTML.trim()) {
        const header = outputArea.querySelector('h2');
        if (header) {
            header.remove();
        }
    }
}
