import { Card, Row, Col } from "react-bootstrap";

const PortfolioSection = ({ portfolio }) => {
  if (!portfolio?.length) return null;

  return (
    <>
      <h3 className="section-title mt-4">Portfolio</h3>
      <Row>
        {portfolio.map((item, index) => {
          const imgSrc = item?.image || "/default-portfolio.png";
          const altText = item?.title || "Portfolio item";
          return (
            <Col md={6} key={index} className="mb-3">
              <Card className="portfolio-card">
                <Card.Img
                  variant="top"
                  src={imgSrc}
                  alt={altText}
                  onError={(e) => {
                    e.target.onerror = null; // prevent infinite loop
                    e.target.src = "/default-portfolio.png";
                  }}
                />
                <Card.Body>
                  <Card.Title>{item?.title || "Untitled"}</Card.Title>
                  <Card.Text>{item?.description || "No description"}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default PortfolioSection;
