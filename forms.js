/**
 * EcoCycle Solutions — forms.js
 * Handles: enquiry form & contact form
 *   - Real-time validation
 *   - AJAX-style async submission (fetch / simulated)
 *   - Dynamic enquiry response (cost + availability)
 *   - Contact form compiles data into mailto: email
 */

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('enquiryForm')) initEnquiryForm();
    if (document.getElementById('contactForm'))  initContactForm();
});

/* ═══════════════════════════════════════════
   VALIDATION HELPERS
═══════════════════════════════════════════ */
const rules = {
    required: (v) => v.trim().length > 0,
    minLen:   (v, n) => v.trim().length >= n,
    maxLen:   (v, n) => v.trim().length <= n,
    email:    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    phone:    (v) => /^[+\d\s\-()]{7,15}$/.test(v.trim()),
    date:     (v) => !v || !isNaN(Date.parse(v)),
};

function validateField(input) {
    const group   = input.closest('.form-group');
    const errEl   = group?.querySelector('.error-msg');
    let   message = '';

    const v = input.value;

    if (input.required && !rules.required(v)) {
        message = 'This field is required.';
    } else if (input.type === 'email' && v && !rules.email(v)) {
        message = 'Please enter a valid email address.';
    } else if (input.dataset.phone !== undefined && v && !rules.phone(v)) {
        message = 'Please enter a valid phone number (7–15 digits).';
    } else if (input.minLength > 0 && v && !rules.minLen(v, input.minLength)) {
        message = `Must be at least ${input.minLength} characters.`;
    } else if (input.maxLength > 0 && !rules.maxLen(v, input.maxLength)) {
        message = `Must be at most ${input.maxLength} characters.`;
    } else if (input.type === 'date' && v && !rules.date(v)) {
        message = 'Please enter a valid date.';
    }

    if (message) {
        input.classList.add('error');
        input.classList.remove('valid');
        if (errEl) { errEl.textContent = message; errEl.classList.add('show'); }
        return false;
    } else {
        input.classList.remove('error');
        if (v.trim()) input.classList.add('valid');
        if (errEl) { errEl.textContent = ''; errEl.classList.remove('show'); }
        return true;
    }
}

function validateAll(form) {
    let valid = true;
    form.querySelectorAll('input, select, textarea').forEach(el => {
        if (!validateField(el)) valid = false;
    });
    return valid;
}

/* ═══════════════════════════════════════════
   ENQUIRY FORM
═══════════════════════════════════════════ */
function initEnquiryForm() {
    const form      = document.getElementById('enquiryForm');
    const typeSelect = document.getElementById('enquiryType');
    const serviceRow = document.getElementById('serviceRow');
    const responseEl = document.getElementById('enquiryResponse');
    const submitBtn  = document.getElementById('enquirySubmit');

    // Show/hide service field based on enquiry type
    typeSelect?.addEventListener('change', () => {
        const show = typeSelect.value === 'service';
        if (serviceRow) serviceRow.style.display = show ? '' : 'none';
        const svcInput = serviceRow?.querySelector('select');
        if (svcInput) svcInput.required = show;
    });

    // Live validation on blur/change
    form.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('blur',   () => validateField(el));
        el.addEventListener('change', () => validateField(el));
        el.addEventListener('input',  () => {
            if (el.classList.contains('error')) validateField(el);
        });
    });

    // Form submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateAll(form)) {
            showToast('Please fix the errors below before submitting.', 'error');
            form.querySelector('.error')?.focus();
            return;
        }

        // Collect data
        const data = Object.fromEntries(new FormData(form));

        // Simulate AJAX loading
        submitBtn.textContent = 'Sending…';
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;

        try {
            await simulateAjax(data, 'enquiry');
            showEnquiryResponse(data, responseEl);
            showToast('Enquiry submitted successfully!');
            form.reset();
            form.querySelectorAll('input, select, textarea').forEach(el => {
                el.classList.remove('valid', 'error');
            });
            if (serviceRow) serviceRow.style.display = 'none';
            responseEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (err) {
            showToast('Submission failed. Please try again.', 'error');
        } finally {
            submitBtn.textContent = 'Submit Enquiry';
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
        }
    });
}

/* Enquiry pricing/availability data */
const serviceData = {
    'recycling':   { label: 'Recycling Collection',           cost: 'R850 – R1 500/month',  avail: 'Available within 5 business days' },
    'workshop':    { label: 'Environmental Workshop',          cost: 'R1 200 per session',    avail: 'Bookable 2 weeks in advance'      },
    'cleanup':     { label: 'Community Clean-Up Campaign',     cost: 'R650 per campaign',     avail: 'Available on weekends'            },
    'corporate':   { label: 'Corporate Sustainability Audit',  cost: 'R5 000 – R12 000',      avail: 'Quote within 48 hours'            },
};

