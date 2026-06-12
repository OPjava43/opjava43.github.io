// Define the Procedural Sedation sections object to store the pressed button values
let sedationSections = {
    'consent': [],
    'Timeout': [],
    'Indication': [],
    'Pre-sedation assessment': [],
    'Preparation/monitoring': [],
    'Medication': [],
    'Complications': [],
    'Post-procedure assessment': [],
    'Total time spent at bedside': [],
    'Provider': []
};

// Function to handle button clicks for Procedural Sedation sections with multiple selections
function handleButtonClick(button, description) {
    const section = button.getAttribute('data-section');

    if (!sedationSections.hasOwnProperty(section)) return; // safety check

    // Toggle the button's pressed state
    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');
        sedationSections[section] = sedationSections[section].filter(item => item !== description);
    } else {
        button.classList.add('pressed');
        sedationSections[section].push(description);
    }

    updateSedationOutput();
}

// Function to handle real-time text input (free text)
function updateRealTimeText(section, textAreaId) {
    if (!sedationSections.hasOwnProperty(section)) return; // safety check

    // Remove previous free text input for that section
    sedationSections[section] = sedationSections[section].filter(item => !item.startsWith('FREE_TEXT:'));

    const textValue = document.getElementById(textAreaId).value.trim();

    if (textValue) {
        sedationSections[section].push(`FREE_TEXT:${textValue}`);
    }

    updateSedationOutput();
}

// Function to update the Procedural Sedation Output
function updateSedationOutput() {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = ''; // Clear existing output

    const mainHeader = document.createElement('h2');
    mainHeader.textContent = 'Procedure Note: Procedural Sedation';
    outputArea.appendChild(mainHeader);

    for (const section in sedationSections) {
        const values = sedationSections[section].map(item =>
            item.startsWith('FREE_TEXT:') ? item.replace('FREE_TEXT:', '') : item
        );

        if (values.length > 0) {
            const sectionDiv = document.createElement('div');
            sectionDiv.innerHTML = `<strong>${section}:</strong> ${values.join(', ')}`;
            outputArea.appendChild(sectionDiv);
        }
    }
}

// Function to clear the Procedural Sedation output and reset the buttons
function clearOutput() {
    for (const section in sedationSections) {
        sedationSections[section] = [];
    }

    document.querySelectorAll('textarea').forEach(textarea => textarea.value = '');
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));
    document.getElementById('outputArea').innerHTML = '';
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
