// Define the order of sections
const sectionOrder = [
    'consent', 'location', 'lengthcm', 'cleaning', 'foreignbody', 
    'anesthetic', 'suturetechnique', 'othertechniques', 
    'postprocedure', 'tetanus', 'complications', 'provider'
];

// Function to handle adding text when a button is pressed
function addText(text, button) {
    const sectionName = button.getAttribute('data-section'); // Use data-section to get the correct section
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');

    // Find or create the section div
    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `<strong>${capitalizeSectionName(sectionName)}:</strong> <span class="output-text"></span><br>`;
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

    // Add the main header if not present
    addMainHeader(outputArea);
}

// Function to handle removing text when a button is unpressed
function removeText(text, button) {
    const sectionName = button.getAttribute('data-section'); // Use data-section to get the correct section
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

    // Remove the header if there's no content
    removeMainHeader(outputArea);
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
    let sectionName = sectionTitle.replace(/\s+/g, '').toLowerCase(); // Remove spaces to match button data-section
    const outputArea = document.getElementById('outputArea');

    // Special handling for sections with specific IDs
    if (sectionName === 'length(cm)') {
        sectionName = 'lengthcm';
    } else if (sectionName === 'suturetechnique') {
        sectionName = 'suturetechnique';
    } else if (sectionName === 'othertechniques') {
        sectionName = 'othertechniques';
    } else if (sectionName === 'post-procedure') {
        sectionName = 'postprocedure';
    } else if (sectionName === 'foreignbody') {
        sectionName = 'foreignbody';
    }

    const sectionId = `output-${sectionName}`;

    // Find the section div or create it if it doesn't exist
    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `<strong>${capitalizeSectionName(sectionName)}:</strong> <span class="output-text"></span><br>`;
        outputArea.appendChild(sectionDiv);
    }

    const outputText = sectionDiv.querySelector('.output-text');
    let newText = textarea.value.trim();

    // Check if the section is 'anesthetic' and append 'cc' if needed
    if (sectionName === 'anesthetic' && newText) {
        // Add 'cc' after the input if not already present
        if (!newText.toLowerCase().endsWith('cc')) {
            newText += ' cc';
        }
    }

    // Check if the section is 'lengthcm' and append 'cm' if needed
    if (sectionName === 'lengthcm' && newText) {
        // Add 'cm' after the input if not already present
        if (!newText.toLowerCase().endsWith('cm')) {
            newText += ' cm';
        }
    }

    if (newText) {
        // Add or update the free text
        outputText.textContent = outputText.textContent
            ? `${outputText.textContent}, ${newText}`
            : newText;
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

// Function to add the main header if it's not already present
function addMainHeader(outputArea) {
    if (!outputArea.querySelector('h2') && outputArea.innerHTML.trim() !== '') {
        const mainTitle = document.querySelector('.form-section h2').innerText;
        outputArea.insertAdjacentHTML('afterbegin', `<h2>${mainTitle}</h2><br>`);
    }
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

// Function to reorder sections according to the predefined order
function reorderSections(outputArea) {
    sectionOrder.forEach(section => {
        const sectionDiv = document.getElementById(`output-${section}`);
        if (sectionDiv) {
            outputArea.appendChild(sectionDiv);
        }
    });
}

// Utility function to capitalize section names properly
function capitalizeSectionName(section) {
    switch (section) {
        case 'suturetechnique':
            return 'Suture Technique';
        case 'othertechniques':
            return 'Other Techniques';
        case 'postprocedure':
            return 'Post-procedure';
        case 'foreignbody':
            return 'Foreign Body';
        case 'lengthcm':
            return 'Length (cm)';
        default:
            return section.charAt(0).toUpperCase() + section.slice(1);
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

// Function to clear all output and reset all buttons
function clearOutput() {
    // Clear the output area
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = '';

    // Reset all buttons
    document.querySelectorAll('.pressed').forEach(button => {
        button.classList.remove('pressed');
    });

    // Remove the main header if it's there
    removeMainHeader(outputArea);
}
