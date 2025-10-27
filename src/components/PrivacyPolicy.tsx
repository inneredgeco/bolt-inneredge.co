import { useEffect } from 'react';
import { Header } from './Header';
import { SEOHead } from './SEOHead';

export function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy - Inner Edge';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Privacy Policy - Inner Edge"
        description="Inner Edge privacy policy. Learn how we collect, use, and protect your personal information when you use our mens coaching services and website."
        keywords="privacy policy, data protection, user privacy, terms and conditions"
        ogImage="https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png"
        canonical="https://www.inneredge.co/privacy-policy"
        ogUrl="https://www.inneredge.co/privacy-policy"
      />
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <p className="text-gray-600 italic">Last updated 6/7/2024</p>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of the Terms & Conditions</h2>
            <p className="text-gray-700 mb-4">
              These terms & conditions are entered into by and between You and Inner Edge ("Company", "we" or "us")
            </p>
            <p className="text-gray-700 mb-4">
              The following terms and conditions, together with any documents they expressly incorporated by reference
              (collectively, these "Terms & Conditions"), govern your access to and use of www.inneredge.co
              (the "Website"), including any content, functionality and services offered on or through the Website,
              whether as a guest or a registered user.
            </p>
            <p className="text-gray-700 mb-2">Key points include:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>By using the Website, you accept and agree to be bound by these Terms & Conditions and Privacy Policy</li>
              <li>The Website is only available to users 18 or older who are fully competent to enter into these terms</li>
              <li>Users must not access the Website if they do not meet these requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to the Terms & Conditions</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Terms may be revised and updated at any time</li>
              <li>Changes are effective immediately when posted</li>
              <li>Continued use of the Website means acceptance of revised terms</li>
              <li>Users are encouraged to review Terms & Conditions each time they access the Website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accessing the Website and Account Security</h2>
            <p className="text-gray-700 mb-4">
              The company reserves the right to withdraw or amend the Website without notice. Access to parts or all
              of the Website may be restricted.
            </p>
            <p className="text-gray-700 mb-2">Users are responsible for:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Arranging access to the Website</li>
              <li>Ensuring others using their internet connection comply with Terms & Conditions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Provision</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Accessing some Website resources may require providing registration details</li>
              <li>All information must be correct, current, and complete</li>
              <li>Information is governed by the Privacy Policy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property Rights</h2>
            <p className="text-gray-700 mb-4">
              The Website and its entire contents, features, and functionality are owned by Inner Edge, its licensors,
              or other providers of such material and are protected by United States and international copyright,
              trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prohibited Uses</h2>
            <p className="text-gray-700 mb-4">
              You may use the Website only for lawful purposes and in accordance with these Terms & Conditions.
              You agree not to use the Website:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
              <li>To exploit, harm, or attempt to exploit or harm minors in any way</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
              <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
              <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Contributions</h2>
            <p className="text-gray-700 mb-4">
              The Website may contain message boards, chat rooms, personal web pages or profiles, forums, bulletin boards,
              and other interactive features that allow users to post, submit, publish, display, or transmit content or
              materials to other users or other persons.
            </p>
            <p className="text-gray-700 mb-4">
              All User Contributions must comply with applicable laws and these Terms & Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Monitoring and Enforcement</h2>
            <p className="text-gray-700 mb-4">We have the right to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Remove or refuse to post any User Contributions for any or no reason</li>
              <li>Take any action with respect to any User Contribution that we deem necessary or appropriate</li>
              <li>Disclose your identity or other information about you to any third party who claims that material posted by you violates their rights</li>
              <li>Take appropriate legal action, including without limitation, referral to law enforcement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              All information we collect on this Website is subject to our Privacy Policy. By using the Website,
              you consent to all actions taken by us with respect to your information in compliance with the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Protection</h2>
            <p className="text-gray-700 mb-4">
              We are committed to protecting your personal information. We collect and process data in accordance with
              applicable data protection laws. Your data will be used solely for the purposes outlined in our services
              and will not be shared with third parties without your explicit consent, except as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              In no event will Inner Edge, its affiliates, or their licensors, service providers, employees, agents,
              officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in
              connection with your use, or inability to use, the Website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimer of Warranties</h2>
            <p className="text-gray-700 mb-4">
              You understand that we cannot and do not guarantee or warrant that files available for downloading from
              the internet or the Website will be free of viruses or other destructive code. You are responsible for
              implementing sufficient procedures and checkpoints to satisfy your particular requirements for anti-virus
              protection and accuracy of data input and output.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law and Jurisdiction</h2>
            <p className="text-gray-700 mb-4">
              All matters relating to the Website and these Terms & Conditions and any dispute or claim arising therefrom
              or related thereto shall be governed by and construed in accordance with the internal laws of the United States
              without giving effect to any choice or conflict of law provision or rule.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Waiver and Severability</h2>
            <p className="text-gray-700 mb-4">
              No waiver by the Company of any term or condition set forth in these Terms & Conditions shall be deemed a
              further or continuing waiver of such term or condition or a waiver of any other term or condition.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy or our Terms & Conditions, please contact us at:
            </p>
            <p className="text-gray-700 font-medium">
              Inner Edge<br />
              Email: hello@inneredge.co
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
