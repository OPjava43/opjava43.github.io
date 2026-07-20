// Define the order of sections
const sectionOrder = ['SpecificConcerns', 'DiagnosticsOffered', 'RiskMitigation'];

// Function to initialize the output with the intro text
function initializeOutput() {
    const outputArea = document.getElementById('outputArea');
    const introTextId = 'introText';

    // Ensure the introText always exists
    if (!document.getElementById(introTextId)) {
        const introDiv = document.createElement('div');
        introDiv.id = introTextId;
        introDiv.innerHTML = `
            <h2>Against Medical Advice</h2>
            <p>
                Despite extensive discussion with the patient, they have decided to leave the emergency department against medical advice. 
                The patient clinically not intoxicated, free from distracting pain, appears to have intact insight, judgment and reason and 
                in my medical opinion has the capacity to make decisions. The patient is also not under any duress to leave the hospital. 
                I have voiced my concerns for the patient's health given that a full evaluation and treatment has not occurred. I have 
                discussed the need for continued evaluation to determine if their symptoms are caused by a condition that presents risk of 
                death or morbidity. Risks including but not limited to death, permanent disability, prolonged hospitalization, prolonged 
                illness, were discussed. However, the patient declined my options and insisted on leaving. Because I have been unable to 
                convince the patient to stay, I answered all of their questions about their condition and asked them to return to the ED as 
                soon as possible to complete their evaluation, especially if their symptoms worsen or do not improve. I emphasized that 
                leaving against medical advice does not preclude returning here for further evaluation. I asked the patient to return if 
                they change their mind about the further evaluation and treatment.
            </p>
        `;
        outputArea.appendChild(introDiv);
    }
}

// Function to add button-generated text
function addText(text, button) {
    const sectionName = button.getAttribute('data-section');
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');

    // Find or create the section div
    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `<strong>${formatSectionName(sectionName)}:</strong> <span class="output-text"></span><br>`;
        outputArea.appendChild(sectionDiv);
    }

    const outputText = sectionDiv.querySelector('.output-text');

    // Add button-generated text, ensuring no duplicates
    if (!outputText.textContent.includes(text)) {
        outputText.textContent += (outputText.textContent ? ', ' : '') + text;
    }

    // Mark the button as pressed
    button.classList.add('pressed');
}

// Function to remove button-generated text
function removeText(text, button) {
    const sectionName = button.getAttribute('data-section');
    const sectionId = `output-${sectionName}`;
    const sectionDiv = document.getElementById(sectionId);

    if (sectionDiv) {
        const outputText = sectionDiv.querySelector('.output-text');

        // Remove the button-generated text
        const updatedText = outputText.textContent
            .split(', ')
            .filter(item => item !== text)
            .join(', ');

        outputText.textContent = updatedText;

        // If no text remains, remove the section
        if (!updatedText.trim()) {
            sectionDiv.remove();
        }
    }

    // Unmark the button as pressed
    button.classList.remove('pressed');
}

// Function to handle button clicks
function handleButtonClick(button, text) {
    if (button.classList.contains('pressed')) {
        removeText(text, button);
    } else {
        addText(text, button);
    }
}

// Function to handle free text updates
function updateRealTimeText(sectionTitle, textareaId) {
    const textarea = document.getElementById(textareaId);
    const sectionId = `output-${textareaId.replace('Text', '')}`;
    const outputArea = document.getElementById('outputArea');

    // Find or create the section div
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
        if (!outputText.textContent.includes(newText)) {
            outputText.textContent += (outputText.textContent ? ', ' : '') + newText;
        }
    } else {
        sectionDiv.remove();
    }
}

// Function to format section names
function formatSectionName(section) {
    return section.replace(/([A-Z])/g, ' $1').trim();
}

// Function to copy output to clipboard
function copyToClipboard() {
    const outputArea = document.getElementById('outputArea');
    const tempElement = document.createElement('textarea');
    tempElement.value = outputArea.innerText;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement);
}

// Function to clear the output area (except for introText)
function clearOutput() {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = '';
    initializeOutput();
    document.querySelectorAll('textarea').forEach(textarea => (textarea.value = ''));
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));
}

// Initialize the output on page load
document.addEventListener('DOMContentLoaded', initializeOutput);
