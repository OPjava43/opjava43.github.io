// Define the Cardioversion sections object to store the pressed button values
let cardioversionSections = {
    'consent': [],
    'Indication': [],
    'Technique': [],
    'Post-procedure': [],
    'Complications': [],
    'Provider': []
};

// Function to handle button clicks for Cardioversion sections with multiple selections
function handleButtonClick(button, description) {
    const section = button.getAttribute('data-section');

    // Toggle the button's pressed state
    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');

        // Remove the description from the cardioversionSections array for this section
        cardioversionSections[section] = cardioversionSections[section].filter(item => item !== description);
    } else {
        button.classList.add('pressed');

        // Add the description to the cardioversionSections array for this section
        cardioversionSections[section].push(description);
    }

    // Update the Cardioversion output with the new values
    updateCardioversionOutput();
}

// Function to handle real-time text input (free text) and append to existing output
function updateRealTimeText(section, textAreaId) {
    const textValue = document.getElementById(textAreaId).value.trim();

    // Append the new text to existing button-generated output if any
    if (textValue) {
        if (Array.isArray(cardioversionSections[section])) {
            cardioversionSections[section].push(textValue);
        } else {
            cardioversionSections[section] = (cardioversionSections[section] ? cardioversionSections[section] + ', ' : '') + textValue;
        }
    }

    // Update the Cardioversion output
    updateCardioversionOutput();
}

// Function to update the Cardioversion Output
function updateCardioversionOutput() {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = ''; // Clear the existing output

    // Create the main Cardioversion Interpretation header
    const mainHeader = document.createElement('h2');
    mainHeader.textContent = 'Procedure Note: Cardioversion';
    outputArea.appendChild(mainHeader);

    // Generate detailed outputs for each section
    for (const section in cardioversionSections) {
        if (cardioversionSections[section] && (Array.isArray(cardioversionSections[section]) ? cardioversionSections[section].length > 0 : cardioversionSections[section])) {
            const sectionDiv = document.createElement('div');
            sectionDiv.innerHTML = `<strong>${section}:</strong> ${Array.isArray(cardioversionSections[section]) ? cardioversionSections[section].join(', ') : cardioversionSections[section]}`;
            outputArea.appendChild(sectionDiv);
        }
    }
}

// Function to clear the Cardioversion output and reset the buttons
function clearOutput() {
    // Reset all sections
    cardioversionSections = {
        'consent': [],
        'Indication': [],
        'Technique': [],
        'Post-procedure': [],
        'Complications': [],
        'Provider': []
    };

    // Clear all text areas
    document.querySelectorAll('textarea').forEach(textarea => textarea.value = '');

    // Unpress all buttons
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));

    // Clear the output area
    document.getElementById('outputArea').innerHTML = '';
}

// Function to copy the output text to the clipboard
function copyToClipboard() {
    const outputArea = document.getElementById('outputArea');
    const range = document.createRange();
    range.selectNode(outputArea);
    window.getSelection().removeAllRanges(); // Clear current selection
    window.getSelection().addRange(range); // Select the text
    document.execCommand("copy");
    window.getSelection().removeAllRanges(); // Deselect the text
}
