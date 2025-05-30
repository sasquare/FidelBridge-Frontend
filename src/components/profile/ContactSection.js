const ContactSection = ({ contact }) => {
  if (!contact) return null;

  return (
    <>
      <h3 className="section-title mt-4">Contact & Location</h3>
      <div className="contact-section">
        <p>
          <strong>Location:</strong> {contact.address || "N/A"}
        </p>
        <p>
          <strong>Phone:</strong> {contact.phone || "N/A"}
        </p>
      </div>
    </>
  );
};

export default ContactSection;
