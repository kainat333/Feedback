import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-gray-200 p-8 relative">
        {/* AimNexus black top border */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-black rounded-t-xl"></div>

        <h1 className="text-3xl font-bold text-gray-900 mb-5 text-left">
          Terms and Conditions
        </h1>

        <p className="text-gray-700 mb-6 text-left leading-relaxed">
          Welcome to <span className="font-semibold">AimNexus</span>. By using
          our website or services, you agree to these Terms and Conditions.
          Please read them carefully before using our platform.
        </p>

        <div className="space-y-5 text-gray-700 leading-relaxed text-left">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-1.5">
              1. Use of Services
            </h2>
            <p>
              You agree to use AimNexus only for lawful and respectful purposes.
              We may restrict or suspend users who violate these guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-1.5">
              2. Account Responsibility
            </h2>
            <p>
              You are responsible for maintaining your account security.
              AimNexus is not liable for any unauthorized access to your
              account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-1.5">
              3. Intellectual Property
            </h2>
            <p>
              All logos, designs, and content belong to AimNexus. Copying or
              redistribution without permission is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-1.5">
              4. Feedback & Submissions
            </h2>
            <p>
              By submitting feedback, you allow AimNexus to use it internally to
              improve services without compensation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-1.5">
              5. Limitation of Liability
            </h2>
            <p>
              AimNexus is not responsible for losses resulting from service
              interruptions or user misuse of the website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-1.5">
              6. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate accounts that breach
              our terms without notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-1.5">
              7. Governing Law
            </h2>
            <p>
              These terms are governed by the laws of Pakistan. Any disputes
              shall be handled by courts in Islamabad.
            </p>
          </section>
        </div>

        <p className="text-gray-600 mt-8 text-sm text-left">
          <strong>Last Updated:</strong> October 2025
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
