import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Header } from './Header';
import { ArrowLeft, Save, RotateCcw, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RichTextEditor } from './RichTextEditor';
import { htmlToMarkdown, markdownToHtml } from '../utils/htmlToMarkdown';

interface EmailTemplate {
  id: string;
  template_name: string;
  template_key: string;
  subject: string;
  content: string;
  variables: string[];
  description: string | null;
  from_email: string;
  from_name: string;
  reply_to_email: string;
  created_at: string;
  updated_at: string;
}

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: 'contact-confirmation',
    template_name: 'Contact Form Confirmation',
    template_key: 'contact_form_confirmation',
    subject: 'Thanks for Reaching Out - Inner Edge',
    content: '<h1>Thank You for Your Message</h1>\n<p>Hi {name},</p>\n<p>Thank you for reaching out through Inner Edge. I have received your message and will get back to you within 24-48 hours.</p>\n<h2>Your Message</h2>\n<p><strong>Subject:</strong> {subject}</p>\n<p>{message}</p>\n<p>If your inquiry is urgent, feel free to connect with me on social media:</p>\n<ul>\n<li><a href="https://www.instagram.com/inneredge.co">Instagram</a></li>\n<li><a href="https://www.facebook.com/inneredge.co">Facebook</a></li>\n</ul>\n<p>Best regards,<br>Soleiman Bolour<br>Inner Edge</p>',
    variables: ['name', 'email', 'subject', 'message'],
    description: 'Sent to users after they submit the contact form',
    from_email: 'vision@send.inneredge.co',
    from_name: 'Inner Edge',
    reply_to_email: 'info@inneredge.co',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'contact-notification',
    template_name: 'Contact Form Notification',
    template_key: 'contact_form_notification',
    subject: 'New Contact Form Submission - {firstName} {lastName}',
    content: '<h2>New Contact Form Submission</h2>\n<p><strong>NAME:</strong> {firstName} {lastName}</p>\n<p><strong>EMAIL:</strong> {email}</p>\n<p><strong>PHONE:</strong> {phone}</p>\n<p><strong>NEWSLETTER:</strong> {newsletter}</p>\n<h3>Message:</h3>\n<p>{message}</p>\n<p><strong>SUBMITTED AT:</strong> {submittedAt}</p>',
    variables: ['firstName', 'lastName', 'email', 'phone', 'message', 'newsletter', 'submittedAt'],
    description: 'Internal notification sent when someone submits the contact form',
    from_email: 'vision@send.inneredge.co',
    from_name: 'Inner Edge',
    reply_to_email: 'info@inneredge.co',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'podcast-guest-confirmation',
    template_name: 'Podcast Guest Application Confirmation',
    template_key: 'podcast_guest_confirmation',
    subject: 'Thanks for Your Podcast Guest Application!',
    content: '<h1>Thank You for Your Application!</h1>\n<p>Hi {firstName},</p>\n<p>Thank you for your interest in being a guest on the Inner Edge Podcast! We have received your application and are excited to learn more about your work.</p>\n<p>We will review your submission and get back to you within 3-5 business days.</p>\n<p>In the meantime, feel free to explore our podcast episodes at <a href="https://inneredge.co/podcast">inneredge.co/podcast</a>.</p>\n<p>Looking forward to connecting,<br>The Inner Edge Team</p>',
    variables: ['firstName', 'email'],
    description: 'Sent to users after they submit the podcast guest application form',
    from_email: 'vision@send.inneredge.co',
    from_name: 'Inner Edge',
    reply_to_email: 'info@inneredge.co',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'podcast-guest-notification',
    template_name: 'Podcast Guest Application Notification',
    template_key: 'podcast_guest_notification',
    subject: 'New Podcast Guest Application - {firstName} {lastName}',
    content: '<h2>New Podcast Guest Application</h2>\n<p><strong>NAME:</strong> {firstName} {lastName}</p>\n<p><strong>EMAIL:</strong> {email}</p>\n<p><strong>PHONE:</strong> {phone}</p>\n<p><strong>PROFESSION:</strong> {profession}</p>\n<h3>Why They Would Be a Great Guest:</h3>\n<p>{whyGuest}</p>\n<h3>Practical Exercise:</h3>\n<p>{exercise}</p>\n<h3>Social Media:</h3>\n<ul>\n<li><strong>Website:</strong> {website}</li>\n<li><strong>Facebook:</strong> {facebook}</li>\n<li><strong>Instagram:</strong> {instagram}</li>\n</ul>\n<p><strong>SUBMITTED AT:</strong> {submittedAt}</p>',
    variables: ['firstName', 'lastName', 'email', 'phone', 'website', 'facebook', 'instagram', 'profession', 'whyGuest', 'exercise', 'submittedAt'],
    description: 'Internal notification sent when someone submits a podcast guest application',
    from_email: 'vision@send.inneredge.co',
    from_name: 'Inner Edge',
    reply_to_email: 'info@inneredge.co',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'guest-onboarding-confirmation',
    template_name: 'Guest Onboarding Confirmation',
    template_key: 'guest_onboarding_confirmation',
    subject: 'Profile Received - Inner Edge Podcast',
    content: '<h1>Thank You for Completing Your Profile!</h1>\n<p>Hi {firstName},</p>\n<p>Thank you for completing your guest profile! We have received all your information and your headshot looks great.</p>\n<p>We will be in touch soon with recording details and episode scheduling.</p>\n<p>Looking forward to our conversation,<br>The Inner Edge Team</p>',
    variables: ['firstName', 'email'],
    description: 'Sent to guests after they complete the onboarding form',
    from_email: 'vision@send.inneredge.co',
    from_name: 'Inner Edge',
    reply_to_email: 'info@inneredge.co',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'guest-onboarding-notification',
    template_name: 'Guest Onboarding Notification',
    template_key: 'guest_onboarding_notification',
    subject: 'Guest Profile Completed - {firstName} {lastName}',
    content: '<h2>Guest Profile Completed</h2>\n<p><strong>NAME:</strong> {firstName} {lastName}</p>\n<p><strong>EMAIL:</strong> {email}</p>\n<p><strong>PHONE:</strong> {phone}</p>\n<p><strong>PROFESSION:</strong> {profession}</p>\n<h3>Short Bio:</h3>\n<p>{shortBio}</p>\n<p><strong>PHOTO:</strong> {photoUrl}</p>\n<h3>Social Links:</h3>\n<ul>\n<li><strong>Website:</strong> {website}</li>\n<li><strong>Facebook:</strong> {facebook}</li>\n<li><strong>Instagram:</strong> {instagram}</li>\n<li><strong>LinkedIn:</strong> {linkedin}</li>\n</ul>',
    variables: ['firstName', 'lastName', 'email', 'phone', 'profession', 'shortBio', 'photoUrl', 'website', 'facebook', 'instagram', 'linkedin'],
    description: 'Internal notification sent when a guest completes their onboarding profile',
    from_email: 'vision@send.inneredge.co',
    from_name: 'Inner Edge',
    reply_to_email: 'info@inneredge.co',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [fromName, setFromName] = useState('');
  const [replyToEmail, setReplyToEmail] = useState('');
  const [editorHtml, setEditorHtml] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [originalSubject, setOriginalSubject] = useState('');
  const [originalFromEmail, setOriginalFromEmail] = useState('');
  const [originalFromName, setOriginalFromName] = useState('');
  const [originalReplyToEmail, setOriginalReplyToEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('template_name');

      if (error) throw error;

      const loadedTemplates = data && data.length > 0 ? data : DEFAULT_TEMPLATES;
      setTemplates(loadedTemplates);

      if (loadedTemplates.length > 0 && !selectedTemplateId) {
        selectTemplate(loadedTemplates[0]);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setTemplates(DEFAULT_TEMPLATES);
      if (DEFAULT_TEMPLATES.length > 0) {
        selectTemplate(DEFAULT_TEMPLATES[0]);
      }
    }
  }

  function selectTemplate(template: EmailTemplate) {
    setSelectedTemplateId(template.id);
    setSubject(template.subject);
    setOriginalSubject(template.subject);
    setFromEmail(template.from_email || 'vision@send.inneredge.co');
    setOriginalFromEmail(template.from_email || 'vision@send.inneredge.co');
    setFromName(template.from_name || 'Inner Edge');
    setOriginalFromName(template.from_name || 'Inner Edge');
    setReplyToEmail(template.reply_to_email || 'info@inneredge.co');
    setOriginalReplyToEmail(template.reply_to_email || 'info@inneredge.co');
    const htmlContent = template.content;
    setEditorHtml(htmlContent);
    setOriginalContent(htmlContent);
    setActiveTab('edit');
  }

  async function handleSave() {
    if (!selectedTemplateId) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(fromEmail)) {
      showMessage('error', 'Please enter a valid From Email address');
      return;
    }
    if (!emailRegex.test(replyToEmail)) {
      showMessage('error', 'Please enter a valid Reply-To Email address');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('email_templates')
        .update({
          subject,
          from_email: fromEmail,
          from_name: fromName,
          reply_to_email: replyToEmail,
          content: editorHtml,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedTemplateId);

      if (error) throw error;

      setOriginalContent(editorHtml);
      setOriginalSubject(subject);
      setOriginalFromEmail(fromEmail);
      setOriginalFromName(fromName);
      setOriginalReplyToEmail(replyToEmail);
      showMessage('success', 'Template saved successfully');
      await fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      showMessage('error', 'Failed to save template');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setEditorHtml(originalContent);
    setSubject(originalSubject);
    setFromEmail(originalFromEmail);
    setFromName(originalFromName);
    setReplyToEmail(originalReplyToEmail);
    showMessage('success', 'Template reset to last saved version');
  }

  function showMessage(type: 'success' | 'error', text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  }

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
  const hasChanges = editorHtml !== originalContent || subject !== originalSubject ||
    fromEmail !== originalFromEmail || fromName !== originalFromName || replyToEmail !== originalReplyToEmail;

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Admin
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-stone-900 mb-2">Email Templates</h1>
          <p className="text-stone-600">Customize automated email content sent to users</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-bold text-stone-900 mb-4">Templates</h2>
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => selectTemplate(template)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedTemplateId === template.id
                        ? 'bg-teal-50 text-teal-900 font-semibold border-2 border-teal-600'
                        : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-2 border-transparent'
                    }`}
                  >
                    {template.template_name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {selectedTemplate ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-stone-900 mb-2">
                        {selectedTemplate.template_name}
                      </h2>
                      {selectedTemplate.description && (
                        <p className="text-stone-600 text-sm mb-4">
                          {selectedTemplate.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {hasChanges && (
                        <button
                          onClick={handleReset}
                          className="flex items-center gap-2 px-4 py-2 bg-stone-200 text-stone-900 rounded-lg hover:bg-stone-300 font-semibold transition-colors"
                          disabled={loading}
                        >
                          <RotateCcw className="w-4 h-4" />
                          Reset
                        </button>
                      )}
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition-colors disabled:opacity-50"
                        disabled={loading || !hasChanges}
                      >
                        <Save className="w-4 h-4" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>

                  {selectedTemplate.variables.length > 0 && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-semibold text-blue-900 mb-2">Available Variables:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTemplate.variables.map((variable) => (
                          <code
                            key={variable}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono"
                          >
                            {'{{' + variable + '}}'}
                          </code>
                        ))}
                      </div>
                      <p className="text-xs text-blue-700 mt-2">
                        Use these variables in your template. They will be replaced with actual values when emails are sent.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mb-6 p-4 bg-stone-50 border border-stone-200 rounded-lg">
                  <p className="text-sm font-semibold text-stone-700 mb-3">Email Sender Settings</p>
                  <p className="text-xs text-stone-600 mb-4">
                    This email will be sent from: <strong>{fromName} &lt;{fromEmail}&gt;</strong><br />
                    Replies will go to: <strong>{replyToEmail}</strong>
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-2">
                        From Name
                      </label>
                      <input
                        type="text"
                        value={fromName}
                        onChange={(e) => setFromName(e.target.value)}
                        className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Inner Edge"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-2">
                        From Email
                      </label>
                      <input
                        type="email"
                        value={fromEmail}
                        onChange={(e) => setFromEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="vision@send.inneredge.co"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Reply-To Email
                    </label>
                    <input
                      type="email"
                      value={replyToEmail}
                      onChange={(e) => setReplyToEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="info@inneredge.co"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter email subject"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-stone-700 mb-3">
                    Email Content
                  </label>

                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('edit')}
                      className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
                        activeTab === 'edit'
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('preview')}
                      className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
                        activeTab === 'preview'
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Preview
                      </div>
                    </button>
                  </div>

                  {activeTab === 'edit' ? (
                    <RichTextEditor
                      content={editorHtml}
                      onChange={setEditorHtml}
                    />
                  ) : (
                    <div className="border border-stone-300 rounded-lg bg-white overflow-hidden">
                      <div className="p-6 bg-stone-50 border-b border-stone-200">
                        <p className="text-xs text-stone-500 mb-1">Subject:</p>
                        <p className="font-semibold text-stone-900">{subject || '(No subject)'}</p>
                      </div>
                      <div className="p-8">
                        {editorHtml ? (
                          <div
                            className="prose prose-lg prose-stone max-w-none"
                            dangerouslySetInnerHTML={{ __html: editorHtml }}
                          />
                        ) : (
                          <p className="text-stone-500 italic">No content to preview yet...</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-stone-600">Select a template to edit</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