const enquiryTypeData = {
    'volunteer': { title: 'Volunteer Application', cost: 'Free', avail: 'Applications reviewed within 3 business days' },
    'sponsor':   { title: 'Sponsorship Enquiry',   cost: 'Packages from R2 500/month', avail: 'Partnerships team will contact you within 48 hours' },
    'product':   { title: 'Product Enquiry',       cost: 'Priced per order',           avail: 'Stock confirmed within 24 hours' },
};

function showEnquiryResponse(data, el) {
    const type    = data.enquiryType;
    const service = data.serviceType;
    let info;

    if (type === 'service' && service && serviceData[service]) {
        info = serviceData[service];
    } else if (enquiryTypeData[type]) {
        info = { ...enquiryTypeData[type], label: enquiryTypeData[type].title };
    } else {
        info = { label: 'General Enquiry', cost: 'To be confirmed', avail: 'Within 2 business days' };
    }

    const now = new Date();
    const ref = 'ECO-' + now.getFullYear() + (now.getMonth()+1).toString().padStart(2,'0') + Math.random().toString(36).substr(2,5).toUpperCase();

    el.innerHTML = `
        <h4>✅ Thank you, ${escHtml(data.firstName)}! Your enquiry has been received.</h4>
        <table>
            <tr><td>Reference No.</td>  <td>${ref}</td></tr>
            <tr><td>Enquiry Type</td>   <td>${escHtml(info.label || type)}</td></tr>
            <tr><td>Estimated Cost</td> <td>${info.cost}</td></tr>
            <tr><td>Availability</td>   <td>${info.avail}</td></tr>
            <tr><td>Next Step</td>      <td>A consultant will contact you at <strong>${escHtml(data.email)}</strong>.</td></tr>
        </table>
        <p style="margin-top:14px;color:#546e7a;font-size:0.9rem;">Please keep your reference number for follow-up queries.</p>
    `;
    el.classList.add('show');
}

/* ═══════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════ */
function initContactForm() {
    const form      = document.getElementById('contactForm');
    const submitBtn = document.getElementById('contactSubmit');
    const successEl = document.getElementById('contactSuccess');

    // Live validation
    form.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('blur',   () => validateField(el));
        el.addEventListener('change', () => validateField(el));
        el.addEventListener('input',  () => {
            if (el.classList.contains('error')) validateField(el);
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateAll(form)) {
            showToast('Please fix the errors before submitting.', 'error');
            form.querySelector('.error')?.focus();
            return;
        }

        const data = Object.fromEntries(new FormData(form));

        submitBtn.textContent = 'Sending…';
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;

        try {
            await simulateAjax(data, 'contact');

            // Compile into mailto: link
            const to      = 'takundajohnm@gmail.com';
            const subject = encodeURIComponent(`[EcoCycle Contact] ${data.messageType} – ${data.subject || 'General'}`);
            const body    = encodeURIComponent(
                `Name: ${data.firstName} ${data.lastName}\n` +
                `Email: ${data.email}\n` +
                `Phone: ${data.phone}\n` +
                `Message Type: ${data.messageType}\n` +
                `Subject: ${data.subject || '(none)'}\n\n` +
                `Message:\n${data.message}\n\n` +
                `--\nSent via EcoCycle Solutions website`
            );
            const mailLink = `mailto:${to}?subject=${subject}&body=${body}`;

            // Show success + open mail client
            if (successEl) {
                const ticketId = 'TKT-' + Date.now().toString(36).toUpperCase();
                successEl.innerHTML = `
                    <p>✅ <strong>Message compiled successfully!</strong> Your ticket ID is <strong>${ticketId}</strong>.</p>
                    <p style="margin-top:10px;">Click the button below to open your email client and send the message to EcoCycle Solutions.</p>
                    <a href="${mailLink}" class="btn" style="margin-top:16px;display:inline-block;" target="_blank">Open Email Client &rarr;</a>
                `;
                successEl.style.display = 'block';
                successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            showToast('Message ready — open your email client to send!');
            form.reset();
            form.querySelectorAll('input, select, textarea').forEach(el => el.classList.remove('valid', 'error'));
        } catch (err) {
            showToast('Something went wrong. Please try again.', 'error');
        } finally {
            submitBtn.textContent = 'Send Message';
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
        }
    });
}

/* ═══════════════════════════════════════════
   AJAX SIMULATION
   (Replace URL + remove timeout for a real server)
═══════════════════════════════════════════ */
async function simulateAjax(data, endpoint) {
    // Uncomment to POST to a real backend:
    // const res = await fetch(`/api/${endpoint}`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    // });
    // if (!res.ok) throw new Error('Server error');
    // return res.json();

    return new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 1200));
}

/* ═══════════════════════════════════════════
   UTILITY
═══════════════════════════════════════════ */
function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
