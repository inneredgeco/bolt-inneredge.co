import { useState, useRef } from 'react';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Header } from './Header';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { Mic, Upload, X } from 'lucide-react';

export function PodcastGuestOnboardingPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    website: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    profession: '',
    shortBio: '',
    longBio: ''
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      setFormData({
        ...formData,
        [name]: formatPhoneNumber(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const rect = e.target.getBoundingClientRect();
    const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
    if (!isVisible) {
      e.target.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG or PNG image file.');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Image file must be less than 5MB.');
      return;
    }

    setPhotoFile(file);
    setError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const normalizeUrl = (url: string): string => {
    if (!url) return url;
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const formatSocialUrl = (value: string, platform: 'facebook' | 'instagram'): string => {
    if (!value || !value.trim()) return '';

    let formatted = value.trim();
    formatted = formatted.replace(/^@/, '');

    if (!formatted.startsWith('http')) {
      const domain = platform === 'facebook' ? 'facebook.com' : 'instagram.com';
      formatted = formatted.replace(new RegExp(`^(www\\.)?${domain}\\/`), '');
      formatted = `https://www.${domain}/${formatted}`;
    }

    return formatted;
  };

  const formatLinkedInUrl = (value: string): string => {
    if (!value || !value.trim()) return '';

    let formatted = value.trim();

    if (formatted.startsWith('http://') || formatted.startsWith('https://')) {
      return formatted;
    }

    if (formatted.includes('/company/')) {
      const companyName = formatted.split('/company/')[1] || formatted.split('/company/')[0];
      return `https://www.linkedin.com/company/${companyName}`;
    }

    if (formatted.includes('/in/')) {
      const profileName = formatted.split('/in/')[1] || formatted.split('/in/')[0];
      return `https://www.linkedin.com/in/${profileName}`;
    }

    if (formatted.includes('linkedin.com/')) {
      formatted = formatted.replace(new RegExp(`^(www\\.)?linkedin\\.com\\/`), '');
      return `https://www.linkedin.com/in/${formatted}`;
    }

    return `https://www.linkedin.com/in/${formatted}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('=== Guest Onboarding: Form Submission Started ===');
    setLoading(true);
    setError('');

    if (!photoFile) {
      setError('Please upload your headshot photo.');
      setLoading(false);
      return;
    }

    try {
      console.log('=== Step 1: Uploading Photo to R2 ===');

      console.log('R2 Upload Configuration:');
      console.log('Bucket:', import.meta.env.VITE_R2_GUESTS_BUCKET_NAME);
      console.log('Endpoint:', import.meta.env.VITE_R2_GUESTS_ENDPOINT);
      console.log('Access Key ID:', import.meta.env.VITE_R2_GUESTS_ACCESS_KEY_ID ? 'SET' : 'NOT SET');
      console.log('Secret Access Key:', import.meta.env.VITE_R2_GUESTS_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET');
      console.log('Public URL:', import.meta.env.VITE_R2_GUESTS_PUBLIC_URL);

      const bucketName = import.meta.env.VITE_R2_GUESTS_BUCKET_NAME;
      const endpoint = import.meta.env.VITE_R2_GUESTS_ENDPOINT;
      const accessKeyId = import.meta.env.VITE_R2_GUESTS_ACCESS_KEY_ID;
      const secretAccessKey = import.meta.env.VITE_R2_GUESTS_SECRET_ACCESS_KEY;
      const publicUrl = import.meta.env.VITE_R2_GUESTS_PUBLIC_URL;

      if (!bucketName || !endpoint || !accessKeyId || !secretAccessKey || !publicUrl) {
        const missing = [];
        if (!bucketName) missing.push('VITE_R2_GUESTS_BUCKET_NAME');
        if (!endpoint) missing.push('VITE_R2_GUESTS_ENDPOINT');
        if (!accessKeyId) missing.push('VITE_R2_GUESTS_ACCESS_KEY_ID');
        if (!secretAccessKey) missing.push('VITE_R2_GUESTS_SECRET_ACCESS_KEY');
        if (!publicUrl) missing.push('VITE_R2_GUESTS_PUBLIC_URL');
        throw new Error(`Missing R2 configuration: ${missing.join(', ')}`);
      }

      const s3Client = new S3Client({
        region: 'auto',
        endpoint: endpoint,
        credentials: {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey
        }
      });

      const timestamp = Date.now();
      const filename = `${formData.firstName.toLowerCase()}-${formData.lastName.toLowerCase()}-${timestamp}.jpg`;

      console.log('Filename:', filename);
      console.log('Creating PutObjectCommand...');

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `headshots/${filename}`,
        Body: photoFile,
        ContentType: photoFile.type
      });

      console.log('Sending upload command to R2...');
      await s3Client.send(command);

      const photoUrl = `${publicUrl}/headshots/${filename}`;
      console.log('Photo uploaded successfully:', photoUrl);

      console.log('=== Step 2: Generating Slug ===');
      const slug = `${formData.firstName}-${formData.lastName}`
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      console.log('=== Step 3: Sending to Pabbly Webhook ===');
      const webhookUrl = import.meta.env.VITE_PABBLY_WEBHOOK_URL_GUEST_ONBOARDING;

      if (webhookUrl) {
        const webhookPayload = {
          name: `${formData.firstName} ${formData.lastName}`,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          website: normalizeUrl(formData.website),
          facebook: formatSocialUrl(formData.facebook, 'facebook'),
          instagram: formatSocialUrl(formData.instagram, 'instagram'),
          linkedin: formatLinkedInUrl(formData.linkedin),
          profession: formData.profession,
          status: "Draft",
          slug: slug,
          photo_url: photoUrl,
          short_bio: formData.shortBio,
          long_bio: formData.longBio || '',
          submitted_at: new Date().toISOString(),
        };

        try {
          const webhookResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(webhookPayload)
          });

          if (webhookResponse.ok) {
            console.log('Webhook sent successfully');
          } else {
            console.error('Webhook failed:', webhookResponse.status);
          }
        } catch (error) {
          console.error('Webhook error:', error);
        }
      }

      console.log('=== Step 4: Sending Confirmation Emails ===');
      const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;

      if (resendApiKey) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${resendApiKey}`
            },
            body: JSON.stringify({
              from: 'Inner Edge Podcast <podcast@send.inneredge.co>',
              reply_to: 'Inner Edge Podcast <podcast@inneredge.co>',
              to: formData.email,
              subject: 'Profile Received - Inner Edge Podcast',
              html: `
                <p>Hi ${formData.firstName},</p>
                <p>Thank you for completing your guest profile! We've received all your information and your headshot looks great.</p>
                <p>We'll be in touch soon with recording details and episode scheduling.</p>
                <p>Looking forward to our conversation,<br>The Inner Edge Team</p>
              `
            })
          });

          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${resendApiKey}`
            },
            body: JSON.stringify({
              from: 'Inner Edge Podcast <podcast@send.inneredge.co>',
              to: 'podcast@inneredge.co',
              subject: `Guest Profile Completed - ${formData.firstName} ${formData.lastName}`,
              html: `
                <p><strong>Guest profile completed:</strong></p>
                <p><strong>NAME:</strong> ${formData.firstName} ${formData.lastName}<br>
                <strong>EMAIL:</strong> ${formData.email}<br>
                <strong>PHONE:</strong> ${formData.phone}<br>
                <strong>PROFESSION:</strong> ${formData.profession}</p>
                <p><strong>SHORT BIO:</strong><br>${formData.shortBio}</p>
                ${formData.longBio ? `<p><strong>LONG BIO:</strong><br>${formData.longBio.replace(/\n/g, '<br>')}</p>` : ''}
                <p><strong>PHOTO:</strong> <a href="${photoUrl}">${photoUrl}</a></p>
                <p><strong>SOCIAL LINKS:</strong><br>
                Website: ${formData.website ? `<a href="${normalizeUrl(formData.website)}">${normalizeUrl(formData.website)}</a>` : 'Not provided'}<br>
                Facebook: ${formData.facebook ? `<a href="${formatSocialUrl(formData.facebook, 'facebook')}">${formatSocialUrl(formData.facebook, 'facebook')}</a>` : 'Not provided'}<br>
                Instagram: ${formData.instagram ? `<a href="${formatSocialUrl(formData.instagram, 'instagram')}">${formatSocialUrl(formData.instagram, 'instagram')}</a>` : 'Not provided'}<br>
                LinkedIn: ${formData.linkedin ? `<a href="${formatLinkedInUrl(formData.linkedin)}">${formatLinkedInUrl(formData.linkedin)}</a>` : 'Not provided'}</p>
              `
            })
          });

          console.log('Emails sent successfully');
        } catch (error) {
          console.error('Email error:', error);
        }
      }

      console.log('=== Form Submitted Successfully ===');
      setSuccess(true);
      setLoading(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        website: '',
        facebook: '',
        instagram: '',
        linkedin: '',
        profession: '',
        shortBio: '',
        longBio: ''
      });
      removePhoto();

      setTimeout(() => {
        setSuccess(false);
      }, 8000);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const shortBioCharCount = formData.shortBio.length;
  const shortBioMaxChars = 200;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <SEOHead
        title="Guest Onboarding - Inner Edge Podcast"
        description="Complete your guest profile for the Inner Edge Podcast. Upload your headshot and finalize your episode details."
        keywords="podcast guest onboarding, inner edge podcast, guest profile"
        ogImage="https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png"
        canonical="https://www.inneredge.co/podcast-guest-onboarding"
        ogUrl="https://www.inneredge.co/podcast-guest-onboarding"
      />
      <Header />

      <div className="bg-gradient-to-br from-brand-500 via-brand-700 to-brand-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Mic className="w-16 h-16 mx-auto mb-6 text-brand-200" />
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Welcome to Inner Edge Podcast
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto">
            Complete your guest profile to finalize your episode details
          </p>
        </div>
      </div>

      <div className="flex-grow py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg">
            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-stone-900 mb-4">
                  Thank you!
                </h2>
                <p className="text-lg text-stone-600">
                  Your profile has been submitted. We'll be in touch soon with recording details.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-stone-900 mb-8 text-center">
                  Guest Profile Information
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="firstName" className="block text-stone-900 font-bold mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      placeholder="First name"
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-600 transition-colors"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="lastName" className="block text-stone-900 font-bold mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      placeholder="Last name"
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-600 transition-colors"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="email" className="block text-stone-900 font-bold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-600 transition-colors"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="phone" className="block text-stone-900 font-bold mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-600 transition-colors"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="website" className="block text-stone-900 font-bold mb-2">
                      Website
                    </label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      placeholder="yourwebsite.com"
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-600 transition-colors"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="facebook" className="block text-stone-900 font-bold mb-2">
                      Facebook
                    </label>
                    <input
                      type="text"
                      id="facebook"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      placeholder="@yourprofile or facebook.com/yourprofile"
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-600 transition-colors"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="instagram" className="block text-stone-900 font-bold mb-2">
                      Instagram
                    </label>
                    <input
                      type="text"
                      id="instagram"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      placeholder="@yourprofile or instagram.com/yourprofile"
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-600 transition-colors"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="linkedin" className="block text-stone-900 font-bold mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      placeholder="linkedin.com/in/yourprofile"
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-600 transition-colors"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="profession" className="block text-stone-900 font-bold mb-2">
                      Profession *
                    </label>
                    <input
                      type="text"
                      id="profession"
                      name="profession"
                      required
                      value={formData.profession}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      placeholder="Men's Coach & Author"
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-600 transition-colors"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="photoFile" className="block text-stone-900 font-bold mb-2">
                      Headshot Photo *
                    </label>

                    {!photoPreview ? (
                      <div className="relative">
                        <input
                          ref={fileInputRef}
                          type="file"
                          id="photoFile"
                          name="photoFile"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <label
                          htmlFor="photoFile"
                          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer hover:border-brand-600 transition-colors bg-stone-50"
                        >
                          <Upload className="w-12 h-12 text-stone-400 mb-2" />
                          <span className="text-sm font-medium text-stone-700">Click to upload photo</span>
                          <span className="text-xs text-stone-500 mt-1">JPG, JPEG, PNG (max 5MB)</span>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors"
                        >
                          <X size={20} />
                        </button>
                        {photoFile && (
                          <p className="mt-2 text-sm text-stone-600">
                            <span className="font-semibold">Selected:</span> {photoFile.name}
                          </p>
                        )}
                      </div>
                    )}
                    <p className="mt-2 text-sm text-stone-600">
                      Square format required (800x800px minimum). This will be used for your guest profile page.
                    </p>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="shortBio" className="block text-stone-900 font-bold mb-2">
                      Short Bio *
                    </label>
                    <textarea
                      id="shortBio"
                      name="shortBio"
                      required
                      maxLength={shortBioMaxChars}
                      value={formData.shortBio}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      rows={2}
                      placeholder="Brief description for your profile (1-2 sentences)"
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-600 transition-colors resize-none"
                    />
                    <div className="flex justify-between mt-2">
                      <p className="text-sm text-stone-600">
                        This appears as your tagline on the profile page
                      </p>
                      <p className={`text-sm ${shortBioCharCount > shortBioMaxChars ? 'text-red-600' : 'text-stone-500'}`}>
                        {shortBioCharCount}/{shortBioMaxChars}
                      </p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label htmlFor="longBio" className="block text-stone-900 font-bold mb-2">
                      Long Bio
                    </label>
                    <textarea
                      id="longBio"
                      name="longBio"
                      value={formData.longBio}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      rows={6}
                      placeholder="Tell us more about your journey, expertise, and what you're passionate about (2-3 paragraphs)"
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-600 transition-colors resize-none"
                    />
                    <p className="mt-2 text-sm text-stone-600">
                      Optional - appears in the 'About' section of your profile
                    </p>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-8 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Profile'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
