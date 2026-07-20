

const SECTIONS = [...document.querySelectorAll('[data-section]')]
    .map(el => el.dataset.section);

const outputArea = document.getElementById('outputArea');
const NOTE_HEADING = document.querySelector('.title')?.textContent ?? '';
let NOTE_INTRO = '';



const state = {};
const textState = {};     // strings — for textareas
const inputState = {}; 
const revealState = {};

function getSection(el) {
    return el.closest('[data-section]')?.dataset.section;
}

function defaltSet(id) {
    const btn = document.getElementById(id);
    btnClick(btn);
}

function reveal(btn){
    if (btn.dataset.reveal) {
        const isPressed = btn.classList.contains('pressed');
        btn.dataset.reveal.split(',').forEach(id => {
            id = id.trim();
            const el = document.getElementById(id);
            if (!el) return;
            const section = getSection(el);
            if (!revealState[id]) revealState[id] = 0;
            revealState[id] += isPressed ? -1 : 1;
            el.classList.toggle('hidden', revealState[id] === 0);
            if (!!el.querySelector('input')) {
                if( el.classList.contains('hidden')) {
                    delete inputState[section];
                    render()
                }else{
                    updateText(el.querySelector('input'), true);
                }
            } else {
                render()
            }
        });
    }
}



function btnClick(btn) {
    // handle reveal first, before data-text check
    const section = getSection(btn);
    // Fall back to data-text if text not passed directly
    const value = btn.dataset.text;

    reveal(btn);

    if (!state[section]) state[section] = new Set();
 
    const added = btn.classList.toggle('pressed');

    if (!value) return;
    added ? state[section].add(value) : state[section].delete(value);

    
    render();
}


function togglegroup(btn) {
    const section = getSection(btn);
    const currentlyPressed = document.querySelector(
        `[data-section="${section}"] button.pressed`
    );
    if (currentlyPressed && currentlyPressed !== btn) {
        currentlyPressed.classList.remove('pressed');
        const val = currentlyPressed.dataset.text;
        state[section]?.delete(val);
    }
    btnClick(btn);
}

function timeNow(btn) {
    const section = getSection(btn);
    const textarea =  document.querySelector(
        `[data-section="${section}"] textarea`
    );
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

const today = new Date().toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric', 
    year: 'numeric'
});

document.querySelectorAll('textarea[data-default="date"]').forEach(ta => {
    ta.value = today;
    updateText(ta);
});

document.querySelectorAll('input[type="number"]').forEach(input => {
    input.style.width = input.value.length + .5 + 'ch';
    input.addEventListener('input', () => {
        input.style.width = input.value.length + .5 + 'ch';
    });
});

function updateText(textarea, input = false) {
    const section = getSection(textarea);
    const content = textarea.value.trim();
    if (input) {
        const text = textarea.dataset.text
        if (text){
            if (!inputState[section]) inputState[section] = new Set();
            inputState[section] = text.replace(/{{input}}/g, content || '___')
        }
    } else {
        if (!textState[section]) textState[section] = new Set();
        textState[section] = textarea.value.trim();
    }
    
    render();
}


function render() {
    const lines = SECTIONS
        .map(section => {
            const sectionEl = document.querySelector(`[data-section="${section}"]`);
            if (sectionEl?.dataset.display === 'false') return;
            if (sectionEl?.classList.contains('hidden')) return;

            const buttons = state[section] ? [...state[section]] : [];
            const freetext = textState[section] || '';
            const inputtext = inputState[section] || '';
            const title = document.querySelector(`[data-section="${section}"] h3`)?.textContent;
            // Combine both sources, drop empty strings
            const val = [...buttons, inputtext, freetext].filter(Boolean).join(', ');
            const formattedVal = fmt(val);
            
            return val ? `<strong>${title}:</strong> ${formattedVal}` : '';
        })
        .filter(Boolean);

    outputArea.innerHTML = `<h2>${NOTE_HEADING}</h2><p>${fmt(NOTE_INTRO)}</p>${lines.map(l => `<div>${l}</div>`).join('')}`;
}

function fmt(text) {
    const date = document.querySelector(`[data-section="date"] textarea`)?.value;
    const time = document.querySelector(`[data-section="time"] textarea`)?.value;
    return text
        .replace(/\n/g, '<br>')
        .replace(/_([^_]+)_/g, '<u>$1</u>')
        .replace(/{{date}}/g, date? date : '____')
        .replace(/{{time}}/g, time? time : '____')
}

// Function to trigger macros

function triggerMacro(keys, macroBtn) {    
    const wasPressed = macroBtn.classList.contains('pressed'); // check BEFORE clearing
    clearOutput();
    if (!wasPressed) {
        keys.forEach(key => {
            const dashIndex = key.indexOf('-');
            const section  = key.slice(0, dashIndex);
            const label    = key.slice(dashIndex + 1);
        
            const match = Array.from(
                document.querySelector(`[data-section="${section}"]`)
                    .querySelectorAll('button')
                ).find(btn => btn.innerText.trim() === label);
            
            if (match) {
                btnClick(match);
            } else {
                console.warn(`Macro: no button found for section="${section}" label="${label}"`);
            }
        });
        macroBtn.classList.add('pressed');
    }

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
    Object.keys(state).forEach(k => delete state[k]);
    Object.keys(textState).forEach(k => delete textState[k]);
    Object.keys(revealState).forEach(k => delete revealState[k]);
    Object.keys(inputState).forEach(k => delete inputState[k]);
    document.querySelectorAll('.reveal-target').forEach(el => el.classList.add('hidden'));
    outputArea.innerHTML = '';
    document.querySelectorAll('.pressed').forEach(b => b.classList.remove('pressed'));
    document.querySelectorAll('textarea').forEach(t => t.value = '');
    document.querySelectorAll('input[type="number"]').forEach(i => i.value = '');

    if (typeof showCopyError === "function") showCopyError("");
    
    document.querySelectorAll('textarea[data-default="date"]').forEach(ta => {
        ta.value = today;
    });
}

function testFill() {
    document.querySelectorAll('[data-text]').forEach(btn => {
        if (!btn.classList.contains('pressed')) btn.click();
    });
    document.querySelectorAll('textarea').forEach(ta => {
        ta.value = 'test text';
        updateText(ta);
    });
}



// ─── Event delegation ────────────────
document.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (!btn.closest('[data-section]')) return;
    if (btn.dataset.action === 'time-now') {
        timeNow(btn);
    } else if (btn.dataset.group === 'toggle') {
        togglegroup(btn);
    } else {
        btnClick(btn);
    }

});
 
document.addEventListener('change', e => {
    const ta = e.target.closest('textarea');
    if (ta) updateText(ta);

    const input = e.target.closest('input');
    if (input) updateText(input,true);
    
});