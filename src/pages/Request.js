import { useState } from "react";
import axios from "../utils/axiosConfig";
import { Container, Form, Button, Alert } from "react-bootstrap";

function Request() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/requests", {
        category,
        description,
      });
      setSuccess(res.data.message);
      setCategory("");
      setDescription("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request");
      setSuccess("");
    }
  };

  return (
    <Container className="py-5">
      <div className="form-container">
        <h2 className="text-center mb-4">Request a Service</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Tutoring">Tutoring</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Electrical">Electrical</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Haircut">Haircut</option>
              <option value="Gardening">Gardening</option>
              <option value="Fashion Designing">Fashion Designing</option>
              <option value="Moving">Moving</option>
              <option value="Photography">Photography</option>
              <option value="Catering">Catering</option>
              <option value="Personal Training">Personal Training</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your needs"
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Submit Request
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default Request;
