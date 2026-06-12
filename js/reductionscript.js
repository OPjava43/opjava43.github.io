// Define the Fracture Reduction sections object to store the pressed button values
let fractureReductionSections = {
    'consent': [],
    'Location': [],
    'Fracture Type': [],
    'Pre-test Exam': [],
    'Sedation/Analgesia': [],
    'Technique': [],
    'Splinting': [],
    // ADDED
    'Ambulatory Assist Devices': [],
    'Post-reduction exam/tests': [],
    'Complications': [],
    'Provider': []
};

// Function to handle button clicks for Fracture Reduction sections with multiple selections
function handleButtonClick(button, description) {
    const section = button.getAttribute('data-section');

    // Toggle the button's pressed state
    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');

        // Remove the description from the fractureReductionSections array for this section
        fractureReductionSections[section] = fractureReductionSections[section].filter(item => item !== description);
    } else {
        button.classList.add('pressed');

        // Add the description to the fractureReductionSections array for this section
        fractureReductionSections[section].push(description);
    }

    // Update the Fracture Reduction output with the new values
    updateFractureReductionOutput();
}

// Function to handle real-time text input (free text) and append to existing output
function updateRealTimeText(section, textAreaId) {
    const textValue = document.getElementById(textAreaId).value.trim();

    // Append the new text to existing button-generated output if any
    if (textValue) {
        if (Array.isArray(fractureReductionSections[section])) {
            fractureReductionSections[section].push(textValue);
        } else {
            fractureReductionSections[section] = (fractureReductionSections[section] ? fractureReductionSections[section] + ', ' : '') + textValue;
        }
    } else {
        // If emptied, do nothing special (keeps button outputs intact)
        // NOTE: This matches your current script behavior, even though it can duplicate free text over time.
    }

    // Update the Fracture Reduction output
    updateFractureReductionOutput();
}

// Function to update the Fracture Reduction Output
function updateFractureReductionOutput() {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = ''; // Clear the existing output

    // Create the main Fracture Reduction Interpretation header
    const mainHeader = document.createElement('h2');
    mainHeader.textContent = 'Procedure Note: Fracture Reduction';
    outputArea.appendChild(mainHeader);

    // Generate detailed outputs for each section (in object insertion order)
    for (const section in fractureReductionSections) {
        if (
            fractureReductionSections[section] &&
            (Array.isArray(fractureReductionSections[section])
                ? fractureReductionSections[section].length > 0
                : fractureReductionSections[section])
        ) {
            const sectionDiv = document.createElement('div');
            sectionDiv.innerHTML = `<strong>${section}:</strong> ${
                Array.isArray(fractureReductionSections[section])
                    ? fractureReductionSections[section].join(', ')
                    : fractureReductionSections[section]
            }`;
            outputArea.appendChild(sectionDiv);
        }
    }
}

// Function to clear the Fracture Reduction output and reset the buttons
function clearOutput() {
    // Reset all sections
    fractureReductionSections = {
        'consent': [],
        'Location': [],
        'Fracture Type': [],
        'Pre-test Exam': [],
        'Sedation/Analgesia': [],
        'Technique': [],
        'Splinting': [],
        // ADDED
        'Ambulatory Assist Devices': [],
        'Post-reduction exam/tests': [],
        'Complications': [],
        'Provider': []
    };

    // Clear all text areas
    document.querySelectorAll('textarea').forEach(textarea => (textarea.value = ''));

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