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
  Array.from(input.files).forEach(file => {
    const tag = document.createElement('span');
    tag.className = 'file-tag';
    tag.textContent = file.name;
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
        dropContainer.style.borderColor = 'var(--brand)';
      });
      dropContainer.addEventListener('dragleave', () => {
        dropContainer.style.borderColor = '';
      });
      dropContainer.addEventListener('drop', e => {
        e.preventDefault();
        dropContainer.style.borderColor = '';
        const files = Array.from(e.dataTransfer.files);
        if (files.length === 0) return;
        input.files = e.dataTransfer.files;
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
