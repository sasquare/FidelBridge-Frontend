import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import "../components/profile/Profile.css";

function SearchProfessionals() {
  const [query, setQuery] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [location, setLocation] = useState("");
  const [professionals, setProfessionals] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const serviceTypes = [
    "Plumbing",
    "Tutoring",
    "Cleaning",
    "Electrical",
    "Carpentry",
    "Haircut",
    "Gardening",
    "Fashion Designing",
    "Moving",
    "Photography",
    "Catering",
    "Personal Training",
    "Accounting",
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/users/search", {
        headers: { Authorization: `Bearer ${token}` },
        params: { query, serviceType, location },
      });
      setProfessionals(res.data);
      setError("");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to search professionals"
      );
      setProfessionals([]);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="profile-title">Search Professionals</h2>
      <Form onSubmit={handleSearch}>
        <Row>
          <Col md={4}>
            <Form.Group controlId="query">
              <Form.Label>Name or Description</Form.Label>
              <Form.Control
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter name or keyword"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="serviceType">
              <Form.Label>Service Type</Form.Label>
              <Form.Control
                as="select"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              >
                <option value="">All Services</option>
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city or address"
              />
            </Form.Group>
          </Col>
        </Row>
        <Button type="submit" className="mt-3">
          Search
        </Button>
      </Form>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      <Row className="mt-4">
        {professionals.map((pro) => (
          <Col md={4} key={pro._id} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={pro.picture || "https://via.placeholder.com/150"}
                style={{ height: "150px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{pro.name}</Card.Title>
                <Card.Text>{pro.headline || "No description"}</Card.Text>
                <Card.Text>
                  <strong>Service:</strong> {pro.serviceType || "N/A"}
                </Card.Text>
                <Card.Text>
                  <strong>Location:</strong> {pro.contact?.address || "N/A"}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/profile/${pro._id}`)}
                >
                  View Profile
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default SearchProfessionals;
