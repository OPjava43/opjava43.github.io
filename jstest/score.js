

const SECTIONS = [...document.querySelectorAll('[data-section]')]
    .map(el => el.dataset.section);

const outputArea = document.getElementById('outputArea');
const NOTE_HEADING = document.querySelector('.title')?.textContent ?? '';
let NOTE_INTRO = '';
let SCORE_CONFIG = [];
let SCORE_NAME = '';

function getSection(el) {
    return el.closest('[data-section]')?.dataset.section;
}

function scorebtnClick(btn) {
    let section = getSection(btn);
    document.querySelectorAll(`[data-section="${section}"] button.pressed`)
        .forEach(el => {
            if (el !== btn){
                el.classList.remove('pressed')
            }
        })

    btn.classList.toggle('pressed');
    render(calc());
}



function defaltSet(id) {
    btn = document.getElementById(id)
    btn.click();
}



function calc() {
    let score=0;
    const pressed = document.querySelectorAll(`.pressed`)
        .forEach(s => {
            score += Number(s.dataset.score ?? 0);
        });
    return score;
}

function render(score) {
    const range = SCORE_CONFIG.find(r => 
    (r.min == null || score >= r.min) &&
    (r.max == null || score <= r.max)
);
    if (!range) return '';

    const result = `<strong>${SCORE_NAME}:</strong> ${score}`;
    const base = fmt(range.message.replace('{{score}}', score));
    outputArea.innerHTML = `<h2>${NOTE_HEADING}</h2><p>${NOTE_INTRO}</p><p>${result}</p><p>${base}</p>`;
}

function fmt(text) {
    return text
        .replace(/\n/g, '<br>');
}

async function copyOutput() {
    const outputArea = document.getElementById('outputArea');
    const range = document.createRange();
    range.selectNode(outputArea);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}

function clearOutput() {
    outputArea.innerHTML = '';
    document.querySelectorAll('.pressed').forEach(b => b.classList.remove('pressed'));
    document.querySelectorAll('textarea').forEach(t => t.value = '');

    if (typeof showCopyError === "function") showCopyError("");
}

// ─── Event delegation ────────────────
document.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    scorebtnClick(btn);
    
});

