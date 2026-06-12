let arterialLineSections = {
    'consent': [],
    'Indication': [],
    'Location': [],
    'Ultrasound': [],
    'Technique': [],
    'Confirmation': [],
    'Complications': [],
    'Provider': []
};

function handleButtonClick(button, description) {
    const section = button.getAttribute('data-section');

    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');
        arterialLineSections[section] = arterialLineSections[section].filter(item => item !== description);
    } else {
        button.classList.add('pressed');
        arterialLineSections[section].push(description);
    }

    updateArterialLineOutput();
}

function updateRealTimeText(section, textAreaId) {
    const textValue = document.getElementById(textAreaId).value.trim();

    // Append the text to existing output
    if (textValue) {
        arterialLineSections[section] = arterialLineSections[section].concat(textValue);
    }

    updateArterialLineOutput();
}

function updateArterialLineOutput() {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = '<h2>Procedure Note: Arterial Line</h2>'; // Add header

    for (const section in arterialLineSections) {
        if (arterialLineSections[section].length > 0) {
            const sectionDiv = document.createElement('div');
            sectionDiv.innerHTML = `<strong>${section}:</strong> ${arterialLineSections[section].join(', ')}`;
            outputArea.appendChild(sectionDiv);
        }
    }

    // Append Ultrasound Additional Note
    if (arterialLineSections['Ultrasound'].includes('dynamic ultrasound was used to visualize the vessel and help guide needle placement')) {
        const usNote = document.createElement('div');
        usNote.innerHTML = `
            <h3>Procedure: Bedside vascular ultrasound</h3>
            <p><strong>Indication:</strong> vascular access guidance</p>
            <p><strong>Procedure:</strong> limited vascular ultrasound</p>
            <p><strong>Interpretation:</strong> vessel identified dynamically during procedure and the needle was visualized in vessel lumen. Images were saved in medical record and/or PACS.</p>
        `;
        outputArea.appendChild(usNote);
    }
}

function clearOutput() {
    arterialLineSections = {
        'consent': [],
        'Indication': [],
        'Location': [],
        'Ultrasound': [],
        'Technique': [],
        'Confirmation': [],
        'Complications': [],
        'Provider': []
    };

    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));
    document.querySelectorAll('textarea').forEach(textarea => textarea.value = '');
    document.getElementById('outputArea').innerHTML = '';
}

function copyToClipboard() {
    const outputArea = document.getElementById('outputArea');
    const range = document.createRange();
    range.selectNode(outputArea);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
}
