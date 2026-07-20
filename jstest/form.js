const outputArea = document.getElementById('outputArea');

const SECTIONS = [...document.querySelectorAll('[data-replace]')]
    .map(el => el.dataset.replace);
const NOTE_HEADING = document.querySelector('.title')?.textContent ?? '';
const selected = {};
const textState = {};
let NOTE_TEMPLATE = ``;

function getReplace(el) {
    return el.closest('[data-replace]')?.dataset.replace;
}

function fmt(text) {
    return text
        .replace(/&#10;/g, '<br><strong>&bull;</strong>&nbsp;&nbsp;&nbsp;&nbsp;')
        .replace(/\n/g, '<br>')
}


function render() {
    let NOTE = NOTE_TEMPLATE;
    SECTIONS.forEach(replace => {
        if (replace === 'date_time') {
            const datetimeEl = document.querySelector('input[type="datetime-local"]');
            const datetime = datetimeEl?.value 
                ? new Date(datetimeEl.value).toLocaleString('en-US', {
                    month: 'numeric',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                })
                : '<strong>[date/time]</strong>';
            NOTE = NOTE.replace(/{{date_time}}/g, datetime);
            return;
        }
        const replaceEl = document.querySelector(`[data-replace="${replace}"]`);
        if (replaceEl?.dataset.display === 'false') return;
        if (replaceEl?.classList.contains('hidden')) return;
        const boxes = selected[replace] ? [...selected[replace]] : [];
        const freetext = textState[replace] || '';
        // Combine both sources, drop empty strings
        const val = [...boxes, freetext].filter(Boolean).join(', ');
        NOTE = NOTE.replace(new RegExp(`{{${replace}}}`, 'g'), val || `<strong>[${replace}]</strong>`);
    })

    NOTE = NOTE.replace(/{{[^}]+}}/g, (match) => {
        const key = match.slice(2, -2); // strip {{ and }}
        const boxes = selected[key] ? [...selected[key]] : [];
        const freetext = textState[key] || '';
        const val = [...boxes, freetext].filter(Boolean).join(', ');
        return val || `<strong>[${key}]</strong>`;
    });


    outputArea.innerHTML = `<h2>${NOTE_HEADING}</h2>${fmt(NOTE)}`;
}


function boxchecked(box) {

    const replace = getReplace(box);
    const label = box.closest('label');
    const text = box?.dataset.text ?? label?.textContent.trim();

    if (!selected[replace]) selected[replace] = new Set();

    const checked = box.checked;

    if (!text) return;
    checked ? selected[replace].add(text) : selected[replace].delete(text);

    if (box.dataset.reveal) {
        const el = document.getElementById(box.dataset.reveal);
        if (el) el.classList.toggle('hidden', !box.checked);
    }
    render();
}


function updateText(textarea) {
    const replace = getReplace(textarea);
    const content = fmt(textarea.value.trim());
    textState[replace] = textarea.value.trim();
    
    render();
}

// ─── Copy ────────────────────────────────────────────────────────────────────

async function copyOutput() {
    const range = document.createRange();
    range.selectNode(outputArea);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}
// ─── Clear ────────────────────────────────────────────────────────────────────
function clearOutput() {
    Object.keys(selected).forEach(k => delete selected[k]);
    Object.keys(textState).forEach(k => delete textState[k]);
    document.querySelectorAll('.hidden[id]').forEach(el => el.classList.add('hidden'));
    outputArea.innerHTML = '';
    document.querySelectorAll('input[type="checkbox"]').forEach(b => b.checked = false);
    document.querySelectorAll('textarea').forEach(t => t.value = '');

    if (typeof showCopyError === "function") showCopyError("");
}



// ─── Event delegation ────────────────

 
document.addEventListener('change', e => {
    const ta = e.target.closest('textarea');
    if (ta) { updateText(ta); return; }

    const checkbox = e.target.closest('input[type="checkbox"]');
    if (checkbox) { boxchecked(checkbox); return; }

    const datetime = e.target.closest('input[type="datetime-local"]');
    if (datetime) { render(); return; }

    const input = e.target.closest('input');
    if (input) render();
});


