import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "../../utils/axiosConfig";
import AlertMessage from "./AlertMessage";

const ProfileUpdateForm = ({
  user,
  headline,
  setHeadline,
  portfolio,
  setPortfolio,
  links,
  setLinks,
  contact,
  setContact,
}) => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "/api/users/profile",
        { headline, portfolio, links, contact },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Use the response message from the backend if available
      setSuccess(res.data.message || "Profile updated successfully");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <Form onSubmit={handleProfileUpdate} className="update-form mt-5">
      <h3 className="section-title">Update Profile</h3>
      {error && <AlertMessage variant="danger" message={error} />}
      {success && <AlertMessage variant="success" message={success} />}

      <Form.Group className="mb-3">
        <Form.Label>Headline</Form.Label>
        <Form.Control
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Enter your headline"
        />
      </Form.Group>

      {user.role === "professional" && (
        <>
          <h4 className="mt-4">Portfolio Items</h4>
          {portfolio.map((item, index) => (
            <div key={index} className="portfolio-item mb-4 p-3 border rounded">
              <h5>Item {index + 1}</h5>
              <Form.Group className="mb-2">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const newPortfolio = [...portfolio];
                    newPortfolio[index].title = e.target.value;
                    setPortfolio(newPortfolio);
                  }}
                  placeholder="Enter title"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  value={item.image}
                  onChange={(e) => {
                    const newPortfolio = [...portfolio];
                    newPortfolio[index].image = e.target.value;
                    setPortfolio(newPortfolio);
                  }}
                  placeholder="Enter image URL"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  value={item.description}
                  onChange={(e) => {
                    const newPortfolio = [...portfolio];
                    newPortfolio[index].description = e.target.value;
                    setPortfolio(newPortfolio);
                  }}
                  placeholder="Enter description"
                  rows={3}
                />
              </Form.Group>
            </div>
          ))}

          <h4 className="mt-4">Social Links</h4>
          {/* Include all the form fields for links and contact as in the original */}
        </>
      )}

      <Button type="submit" variant="primary" className="mt-4" size="lg">
        Save Profile Changes
      </Button>
    </Form>
  );
};

export default ProfileUpdateForm;
