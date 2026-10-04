// Define the order of sections
const sectionOrder = ['consent', 'indication', 'location', 'ultrasound', 'technique', 'fluid', 'complications', 'provider'];

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
        sectionDiv.innerHTML = `<strong>${capitalize(sectionName)}:</strong> <span class="output-text"></span><br>`;
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

    // Handle the special case for the "US used" button
    if (sectionName === 'ultrasound' && text.includes('dynamic ultrasound')) {
        generateAdditionalProcedureNote();
    }
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

    // Remove the main header if there's no content
    removeMainHeader(outputArea);

    // Special case: if the "US Used" button is unpressed, remove the additional note
    if (sectionName === 'ultrasound' && text.includes('dynamic ultrasound')) {
        removeAdditionalProcedureNote();
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

// Function to generate the additional procedure note
function generateAdditionalProcedureNote() {
    const outputArea = document.getElementById('outputArea');
    const additionalNoteId = 'additional-procedure-note';

    // Remove the existing additional note if it exists
    let existingNote = document.getElementById(additionalNoteId);
    if (existingNote) {
        existingNote.remove();
    }

    // Create the additional procedure note content
    const additionalNote = document.createElement('div');
    additionalNote.id = additionalNoteId;
    additionalNote.innerHTML = `
        <h3>Procedure: POCUS abdominal ultrasound</h3>
        <p><strong>Indication:</strong> evaluation for ascites</p>
        <p><strong>Procedure:</strong> limited abdominal ultrasound</p>
        <p><strong>Interpretation:</strong> ascites were visualized and an appropriate fluid pocket was identified for paracentesis. Images were saved in medical record and/or PACS.</p>
    `;

    // Append the additional note to the output area
    outputArea.appendChild(additionalNote);
}

// Function to remove the additional procedure note
function removeAdditionalProcedureNote() {
    const additionalNote = document.getElementById('additional-procedure-note');
    if (additionalNote) {
        additionalNote.remove();
    }
}

// Function to handle real-time text input (free text)
function updateRealTimeText(sectionTitle, textareaId) {
    const textarea = document.getElementById(textareaId);
    const sectionName = sectionTitle.replace(/\s+/g, '-').toLowerCase();
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

    // Ensure the additional procedure note is at the bottom
    const additionalNote = document.getElementById('additional-procedure-note');
    if (additionalNote) {
        outputArea.appendChild(additionalNote);
    }
}

// Utility function to capitalize the first letter of a string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
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

// Function to trigger macros
function triggerMacro(buttonIds, macroButton) {
    // Reset the previous state
    document.querySelectorAll('.pressed').forEach(button => {
        const text = button.getAttribute('onclick').match(/'([^']+)'/)[1];
        removeText(text, button);
    });

    // Activate the selected macro
    buttonIds.forEach(id => {
        const [section, buttonText] = id.split('-');
        const buttons = document.querySelectorAll(`[data-section="${section}"]`);
        const matchedButton = Array.from(buttons).find(btn => btn.innerText === buttonText);

        if (matchedButton) {
            const associatedText = matchedButton.getAttribute('onclick').match(/'([^']+)'/)[1];
            addText(associatedText, matchedButton);
        }
    });

    // Ensure the macro button reflects the state
    macroButton.classList.add('pressed');
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

    // Remove the additional procedure note if it's there
    removeAdditionalProcedureNote();
}
