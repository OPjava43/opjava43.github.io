function timeNow(id) {
    const textarea = document.getElementById(id);
    const now = new Date();
    // 24-hour HH:MM format
    const formattedTime = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });

    // 1) Put time into the textarea
    if (textarea) {
        textarea.value = formattedTime;
        updateText(textarea)
    }
}
function timeCheck(textareaId) {
    const textarea = document.getElementById(textareaId);
    if (!textarea || !textarea.value.trim()) {
        showCopyError("Please include an intubation time in your note.");
    } else {
        showCopyError("");
    }
}

function showCopyError(message) {
    const errorId = 'copyErrorMessage';
    let errorElem = document.getElementById(errorId);

    if (!errorElem) {
        errorElem = document.createElement('div');
        errorElem.id = errorId;
        errorElem.style.color = 'red';
        errorElem.style.fontWeight = 'bold';
        errorElem.style.marginTop = '8px';

        // Insert right after the "Clear" button inside the output-section
        const clearButton = document.querySelector('button[onclick="clearOutput()"]');
        if (clearButton && clearButton.parentNode) {
            clearButton.parentNode.insertBefore(errorElem, clearButton.nextSibling);
        } else {
            // Fallback: append inside .output-section, then body as last resort
            const outputSection = document.querySelector('.output-section');
            if (outputSection) {
                outputSection.appendChild(errorElem);
            } else {
                document.body.appendChild(errorElem);
            }
        }
    }

    errorElem.textContent = message || '';
}