import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-gray-200 p-8 relative">
        {/* AimNexus black top border */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-black rounded-t-xl"></div>

        <h1 className="text-3xl font-bold text-gray-900 mb-5 text-left">
          Privacy Policy
        </h1>

        <p className="text-gray-700 mb-6 text-left leading-relaxed">
          Welcome to <span className="font-semibold">AimNexus</span>. We respect
          your privacy and are committed to protecting your personal data. This
          policy explains how we collect, use, and safeguard your information
          when you use our platform or services.
        </p>

        <div className="space-y-5 text-gray-700 leading-relaxed text-left">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-1.5">
              1. Information We Collect
            </h2>
            <p>
              We collect information you provide directly, such as your name,
              email, and feedback. We may also collect technical details like
              browser type and IP address to enhance your experience.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-1.5">
              2. How We Use Your Information
            </h2>
            <p>
              Your data helps us improve our services, personalize your
              experience, and respond effectively to your queries or feedback.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-1.5">
              3. Data Protection
            </h2>
            <p>
              We use secure systems and encryption to protect your data from
              unauthorized access, misuse, or loss.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-1.5">
              4. Cookies
            </h2>
            <p>
              AimNexus uses cookies to remember preferences and enhance
              usability. You can manage or disable cookies in your browser
              settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-1.5">
              5. Your Rights
            </h2>
            <p>
              You can request access, correction, or deletion of your personal
              data anytime by contacting our support team.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-1.5">
              6. Policy Updates
            </h2>
            <p>
              We may occasionally update this Privacy Policy. Updates will be
              posted on this page for transparency.
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

export default PrivacyPolicy;
