const SHARED_SECTIONS = {
    consent: `
        <h3>Consent</h3>
        <button data-text="potential benefits and harm as well as alternatives were explained to patient/family. Patient/family was given the opportunity to ask questions and patient agrees to proceed with planned procedure">verbal</button>
        <button data-text="potential benefits and harm as well as alternatives were explained to patient/family. Patient/family was given the opportunity to ask questions and patient agrees to proceed with planned procedure, the consent form was signed.">signed</button>
        <button data-text="due to the emergent nature of the procedure, consent not obtained">emergent</button>
        <button data-text="patient gave informed consent: risks/benefits/alternatives discussed">patient</button>
        <button data-text="family gave informed consent: risks/benefits/alternatives discussed">family</button>
        <textarea></textarea>
    `,
    proc_consent: `
        <h3>Consent</h3>
        <button data-section="consent" onclick="handleButtonClick(this, 'potential benefits and harm as well as alternatives were explained to patient/family. patient/family was given the opportunity to ask questions and patient agrees to proceed with planned procedure')">verbal</button>
        <button data-section="consent" onclick="handleButtonClick(this, 'potential benefits and harm as well as alternatives were explained to patient/family. patient/family was given the opportunity to ask questions and patient agrees to proceed with planned procedure, the consent form was signed.')">signed</button>
        <button data-section="consent" onclick="handleButtonClick(this, 'due to the emergent nature of the procedure, consent not obtained')">emergent</button>
        <button data-section="consent" onclick="handleButtonClick(this, 'patient gave informed consent: risks/benefits/alternatives discussed')">patient</button>
        <button data-section="consent" onclick="handleButtonClick(this, 'family gave informed consent: risks/benefits/alternatives discussed')">family</button>
        <textarea id="consentText" placeholder="" onchange="updateRealTimeText('Consent', 'consentText')"></textarea>
    `
};

class YesNo extends HTMLElement {
    connectedCallback() {
        const heading = this.getAttribute('heading');
        const yesScore = this.getAttribute('yes-score') ?? 1;
        const noScore = this.getAttribute('no-score') ?? 0;

        this.outerHTML = `
            <div data-section="${section}">
                <h3>${heading}</h3>
                <button data-group="toggle" data-score="${yesScore}">yes</button>
                <button data-group="toggle" data-score="${noScore}">no</button>
            </div>
        `;
    }
}

customElements.define('yes-no', YesNo);

function loadShared(section) {
    const div = document.querySelector(`[data-section="${section}"]`);
    if (!div) return;
    div.innerHTML = SHARED_SECTIONS[section];
}