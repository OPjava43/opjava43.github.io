// ORDER OF SECTIONS
const sectionOrder = [
    'general', 'heent', 'neck', 'cardiac', 'respiratory',
    'abdominal', 'msk', 'skin', 'neuro', 'psych'
];

// ADD TEXT FROM BUTTON PRESS
function addText(text, button) {
    const sectionName = button.getAttribute('data-section');
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');

    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `<strong>${capitalize(sectionName)}:</strong> <span class="output-text"></span><br>`;
        outputArea.appendChild(sectionDiv);
    }

    const outputText = sectionDiv.querySelector('.output-text');

    if (!outputText.textContent.includes(text)) {
        outputText.textContent += (outputText.textContent ? ', ' : '') + text;
    }

    button.classList.add('pressed');
    reorderSections(outputArea);
    addMainHeader(outputArea);
}

// REMOVE TEXT WHEN BUTTON UNPRESSED
function removeText(text, button) {
    const sectionName = button.getAttribute('data-section');
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');

    const sectionDiv = document.getElementById(sectionId);
    const outputText = sectionDiv.querySelector('.output-text');

    outputText.textContent = outputText.textContent
        .split(', ')
        .filter(item => item !== text)
        .join(', ');

    if (!outputText.textContent.trim()) {
        sectionDiv.remove();
    }

    button.classList.remove('pressed');
    removeMainHeader(outputArea);
}

function handleButtonClick(button, text) {
    if (button.classList.contains('pressed')) {
        removeText(text, button);
    } else {
        addText(text, button);
    }
}

// FREE TEXT UPDATES
function updateRealTimeText(sectionTitle, textareaId) {
    const textarea = document.getElementById(textareaId);
    let sectionName = sectionTitle.toLowerCase().replace(/\s+/g, '');
    const outputArea = document.getElementById('outputArea');

    const sectionId = `output-${sectionName}`;

    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `<strong>${capitalize(sectionName)}:</strong> <span class="output-text"></span><br>`;
        outputArea.appendChild(sectionDiv);
    }

    const outputText = sectionDiv.querySelector('.output-text');
    let newText = textarea.value.trim();

    if (newText) {
        outputText.textContent = outputText.textContent
            ? `${outputText.textContent}, ${newText}`
            : newText;
    } else {
        sectionDiv.remove();

        const buttons = document.querySelectorAll(`button[data-section="${sectionName}"]`);
        buttons.forEach(button => button.classList.remove('pressed'));
    }

    reorderSections(outputArea);
    addMainHeader(outputArea);
    removeMainHeader(outputArea);
}

// MAIN HEADER MANAGEMENT
function addMainHeader(outputArea) {
    if (!outputArea.querySelector('h2') && outputArea.innerHTML.trim() !== '') {
        const mainTitle = document.querySelector('.form-section h2').innerText;
        outputArea.insertAdjacentHTML('afterbegin', `<h2>${mainTitle}</h2><br>`);
    }
}

function removeMainHeader(outputArea) {
    if (!outputArea.innerHTML.trim()) {
        const header = outputArea.querySelector('h2');
        if (header) header.remove();
    }
}

// REORDER SECTIONS
function reorderSections(outputArea) {
    sectionOrder.forEach(section => {
        const sectionDiv = document.getElementById(`output-${section}`);
        if (sectionDiv) {
            outputArea.appendChild(sectionDiv);
        }
    });
}

// CAPITALIZE FOR DISPLAY
function capitalize(section) {
    if (section === 'msk') return 'MSK';
    if (section === 'heent') return 'HEENT';
    return section.charAt(0).toUpperCase() + section.slice(1);
}

// COPY
function copyToClipboard() {
    const outputArea = document.getElementById('outputArea');
    const range = document.createRange();
    range.selectNode(outputArea);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}

// CLEAR
function clearOutput() {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = '';

    document.querySelectorAll('.pressed').forEach(button => {
        button.classList.remove('pressed');
    });

    removeMainHeader(outputArea);
}
