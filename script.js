const yearSelect = document.querySelector('#graduationYear');
const form = document.querySelector('#onboardingForm');
const resetButton = document.querySelector('#resetButton');

function populateGraduationYears() {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 20;
  for (let year = currentYear; year >= startYear; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
}

function updateFileList(input) {
  const list = input.closest('.field')?.querySelector('.file-list');
  if (!list) return;
  list.innerHTML = '';
  if (input.files.length === 0) return;
  Array.from(input.files).forEach((file, idx) => {
    const tag = document.createElement('div');
    tag.className = 'file-tag';
    const fileName = file.name.length > 20 ? file.name.substring(0, 17) + '...' : file.name;
    tag.innerHTML = `<span title="${file.name}">${fileName}</span><button type="button" data-index="${idx}">×</button>`;
    
    tag.querySelector('button').addEventListener('click', (e) => {
      e.preventDefault();
      const dt = new DataTransfer();
      Array.from(input.files).forEach((f, i) => {
        if (i !== idx) dt.items.add(f);
      });
      input.files = dt.files;
      updateFileList(input);
    });
    list.appendChild(tag);
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast.hideTimer);
  toast.hideTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function handleFileInputs() {
  document.querySelectorAll('input[type="file"]').forEach(input => {
    input.addEventListener('change', () => updateFileList(input));
    const dropContainer = input.closest('.file-drop');
    if (dropContainer) {
      dropContainer.addEventListener('dragover', e => {
        e.preventDefault();
        dropContainer.classList.add('drag-over');
      });
      dropContainer.addEventListener('dragleave', () => {
        dropContainer.classList.remove('drag-over');
      });
      dropContainer.addEventListener('drop', e => {
        e.preventDefault();
        dropContainer.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        if (files.length === 0) return;
        const dt = new DataTransfer();
        files.forEach(f => dt.items.add(f));
        input.files = dt.files;
        updateFileList(input);
      });
    }
  });
}

function collectFormData() {
  const formData = new FormData(form);
  const payload = {};
  for (const [key, value] of formData.entries()) {
    if (key === 'idTypes') {
      payload.idTypes = payload.idTypes || [];
      payload.idTypes.push(value);
      continue;
    }
    if (value instanceof File) {
      payload[key] = value.name || 'selected file';
      continue;
    }
    payload[key] = value;
  }
  return payload;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const data = collectFormData();
  showToast('Onboarding application submitted successfully.');
  console.log('Form submission:', data);
  form.reset();
  document.querySelectorAll('.file-list').forEach(list => list.innerHTML = '');
});

resetButton.addEventListener('click', () => {
  form.reset();
  document.querySelectorAll('.file-list').forEach(list => list.innerHTML = '');
});

populateGraduationYears();
handleFileInputs();
