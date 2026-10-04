

const SECTIONS = [...document.querySelectorAll('[data-section]')]
    .map(el => el.dataset.section);

const outputArea = document.getElementById('outputArea');
const NOTE_HEADING = document.querySelector('.title')?.textContent ?? '';
let NOTE_INTRO = '';


//const state = {};
//const inputState = {}; 
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
            if (!revealState[id]) revealState[id] = 0;
            revealState[id] += isPressed ? -1 : 1;
            el.classList.toggle('hidden', revealState[id] === 0);
            if (el.tagName === "BUTTON" && el.classList.contains('pressed')){
                el.classList.toggle('pressed');
            }
            if (!!el.querySelector('input')) {
                if( !el.classList.contains('hidden')) {
                    render();
                }
            }
        });
        render();
    }
}



function btnClick(btn) {
    reveal(btn);

 
    btn.classList.toggle('pressed');
    
    render();
}


function togglegroup(btn, group) {

    const currentlyPressed = document.querySelector(
        `[data-group="${group}"] button.pressed`
    );
    if (currentlyPressed && currentlyPressed !== btn) {
        btnClick(currentlyPressed)
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
        render();
    }

}

const today = new Date().toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric', 
    year: 'numeric'
});

document.querySelectorAll('textarea[data-default="date"]').forEach(ta => {
    ta.value = today;
    render();
});

document.querySelectorAll('input[type="number"]').forEach(input => {
    input.style.width = input.value.length + .5 + 'ch';
    input.addEventListener('input', () => {
        input.style.width = input.value.length + .5 + 'ch';
    });
});

// function updateText(textarea) {
//     const section = getSection(textarea);
//     const key = textarea.dataset.key || 'default';
    
//     if (!textState[section]) textState[section] = {};

//     const unit = textarea.closest('[data-unit]')?.dataset.unit ?? false;

//     const text = textarea.closest('[data-text]')?.dataset.text ?? false;
//     let content = textarea.value.trim();

//     if (unit && content){
//         content += " " + unit.trim();
//     }


//     if (text){
//         textState[section][key] = text
//             .replace(/{{input}}/g, content || '___')
//             .replace (/{{response}}/g,[content, getChildren(textarea.parentElement)]
//             .filter(Boolean)
//             .join(", ") || '____');
//     } else {
//         textState[section][key] = content;
//     }
    
//     render();
// }


function getChildren(div) {
    const buttons = div.querySelectorAll("button.pressed");
    //const textarea = div.querySelector('textarea,input[type="number"],input[type="text"]');

    const btntext = [...buttons].map(btn => btn.innerText.trim());
    //const text = textarea.value.trim();

    return [...btntext].filter(Boolean).join(', ');
}

function render() {
    let INTRO = NOTE_INTRO

    const lines = SECTIONS
        .map(section => {
            const sectionEl = document.querySelector(`[data-section="${section}"]`);
            const altloc = sectionEl.dataset.loc ?? false;
            const format = sectionEl.dataset.format ?? false;
            const pretext = document.querySelector(`[data-section="${section}"][data-pretext]`)?.dataset.pretext;
            const sectiontxt =  sectionEl.dataset.text ?? false;


            if (sectionEl?.dataset.display === 'false') return;
            if (sectionEl?.classList.contains('hidden')) return;

            const groups = [...sectionEl.querySelectorAll(`[data-section="${section}"] [data-group]`)];
            const targets = groups.length ? [sectionEl, ...groups] : [sectionEl];

            const datagroups = targets
                .map(group => {
                    const grouptext =  group.dataset.text ?? false;

                    const children = [...group.querySelectorAll('button, textarea, input')]
                        .filter(child => group !== sectionEl || !child.closest('[data-group]'))
                        .map(child => {

                            if (child.closest('hidden')) return;
                            let value = "";
                            const unit = child.closest('[data-unit]')?.dataset.unit ?? false;
                            const text = child.dataset.text ?? false;
                            
                            if (child.tagName === "BUTTON" && child.classList.contains('pressed')){
                                const btnVal = (child.dataset.text ?? child.innerText.trim()) + (unit ? ' ' + unit.trim() : '');
                                                          
                                if (btnVal){
                                    value = btnVal;
                                }
                            }
                            if ((child.tagName === "TEXTAREA" || child.tagName === "INPUT") && child.value) {                                                 
                                let content = child.value.trim();
                                if (unit && content){
                                    content += " " + unit.trim();
                                }
                                if (text){
                                    content = text
                                        .replace(/{{input}}/g, content || '___');
                                } 
                                value = content;
                            }
                            if (!value){
                                return;
                            }
                            return value;
                        })
                        .filter(Boolean)
                        .join(', ');

                    let value = children;

                    if (grouptext && value){
                        value = grouptext.replace(/{{}}/g, value)
                    }

                    return value;      

            })
            .filter(Boolean)
            .join(', ');

            let value = datagroups;

            if (sectiontxt && value){
                value = sectiontxt.replace(/{{}}/g, value)
            }


            if (altloc == "introNote"){
                if (!value) return;
                const newIntro = fmt([INTRO, pretext, value].filter(Boolean).join(' '));
                INTRO = newIntro + '.';
                return '';
            }

            const title = document.querySelector(`[data-section="${section}"] h3`)?.textContent;

            const formattedVal = fmt(value, format);

            return value ? `<strong>${title}:</strong> ${formattedVal}` : '';
        })
        .filter(Boolean);

    outputArea.innerHTML = `<h2>${NOTE_HEADING}</h2><p>${fmt(INTRO, true)}</p>${lines.map(l => `<div>${l}</div>`).join('')}`;
}

