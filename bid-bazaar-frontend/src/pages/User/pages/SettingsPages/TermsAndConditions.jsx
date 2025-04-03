import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="terms-and-conditions">
      <h1 className="label">Terms and Conditions</h1>
      <div
        style={{
          color: "var(--text-color)",
          fontSize: "18px",
          fontFamily: "Blinker",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span className="paragraph">
          Welcome to BidBazaar! By using our mobile application ("App") and
          services, you agree to comply with and be bound by these Terms and
          Conditions ("Terms"). Please review these Terms carefully. If you do
          not agree with these Terms, you must not use the App.
        </span>
        <span className="title">1. User Accounts</span>
        <div className="numbered-list">
          <span>
            <b>a. </b>
          </span>
          <span>
            <b>Registration:</b> To access certain features of the App, you may
            be required to create an account. You agree to provide accurate,
            current, and complete information during the registration process
            and to update such information to keep it accurate, current, and
            complete.
          </span>
        </div>
        <div className="numbered-list">
          <span>
            <b>b. </b>
          </span>
          <span>
            <b>Account Security: </b>You are responsible for maintaining the
            confidentiality of your account credentials and for all activities
            that occur under your account. Notify us immediately of any
            unauthorized use of your account or any other breach of security.
          </span>
        </div>
        <span className="title">2. User Conduct</span>
        <div className="numbered-list">
          <span>
            <b>a. </b>
          </span>
          <span>
            <b>Prohibited Activities:</b> You agree not to engage in any of the
            following prohibited activities:
          </span>
        </div>
        <div style={{ marginLeft: "20px", display: "flex", flexDirection: "column", marginBottom: "12px" }}>
          <span>
            - Violating any local, state, national, or international law or
            regulation.
          </span>
          <span>
            - Posting or transmitting any content that is harmful, offensive, or
            otherwise objectionable.
          </span>
          <span>
            - Attempting to interfere with, compromise the system integrity or
            security, or decipher any transmissions to or from the servers
            running the App.
          </span>
          <span>
            - Impersonating another person or entity, or falsifying your
            affiliation with an entity or person.
          </span>
        </div>
        <div className="numbered-list">
          <span>
            <b>b. </b>
          </span>
          <span>
            <b>Content Standards: </b>All content you post or share on the App
            must comply with these Terms and applicable laws and regulations. We
            reserve the right to remove any content that violates these
            standards.
          </span>
        </div>
        <span className="title">3. Auction and Bidding</span>
        <div className="numbered-list">
          <span>
            <b>a. </b>
          </span>
          <span>
            <b>Auction Listings:</b> Users can list items for auction by
            providing accurate and complete details about the item, including
            photos and starting bid prices.
          </span>
        </div>
        <div className="numbered-list">
          <span>
            <b>b. </b>
          </span>
          <span>
            <b>Bidding: </b>Bids placed are final and cannot be retracted. The
            highest bid at the end of the auction period wins the item.
          </span>
        </div>
        <div className="numbered-list">
          <span>
            <b>c. </b>
          </span>
          <span>
            <b>Payment: </b>Winning bidders are required to complete the payment
            process within the specified timeframe. Failure to do so may result
            in account suspension.
          </span>
        </div>
        <span className="title">4. Fees and Payments</span>
        <div className="numbered-list">
          <span>
            <b>a. </b>
          </span>
          <span>
            <b>Service Fees: </b>Currently, BidBazaar does not charge any
            service fees for registering, bidding, or listing items. We reserve
            the right to introduce fees in the future with prior notice to
            users.
          </span>
        </div>
        <div className="numbered-list">
          <span>
            <b>b. </b>
          </span>
          <span>
            <b>Payment Methods: </b>Payments can be made through the methods
            specified in the App, including mobile payments and direct bank
            transfers.
          </span>
        </div>
        <span className="title">5. Data Privacy and Security</span>
        <div className="numbered-list">
          <span>
            <b>a. </b>
          </span>
          <span>
            <b>Data Collection: </b>We collect and process personal data in
            accordance with our Privacy Policy. You agree to our collection and
            use of your data as described in the Privacy Policy.
          </span>
        </div>
        <div className="numbered-list">
          <span>
            <b>b. </b>
          </span>
          <span>
            <b>Data Security: </b>We implement reasonable security measures to
            protect your personal information. However, no method of
            transmission over the Internet or method of electronic storage is
            100% secure. While we strive to use commercially acceptable means to
            protect your personal information, we cannot guarantee its absolute
            security.
          </span>
        </div>
        <span className="title">6. Intellectual Property</span>
        <div className="numbered-list">
          <span>
            <b>a. </b>
          </span>
          <span>
            <b>Ownership: </b>All intellectual property rights in the App and
            its content are owned by or licensed to BidBazaar.
          </span>
        </div>
        <div className="numbered-list">
          <span>
            <b>b. </b>
          </span>
          <span>
            <b>User Content: </b>By posting content on the App, you grant us a
            non-exclusive, royalty-free, worldwide, perpetual license to use,
            reproduce, modify, and distribute your content.
          </span>
        </div>
        <span className="title">7. Termination</span>
        <div className="numbered-list">
          <span>
            <b>a. </b>
          </span>
          <span>
            <b>Termination by You: </b>You may terminate your account any time
            by following the instructions in the Application.
          </span>
        </div>
        <div className="numbered-list">
          <span>
            <b>b. </b>
          </span>
          <span>
            <b>Termination by Us: </b>We may terminate or suspend your account
            and access to the App at our discretion, without prior notice, for
            conduct that we believe violates these Terms or is harmful to other
            users.
          </span>
        </div>
        <span className="title">
          8. Disclaimers and Limitation of Liability
        </span>
        <div className="numbered-list">
          <span>
            <b>a. </b>
          </span>
          <span>
            <b>As-Is Basis: </b>The App is provided on an "as-is" and
            "as-available" basis. We make no warranties, express or implied,
            regarding the App.
          </span>
        </div>
        <div className="numbered-list">
          <span>
            <b>b. </b>
          </span>
          <span>
            <b>Limitation of Liability: </b>To the fullest extent permitted by
            law, BidBazaar shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages, or any loss of profits
            or revenues.
          </span>
        </div>
        <span className="title">9. Governing Law</span>
        <span>
          These Terms shall be governed by and construed in accordance with the
          laws of Nepal, without regard to its conflict of law principles.
        </span>
        <span className="title">10. Changes to Terms</span>
        <span>
          We reserve the right to modify these Terms at any time. We will notify
          users of any changes by posting the updated Terms on the App. Your
          continued use of the App after such changes constitutes your
          acceptance of the new Terms.
        </span>
        <span className="title">11. Contact Us</span>
        <span>
          If you have any questions or concerns about these Terms, please
          contact us through the support section in the App.
        </span>
        <span style={{ marginTop: "40px", fontStyle: "italic" }}>
          By using BidBazaar, you acknowledge that you have read, understood,
          and agreed to these Terms and Conditions.
        </span>
        <span style={{ marginTop: "6px", fontStyle: "italic", color: "grey" }}>
          Last updated: April 3, 2025
        </span>
      </div>
    </div>
  );
};

export default TermsAndConditions;
