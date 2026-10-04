// ORDER OF SECTIONS (matches new layout)
const sectionOrder = [
    'last_known_well_time',
    'nih_score',
    'thrombolytics',
    'contraindications',
    'reasons_for_thrombolytic_delay'
];

function addText(text, button) {
    const sectionName = button.getAttribute('data-section');
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');
    addMainHeader();

    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `<strong>${formatSectionTitle(sectionName)}:</strong> <span class="output-text"></span><br>`;
        outputArea.appendChild(sectionDiv);
    }

    const outputText = sectionDiv.querySelector('.output-text');
    if (!outputText.textContent.includes(text)) {
        outputText.textContent += (outputText.textContent ? ', ' : '') + text;
    }

    button.classList.add('pressed');
    reorderSections(outputArea);
}

function removeText(text, button) {
    const sectionName = button.getAttribute('data-section');
    const sectionId = `output-${sectionName}`;
    const sectionDiv = document.getElementById(sectionId);

    if (sectionDiv) {
        const outputText = sectionDiv.querySelector('.output-text');
        outputText.textContent = outputText.textContent
            .split(', ')
            .filter(item => item !== text)
            .join(', ');

        if (!outputText.textContent.trim()) {
            sectionDiv.remove();
        }

        button.classList.remove('pressed');
        removeMainHeader();
    }
}

function handleButtonClick(button, text) {
    if (button.classList.contains('pressed')) {
        removeText(text, button);
    } else {
        addText(text, button);
    }
}

// Free text behavior (same pattern you already use)
function updateRealTimeText(sectionTitle, textareaId) {
    const textarea = document.getElementById(textareaId);
    const sectionName = textareaId.replace('Text', '');
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');
    addMainHeader();

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
        // Replace existing free-text content for this textarea-based section
        // by setting the whole section to the new text (prevents endless comma-growth on edits)
        outputText.textContent = newText;
    } else {
        sectionDiv.remove();

        // Unpress any buttons in this same section (if any exist)
        const buttons = document.querySelectorAll(`button[data-section="${sectionName}"]`);
        buttons.forEach(button => button.classList.remove('pressed'));
    }

    reorderSections(outputArea);
}

function formatSectionTitle(section) {
    return section
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
        .replace(/\bCt\b/i, 'CT')
        .replace(/\bNih\b/i, 'NIH')
        .replace(/\bLvo\b/i, 'LVO');
}

function reorderSections(outputArea) {
    sectionOrder.forEach(section => {
        const sectionDiv = document.getElementById(`output-${section}`);
        if (sectionDiv) {
            outputArea.appendChild(sectionDiv);
        }
    });
}

function addMainHeader() {
    const outputArea = document.getElementById('outputArea');
    if (!outputArea.querySelector('h2')) {
        outputArea.insertAdjacentHTML(
            'afterbegin',
            `<h2>Ischemic Stroke Management</h2><p>Due to a concern for stroke, the following actions were conducted after arrival to the emergency department:</p>`
        );
    }
}

function removeMainHeader() {
    const outputArea = document.getElementById('outputArea');

    // If only header + paragraph remain, remove them
    // (children length can vary due to whitespace nodes, so check for any output-* sections instead)
    const hasAnySection = !!outputArea.querySelector('[id^="output-"]');
    if (!hasAnySection) {
        const header = outputArea.querySelector('h2');
        const paragraph = outputArea.querySelector('p');
        if (header) header.remove();
        if (paragraph) paragraph.remove();
    }
}

function copyToClipboard() {
    const outputArea = document.getElementById('outputArea');
    const range = document.createRange();
    range.selectNode(outputArea);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}

function clearOutput() {
    document.getElementById('outputArea').innerHTML = '';
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));
    document.querySelectorAll('textarea').forEach(textarea => textarea.value = '');
}