function fmt(text, format) {
    let fmttext=text;
    if (format === "datetime" || format===true){
        const date = document.querySelector(`[data-section="date"] textarea`)?.value;
        const time = document.querySelector(`[data-section="time"] textarea`)?.value;
        fmttext = text
            .replace(/{{date}}/g, date? date : '____')
            .replace(/{{time}}/g, time? time : '____');
    } else if (format==="nocomma") {
        fmttext = text.replace(/,/g, "");
    }
    
    return fmttext
        .replace(/\n/g, '<br>')
        .replace(/_([^_]+)_/g, '<u>$1</u>')
        .replace('.,', '.');
}

// Function to trigger macros

function triggerMacro(keys, macroBtn) {
    const wasPressed = macroBtn.classList.contains('pressed'); // check BEFORE clearing
    clearOutput();
    if (!wasPressed) {
        keys.forEach(key => {
            const parts = key.split('-');
            const section = parts[0];
            const labels = parts.slice(1); // one or more labels for this section

            const sectionEls = document.querySelectorAll(`[data-section="${section}"]`);

            labels.forEach(label => {
                let matches = [];
                sectionEls.forEach(sectionEl => {
                    matches.push(
                        ...Array.from(sectionEl.querySelectorAll('button'))
                            .filter(btn => btn.innerText.trim() === label)
                    );
                });

                if (matches.length) {
                    matches.forEach(match => {
                        if (match.dataset.action === 'time-now') {
                            timeNow(match);
                        } else if (match.closest('[data-group]')?.dataset.group) {
                            togglegroup(match, match.closest('[data-group]')?.dataset.group);
                        } else {
                            btnClick(match);
                        }
                    });
                } else {
                    console.warn(`Macro: no button found for section="${section}" label="${label}"`);
                }
            });
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
    // Object.keys(state).forEach(k => delete state[k]);
    // Object.keys(textState).forEach(k => delete textState[k]);
    Object.keys(revealState).forEach(k => delete revealState[k]);
    // Object.keys(inputState).forEach(k => delete inputState[k]);
    document.querySelectorAll('.reveal-target').forEach(el => el.classList.add('hidden'));
    outputArea.innerHTML = '';
    document.querySelectorAll('.pressed').forEach(b => b.classList.remove('pressed'));
    document.querySelectorAll('textarea').forEach(t => t.value = '');
    document.querySelectorAll('input[type="number"], input[type="text"]').forEach(i => i.value = '');

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
    });
    render();
}



// ─── Event delegation ────────────────
document.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (!btn.closest('[data-section]')) return;

    if (btn.dataset.action === 'time-now') {
        timeNow(btn);
    } else if (btn.closest('[data-group]')?.dataset.group) {
        togglegroup(btn, btn.closest('[data-group]')?.dataset.group);
    } else {
        btnClick(btn);
    }

});
 
document.addEventListener('change', e => {
    const ta = e.target.closest('textarea');
    if (ta) render();

    const input = e.target.closest('input');
    if (input) render();
    
});