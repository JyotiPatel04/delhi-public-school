/**
 * DPS GENIUS | FORM VALIDATION & INTERACTION HANDLER
 * Handles Admission Enquiry and Contact Us forms with real-time feedback,
 * validation rules, and transparent frontend submission notices.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Helper: validate email address
  function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).trim());
  }

  // Helper: validate phone number (supports Indian 10-digit formats with or without +91)
  function isValidPhone(phone) {
    const cleaned = String(phone).replace(/[\s\-()]/g, '');
    const re = /^(\+91|91|0)?[6-9]\d{9}$/;
    return re.test(cleaned);
  }

  // Helper: display error on field
  function setError(input, message) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    input.classList.add('is-invalid');
    let feedback = formGroup.querySelector('.form-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'form-feedback';
      formGroup.appendChild(feedback);
    }
    feedback.textContent = message;
    feedback.style.display = 'block';
  }

  // Helper: clear error on field
  function clearError(input) {
    input.classList.remove('is-invalid');
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      const feedback = formGroup.querySelector('.form-feedback');
      if (feedback) {
        feedback.style.display = 'none';
      }
    }
  }

  // Bind clear on input
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', () => clearError(input));
    input.addEventListener('change', () => clearError(input));
  });

  // --------------------------------------------------------------------------
  // 1. ADMISSION ENQUIRY FORM
  // --------------------------------------------------------------------------
  const admissionForm = document.getElementById('admission-enquiry-form');
  if (admissionForm) {
    admissionForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasError = false;

      const studentName = admissionForm.querySelector('[name="student_name"]');
      const studentDob = admissionForm.querySelector('[name="student_dob"]');
      const targetGrade = admissionForm.querySelector('[name="target_grade"]');
      const parentName = admissionForm.querySelector('[name="parent_name"]');
      const parentEmail = admissionForm.querySelector('[name="parent_email"]');
      const parentPhone = admissionForm.querySelector('[name="parent_phone"]');

      // Validate Student Name
      if (studentName && studentName.value.trim().length < 2) {
        setError(studentName, 'Please enter the student\'s full name (at least 2 letters).');
        hasError = true;
      }

      // Validate DOB
      if (studentDob && !studentDob.value) {
        setError(studentDob, 'Please select the student\'s date of birth.');
        hasError = true;
      }

      // Validate Target Grade
      if (targetGrade && (!targetGrade.value || targetGrade.value === '')) {
        setError(targetGrade, 'Please select the desired class for admission (Class 1 to 10).');
        hasError = true;
      }

      // Validate Parent Name
      if (parentName && parentName.value.trim().length < 2) {
        setError(parentName, 'Please enter parent/guardian\'s full name.');
        hasError = true;
      }

      // Validate Parent Phone
      if (parentPhone && !isValidPhone(parentPhone.value)) {
        setError(parentPhone, 'Please enter a valid 10-digit mobile number (e.g., 9876543210).');
        hasError = true;
      }

      // Validate Parent Email
      if (parentEmail && !isValidEmail(parentEmail.value)) {
        setError(parentEmail, 'Please enter a valid email address.');
        hasError = true;
      }

      if (!hasError) {
        // Display verified client-side confirmation
        const noticeEl = document.getElementById('admission-form-notice');
        if (noticeEl) {
          noticeEl.innerHTML = `
            <div style="display: flex; gap: 1rem; align-items: flex-start;">
              <i class="fas fa-check-circle" style="font-size: 1.8rem; color: #185233; margin-top: 2px;"></i>
              <div>
                <h4 style="margin-bottom: 0.35rem; color: #0f3621;">Enquiry Validated Successfully!</h4>
                <p style="margin-bottom: 0.5rem; color: #1c2b20;">
                  Thank you, <strong>${parentName ? parentName.value.trim() : 'Parent'}</strong>. Your admission enquiry for <strong>${studentName ? studentName.value.trim() : 'the student'}</strong> (Grade: ${targetGrade ? targetGrade.value : 'Class 1-10'}) is ready.
                </p>
                <div style="font-size: 0.85rem; color: #56685c; background: rgba(255,255,255,0.7); padding: 0.75rem; border-radius: 6px; border: 1px dashed #c8dfd0;">
                  <strong>Note:</strong> Frontend validation succeeded. You can also directly reach the admission desk at <a href="tel:+918130508111" style="color: #185233; font-weight: 700;">+91-8130508111</a> or <a href="mailto:info@dpsgenius.com" style="color: #185233; font-weight: 700;">info@dpsgenius.com</a>.
                </div>
              </div>
            </div>
          `;
          noticeEl.classList.add('success');
          noticeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        admissionForm.reset();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. CONTACT US FORM
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-enquiry-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasError = false;

      const fullName = contactForm.querySelector('[name="full_name"]');
      const email = contactForm.querySelector('[name="email"]');
      const phone = contactForm.querySelector('[name="phone"]');
      const subject = contactForm.querySelector('[name="subject"]');
      const message = contactForm.querySelector('[name="message"]');

      if (fullName && fullName.value.trim().length < 2) {
        setError(fullName, 'Please enter your full name.');
        hasError = true;
      }

      if (email && !isValidEmail(email.value)) {
        setError(email, 'Please enter a valid email address.');
        hasError = true;
      }

      if (phone && !isValidPhone(phone.value)) {
        setError(phone, 'Please enter a valid contact phone number.');
        hasError = true;
      }

      if (subject && subject.value.trim().length < 3) {
        setError(subject, 'Please specify the subject of your enquiry.');
        hasError = true;
      }

      if (message && message.value.trim().length < 10) {
        setError(message, 'Please provide your message (at least 10 characters).');
        hasError = true;
      }

      if (!hasError) {
        const noticeEl = document.getElementById('contact-form-notice');
        if (noticeEl) {
          noticeEl.innerHTML = `
            <div style="display: flex; gap: 1rem; align-items: flex-start;">
              <i class="fas fa-check-circle" style="font-size: 1.8rem; color: #185233; margin-top: 2px;"></i>
              <div>
                <h4 style="margin-bottom: 0.35rem; color: #0f3621;">Message Validated Successfully!</h4>
                <p style="margin-bottom: 0.5rem; color: #1c2b20;">
                  Thank you, <strong>${fullName.value.trim()}</strong>. Your message regarding "<em>${subject.value.trim()}</em>" has been processed on the client side.
                </p>
                <div style="font-size: 0.85rem; color: #56685c; background: rgba(255,255,255,0.7); padding: 0.75rem; border-radius: 6px; border: 1px dashed #c8dfd0;">
                  <strong>Note:</strong> Frontend submission ready. For immediate assistance, our administrative team is available at <a href="tel:+918130508111" style="color: #185233; font-weight: 700;">+91-8130508111</a> or visit us at Shahpuri Tower, Janakpuri, New Delhi.
                </div>
              </div>
            </div>
          `;
          noticeEl.classList.add('success');
          noticeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        contactForm.reset();
      }
    });
  }
});

