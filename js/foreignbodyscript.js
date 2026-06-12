// Define the Foreign Body Removal sections object to store the pressed button values
let foreignBodySections = {
    'consent': [],
    'Location': [],
    'Object type': [],
    'Imaging if applicable': [],
    'Method': [],
    'Outcome': [],
    'Complication': [],
    'Provider': []
};

// Function to handle button clicks for Foreign Body Removal sections with multiple selections
function handleButtonClick(button, description) {
    const section = button.getAttribute('data-section');

    // Toggle the button's pressed state
    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');

        // Remove the description from the foreignBodySections array for this section
        foreignBodySections[section] = foreignBodySections[section].filter(item => item !== description);
    } else {
        button.classList.add('pressed');

        // Add the description to the foreignBodySections array for this section
        foreignBodySections[section].push(description);
    }

    // Update the Foreign Body Removal output with the new values
    updateForeignBodyOutput();
}

// Function to handle real-time text input (free text) and append to existing output
function updateRealTimeText(section, textAreaId) {
    const textValue = document.getElementById(textAreaId).value.trim();

    // Append the new text to existing button-generated output if any
    if (textValue) {
        if (Array.isArray(foreignBodySections[section])) {
            foreignBodySections[section].push(textValue);
        } else {
            foreignBodySections[section] = (foreignBodySections[section] ? foreignBodySections[section] + ', ' : '') + textValue;
        }
    }

    // Update the Foreign Body Removal output
    updateForeignBodyOutput();
}

// Function to update the Foreign Body Removal Output
function updateForeignBodyOutput() {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = ''; // Clear the existing output

    // Create the main Procedure Note header
    const mainHeader = document.createElement('h2');
    mainHeader.textContent = 'Procedure Note: Foreign Body Removal';
    outputArea.appendChild(mainHeader);

    // Generate detailed outputs for each section
    for (const section in foreignBodySections) {
        if (foreignBodySections[section] && (Array.isArray(foreignBodySections[section]) ? foreignBodySections[section].length > 0 : foreignBodySections[section])) {
            const sectionDiv = document.createElement('div');
            sectionDiv.innerHTML = `<strong>${section}:</strong> ${Array.isArray(foreignBodySections[section]) ? foreignBodySections[section].join(', ') : foreignBodySections[section]}`;
            outputArea.appendChild(sectionDiv);
        }
    }
}

// Function to clear the Foreign Body Removal output and reset the buttons
function clearOutput() {
    // Reset all sections
    foreignBodySections = {
        'consent': [],
        'Location': [],
        'Object type': [],
        'Imaging if applicable': [],
        'Method': [],
        'Outcome': [],
        'Complication': [],
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
