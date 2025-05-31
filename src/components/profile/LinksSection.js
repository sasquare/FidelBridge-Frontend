const LinksSection = ({ links }) => {
  if (!links) return null;

  const socialMedia = links.socialMedia || {};

  return (
    <>
      <h3 className="section-title mt-4">Links</h3>
      <div className="links-section">
        <p>
          <strong>Portfolio:</strong>{" "}
          {links.portfolio ? (
            <a
              href={links.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 hover:underline"
            >
              View Portfolio
            </a>
          ) : (
            "N/A"
          )}
        </p>
        {[
          { label: "Twitter", url: socialMedia.twitter },
          { label: "LinkedIn", url: socialMedia.linkedin },
          { label: "Instagram", url: socialMedia.instagram },
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
