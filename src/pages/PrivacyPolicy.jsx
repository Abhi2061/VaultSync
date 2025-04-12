import React from "react";

const PrivacyPolicy = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>Privacy Policy</h1>
      <p>Last Updated: March 2025</p>

      <h2>1. Introduction</h2>
      <p>
        Welcome to our password manager. Your privacy is important to us. We do
        not store, share, or sell your passwords.
      </p>

      <h2>2. Data Collection</h2>
      <p>
        We only store encrypted passwords that you enter. Your data is private
        and can only be accessed by you.
      </p>

      <h2>3. Security Measures</h2>
      <p>
        We use Firebase Firestore to store passwords securely. No data is
        exposed to third parties.
      </p>

      <h2>4. Contact</h2>
      <p>
        If you have any questions, please contact us at{" "}
        <a href="mailto:support@yourwebsite.com">abhishek2061a@gmail.com</a>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
