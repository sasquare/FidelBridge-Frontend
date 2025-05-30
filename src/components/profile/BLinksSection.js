const LinksSection = ({ links }) => {
  if (!links) return null;

  return (
    <>
      <h3 className="section-title mt-4">Links</h3>
      <div className="links-section">
        {[
          { label: "Portfolio", url: links.portfolio },
          { label: "Twitter", url: links.socialMedia?.twitter },
          { label: "LinkedIn", url: links.socialMedia?.linkedin },
          { label: "Instagram", url: links.socialMedia?.instagram },
        ].map((link, index) => (
          <p key={index}>
            <strong>{link.label}:</strong>{" "}
            {link.url ? (
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.url}
              </a>
            ) : (
              "N/A"
            )}
          </p>
        ))}
        <p>
          <strong>Email:</strong> {links.email || "N/A"}
        </p>
      </div>
    </>
  );
};

export default LinksSection;
