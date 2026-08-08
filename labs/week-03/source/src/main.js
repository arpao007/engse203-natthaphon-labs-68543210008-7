import './style.css';
const form = document.querySelector('#request-form');
const detailsCounter = document.querySelector('#details-count');
const statTotalEl = document.querySelector('#stat-total');
const statPendingEl = document.querySelector('#stat-pending');
const statApprovedEl = document.querySelector('#stat-approved');
const requestList = document.querySelector('#request-list');
// TODO 1: query preview/status/list elements
const preview = {
    name: document.querySelector('#preview-name'),
    status: document.querySelector('#form-status'),
    type: document.querySelector('#preview-type'),
    list: document.querySelector('#request-list'),
    details: document.querySelector('#preview-details'),
};


// TODO 2: readForm()
function readForm() {
    return Object.fromEntries(new FormData(form).entries());
}


// TODO 3: renderPreview(data)
function renderPreview(data) {
    preview.name.textContent = data.requester_name?.trim() || 'ยังไม่ระบุชื่อ';
    preview.type.textContent = data.select?.trim() || 'ยังไม่เลือกประเภท';
    preview.details.textContent = data.details?.trim() || 'ยังไม่มีรายละเอียด';
}


// TODO 4: validate(data)
function validate(data) {
    const errors = {};

    if (!data.requester_name || data.requester_name.trim().length < 2) {
        errors.requester_name = 'กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร';
    }

    if (!data.select || data.select.trim() === '') {
        errors.select = 'กรุณาเลือกประเภทคำขอ';
    }

    if (!data.details || data.details.trim().length < 10) {
        errors.details = 'กรุณาอธิบายรายละเอียดอย่างน้อย 10 ตัวอักษร';
    }
    return errors;
}

// TODO 5: renderErrors(errors)
function renderErrors(errors) {
    const fieldNames = ['requester_name', 'select', 'details'];

    for (const name of fieldNames) {
        const field = form.elements[name];
        const output = document.querySelector(`#${name}-error`);

        if (output) {
            const message = errors[name] ?? '';
            output.textContent = message;

            if (field) {
                field.setAttribute('aria-invalid', String(Boolean(message)));
            }
        }
    }

    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
        renderStatus('invalid', 'กรุณาตรวจสอบข้อมูลที่ระบุให้ถูกต้อง');
    }
}



// TODO 6: input and submit listeners
form.addEventListener('input', () => {
    const data = readForm();
    renderPreview(data);
    if (detailsCounter) {

        const currentLength = data.details?.length || 0;
        detailsCounter.textContent = `${currentLength} ตัวอักษร`;
    }
});


form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = readForm();
    const errors = validate(data);

    renderErrors(errors);


    if (Object.keys(errors).length === 0) {
        renderStatus('success', 'บันทึกข้อมูลคำขอสำเร็จเรียบร้อย!');


        const newLi = document.createElement('li');
        const titleEl = document.createElement('strong');
        const detailsEl = document.createElement('span');

        titleEl.textContent = `${data.requester_name.trim()} [${data.select}]`;
        detailsEl.textContent = data.details.trim();

        newLi.appendChild(titleEl);
        newLi.appendChild(detailsEl);

        preview.list.prepend(newLi);

        if (detailsCounter) {
            detailsCounter.textContent = '0 ตัวอักษร';
        }

        if (statTotalEl && statPendingEl && statApprovedEl) {
            let currentTotal = parseInt(statTotalEl.textContent) || 0;
            let currentPending = parseInt(statPendingEl.textContent) || 0;
            let currentApproved = parseInt(statApprovedEl.textContent) || 0;
            statTotalEl.textContent = currentTotal + 1;
            statPendingEl.textContent = currentPending + 1;
            statApprovedEl.textContent = currentApproved + 1;
        }


    }
});

function renderStatus(type, message) {
    preview.status.textContent = message;
    preview.status.setAttribute('data-state', type);
}


renderPreview(readForm());
renderStatus('idle', 'เริ่มพิมพ์เพื่อทดลอง Event และ Live Preview');
console.log('LAB 3 starter ready', form);