import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import NewsletterForm from './NewsletterForm';

export default function NewsletterFormVisualBuilder() {
  const [copied, setCopied] = useState(false);

  const embedCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter Form - Webflow Embed</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .newsletter-section {
      padding: 48px 16px;
      position: relative;
      overflow: hidden;
      background: linear-gradient(to bottom right, #ffffff 0%, #f0f9f8 40%, #d4ebe8 100%);
    }

    .newsletter-bg-overlay-1 {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1), transparent 50%);
    }

    .newsletter-bg-overlay-2 {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.05), transparent 50%);
    }

    .newsletter-container {
      max-width: 768px;
      margin: 0 auto;
      position: relative;
      z-index: 10;
    }

    .newsletter-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      overflow: hidden;
      border: 2px solid #c7e6e1;
    }

    .newsletter-content {
      padding: 32px;
    }

    .newsletter-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .newsletter-badge {
      display: inline-block;
      margin-bottom: 12px;
      padding: 4px 12px;
      background-color: #c7e6e1;
      color: #1e5a52;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .newsletter-title {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
      line-height: 1.2;
    }

    .newsletter-description {
      font-size: 16px;
      color: #374151;
      max-width: 640px;
      margin: 0 auto;
    }

    .newsletter-form {
      max-width: 448px;
      margin: 0 auto;
    }

    .form-group {
      margin-bottom: 12px;
    }

    .input-wrapper {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      color: #9ca3af;
      pointer-events: none;
    }

    .form-input {
      width: 100%;
      padding: 10px 16px 10px 40px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 16px;
      color: #111827;
      transition: all 0.2s;
    }

    .form-input::placeholder {
      color: #9ca3af;
    }

    .form-input:hover {
      border-color: #9ca3af;
    }

    .form-input:focus {
      outline: none;
      border-color: transparent;
      box-shadow: 0 0 0 2px #2c7a6f;
    }

    .form-input.error {
      border-color: #ef4444;
    }

    .error-message {
      margin-top: 4px;
      font-size: 14px;
      color: #ef4444;
    }

    .submit-button {
      width: 100%;
      background: linear-gradient(to right, #2c7a6f, #1e5a52);
      color: white;
      font-weight: 700;
      padding: 10px 24px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 16px;
      margin-top: 16px;
    }

    .submit-button:hover:not(:disabled) {
      background: linear-gradient(to right, #1e5a52, #134139);
      transform: scale(1.02);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .submit-button:active:not(:disabled) {
      transform: scale(0.98);
    }

    .submit-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .submit-button:focus {
      outline: none;
      box-shadow: 0 0 0 4px rgba(44, 122, 111, 0.3);
    }

    .arrow-icon {
      width: 16px;
      height: 16px;
      transition: transform 0.2s;
    }

    .submit-button:hover .arrow-icon {
      transform: translateX(4px);
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid white;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .form-footer {
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      margin-top: 12px;
    }

    .form-footer p {
      margin: 4px 0;
    }

    @media (min-width: 640px) {
      .newsletter-section {
        padding: 48px 24px;
      }

      .newsletter-content {
        padding: 40px;
      }

      .newsletter-title {
        font-size: 32px;
      }
    }

    @media (min-width: 1024px) {
      .newsletter-section {
        padding: 48px 32px;
      }

      .newsletter-content {
        padding: 48px;
      }
    }
  </style>
</head>
<body>
  <section class="newsletter-section">
    <div class="newsletter-bg-overlay-1"></div>
    <div class="newsletter-bg-overlay-2"></div>

    <div class="newsletter-container">
      <div class="newsletter-card">
        <div class="newsletter-content">
          <div class="newsletter-header">
            <div class="newsletter-badge">FREE RESOURCE</div>
            <h2 class="newsletter-title">Create Your 1-Year Vision</h2>
            <p class="newsletter-description">
              A guided process to design the life you want in the next 12 months
            </p>
          </div>

          <form id="newsletterForm" class="newsletter-form">
            <div class="form-group">
              <div class="input-wrapper">
                <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  id="nameInput"
                  class="form-input"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div id="nameError" class="error-message" style="display: none;"></div>
            </div>

            <div class="form-group">
              <div class="input-wrapper">
                <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  id="emailInput"
                  class="form-input"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div id="emailError" class="error-message" style="display: none;"></div>
            </div>

            <button type="submit" id="submitButton" class="submit-button">
              <span id="buttonText">Begin Your Vision</span>
              <svg id="arrowIcon" class="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <div id="spinner" class="spinner" style="display: none;"></div>
            </button>

            <div class="form-footer">
              <p>Your vision is private and secure. We'll never share your information.</p>
              <p>Takes about 10 minutes to complete</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>

  <script>
    (function() {
      // CONFIGURATION - Replace these with your actual Supabase credentials
      const SUPABASE_URL = 'YOUR_SUPABASE_URL';
      const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

      // CONFIGURATION - Replace with your actual domain
      const REDIRECT_BASE_URL = 'https://yourdomain.com';

      const form = document.getElementById('newsletterForm');
      const nameInput = document.getElementById('nameInput');
      const emailInput = document.getElementById('emailInput');
      const nameError = document.getElementById('nameError');
      const emailError = document.getElementById('emailError');
      const submitButton = document.getElementById('submitButton');
      const buttonText = document.getElementById('buttonText');
      const arrowIcon = document.getElementById('arrowIcon');
      const spinner = document.getElementById('spinner');

      function showError(element, errorDiv, message) {
        element.classList.add('error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
      }

      function clearError(element, errorDiv) {
        element.classList.remove('error');
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
      }

      function validateForm() {
        let isValid = true;

        clearError(nameInput, nameError);
        clearError(emailInput, emailError);

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        if (!name) {
          showError(nameInput, nameError, 'Name is required');
          isValid = false;
        }

        if (!email) {
          showError(emailInput, emailError, 'Email is required');
          isValid = false;
        } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
          showError(emailInput, emailError, 'Please enter a valid email');
          isValid = false;
        }

        return isValid;
      }

      nameInput.addEventListener('input', function() {
        if (nameError.style.display !== 'none') {
          clearError(nameInput, nameError);
        }
      });

      emailInput.addEventListener('input', function() {
        if (emailError.style.display !== 'none') {
          clearError(emailInput, emailError);
        }
      });

      form.addEventListener('submit', async function(e) {
        e.preventDefault();

        console.log('=== VISION BUILDER SIGN-UP STARTED ===');

        if (!validateForm()) {
          console.log('Form validation failed');
          return;
        }

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        console.log('Name:', name);
        console.log('Email:', email);

        submitButton.disabled = true;
        buttonText.textContent = 'Starting Your Vision...';
        arrowIcon.style.display = 'none';
        spinner.style.display = 'block';

        try {
          console.log('Creating vision submission in database...');

          const insertResponse = await fetch(\`\${SUPABASE_URL}/rest/v1/vision_submissions\`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': \`Bearer \${SUPABASE_ANON_KEY}\`,
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              name: name,
              email: email,
              current_step: 1,
              status: 'started',
              step_1_completed_at: new Date().toISOString()
            })
          });

          if (!insertResponse.ok) {
            const errorText = await insertResponse.text();
            console.error('Database insert error:', errorText);
            alert('Failed to start your vision. Please try again.');
            throw new Error('Database insert failed');
          }

          const data = await insertResponse.json();

          if (!data || data.length === 0) {
            console.error('No data returned from database');
            alert('Failed to create submission. Please try again.');
            throw new Error('No data returned');
          }

          const submissionId = data[0].id;
          console.log('Database save successful! Submission ID:', submissionId);

          console.log('Updating current_step to 2...');
          const updateResponse = await fetch(\`\${SUPABASE_URL}/rest/v1/vision_submissions?id=eq.\${submissionId}\`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': \`Bearer \${SUPABASE_ANON_KEY}\`
            },
            body: JSON.stringify({
              current_step: 2,
              updated_at: new Date().toISOString()
            })
          });

          if (!updateResponse.ok) {
            console.error('Error updating current_step');
          } else {
            console.log('current_step updated to 2 successfully');
          }

          console.log('Adding to Flodesk Vision Builder segment...');
          try {
            const flodeskResponse = await fetch(\`\${SUPABASE_URL}/functions/v1/add-to-flodesk-vision-segment\`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${SUPABASE_ANON_KEY}\`
              },
              body: JSON.stringify({
                name: name,
                email: email
              })
            });

            if (!flodeskResponse.ok) {
              console.error('Flodesk integration failed:', await flodeskResponse.text());
            } else {
              console.log('Successfully added to Flodesk Vision Builder segment');
            }
          } catch (flodeskError) {
            console.error('Error calling Flodesk integration:', flodeskError);
          }

          console.log('=== SIGN-UP COMPLETE - Redirecting to vision builder ===');
          window.location.href = \`\${REDIRECT_BASE_URL}/vision-builder/resume/\${submissionId}\`;

        } catch (err) {
          console.error('Unexpected error:', err);
          alert('An unexpected error occurred. Please try again.');

          submitButton.disabled = false;
          buttonText.textContent = 'Begin Your Vision';
          arrowIcon.style.display = 'block';
          spinner.style.display = 'none';
        }
      });
    })();
  </script>
</body>
</html>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="grid lg:grid-cols-2 min-h-screen">
        <div className="bg-white flex items-center justify-center p-8">
          <div className="w-full">
            <NewsletterForm />
          </div>
        </div>

        <div className="bg-stone-900 text-stone-100 p-8 flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Newsletter Form Embed Code</h1>
            <p className="text-stone-400">
              Copy this code and paste it into your Webflow custom code embed or any HTML page
            </p>
          </div>

          <div className="flex-1 relative bg-stone-950 rounded-lg overflow-hidden border border-stone-800">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy Code
                  </>
                )}
              </button>
            </div>

            <pre className="p-6 overflow-auto h-full text-sm">
              <code className="text-stone-300 font-mono">{embedCode}</code>
            </pre>
          </div>

          <div className="mt-6 p-4 bg-stone-800 rounded-lg">
            <h3 className="font-semibold mb-2 text-brand-400">Configuration Required:</h3>
            <ul className="text-sm text-stone-300 space-y-1">
              <li>• Replace <code className="text-brand-400">YOUR_SUPABASE_URL</code> with your Supabase project URL</li>
              <li>• Replace <code className="text-brand-400">YOUR_SUPABASE_ANON_KEY</code> with your Supabase anonymous key</li>
              <li>• Replace <code className="text-brand-400">https://yourdomain.com</code> with your actual domain</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
