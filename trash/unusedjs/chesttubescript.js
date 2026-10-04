let chestTubeSections = {
    'consent': [],
    'Indication': [],
    'Preparation': [],
    'Technique': [],
    'Confirmation': [],
    'Complications': [],
    'Provider': []
};

function handleButtonClick(button, description) {
    const section = button.getAttribute('data-section');

    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');
        chestTubeSections[section] = chestTubeSections[section].filter(item => item !== description);
    } else {
        button.classList.add('pressed');
        chestTubeSections[section].push(description);
    }

    updateChestTubeOutput();
}

function updateRealTimeText(section, textAreaId) {
    const textValue = document.getElementById(textAreaId).value.trim();

    if (textValue) {
        chestTubeSections[section].push(textValue);
    }

    updateChestTubeOutput();
}

function updateChestTubeOutput() {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = ''; 

    const mainHeader = document.createElement('h2');
    mainHeader.textContent = 'Procedure Note: Chest Tube';
    outputArea.appendChild(mainHeader);

    for (const section in chestTubeSections) {
        if (chestTubeSections[section].length > 0) {
            const sectionDiv = document.createElement('div');
            sectionDiv.innerHTML = `<strong>${section}:</strong> ${chestTubeSections[section].join(', ')}`;
            outputArea.appendChild(sectionDiv);
        }
    }
}

function clearOutput() {
    chestTubeSections = {
        'consent': [],
        'Indication': [],
        'Preparation': [],
        'Technique': [],
        'Confirmation': [],
        'Complications': [],
        'Provider': []
    };

    document.querySelectorAll('textarea').forEach(textarea => textarea.value = '');
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));
    document.getElementById('outputArea').innerHTML = '';
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
