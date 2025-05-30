import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "../../utils/axiosConfig";

function ProfileUpdateForm({ user, onUpdate, isProfessional }) {
  const initialFormData = {
    name: user.name || "",
    email: user.email || "",
    ...(isProfessional && {
      headline: user.headline || "",
      serviceType: user.serviceType || "",
      businessRegNumber: user.businessRegNumber || "",
      contact: {
        address: user.contact?.address || "",
        phone: user.contact?.phone || "",
      },
      links: {
        portfolio: user.links?.portfolio || "",
        socialMedia: {
          twitter: user.links?.socialMedia?.twitter || "",
          linkedin: user.links?.socialMedia?.linkedin || "",
          instagram: user.links?.socialMedia?.instagram || "",
        },
        email: user.links?.email || "",
      },
      portfolio: user.portfolio || [],
    }),
  };

  const [formData, setFormData] = useState(initialFormData);
  const [picture, setPicture] = useState(null);
  const [video, setVideo] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      links: {
        ...prev.links,
        socialMedia: {
          ...prev.links.socialMedia,
          [name]: value,
        },
      },
    }));
  };

  const handlePortfolioChange = (index, field, value) => {
    const newPortfolio = [...formData.portfolio];
    newPortfolio[index] = { ...newPortfolio[index], [field]: value };
    setFormData((prev) => ({ ...prev, portfolio: newPortfolio }));
  };

  const addPortfolioItem = () => {
    if (formData.portfolio.length >= 2) {
      setError("Maximum 2 portfolio items allowed");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      portfolio: [...prev.portfolio, { title: "", image: "", description: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updatedUser = await axios.put("/api/users/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Profile updated successfully");
      setError("");
      setFormData(initialFormData); // Reset form
      onUpdate(updatedUser.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
      setSuccess("");
    }
  };

  const handleFileUpload = async (type, file) => {
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append(type, file);
    try {
      const token = localStorage.getItem("token");
      const uploadResponse = await axios.post(
        `/api/users/upload-${type}`,
        uploadData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccess(
        uploadResponse.data.message ||
          `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } uploaded successfully`
      );
      setError("");
      setPicture(null); // Clear file input
      setVideo(null); // Clear file input
      const updatedUser = await axios.get("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdate(updatedUser.data);
    } catch (error) {
      setError(error.response?.data?.message || `Failed to upload ${type}`);
      setSuccess("");
    }
  };

  return (
    <div className="mt-4">
      <h3 className="section-title">Update Profile</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="email" className="mt-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {isProfessional && (
          <>
            <Form.Group controlId="headline" className="mt-3">
              <Form.Label>Tagline</Form.Label>
              <Form.Control
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="serviceType" className="mt-3">
              <Form.Label>Service Type</Form.Label>
              <Form.Control
                as="select"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
              >
                <option value="">Select Service</option>
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="businessRegNumber" className="mt-3">
              <Form.Label>Business Registration Number</Form.Label>
              <Form.Control
                type="text"
                name="businessRegNumber"
                value={formData.businessRegNumber}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="contact.address" className="mt-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="contact.address"
                value={formData.contact.address}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="contact.phone" className="mt-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="contact.phone"
                value={formData.contact.phone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="links.portfolio" className="mt-3">
              <Form.Label>Portfolio URL</Form.Label>
              <Form.Control
                type="text"
                name="links.portfolio"
                value={formData.links.portfolio}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="twitter" className="mt-3">
              <Form.Label>Twitter</Form.Label>
              <Form.Control
                type="text"
                name="twitter"
                value={formData.links.socialMedia.twitter}
                onChange={handleSocialMediaChange}
              />
            </Form.Group>
            <Form.Group controlId="linkedin" className="mt-3">
              <Form.Label>LinkedIn</Form.Label>
              <Form.Control
                type="text"
                name="linkedin"
                value={formData.links.socialMedia.linkedin}
                onChange={handleSocialMediaChange}
              />
            </Form.Group>
            <Form.Group controlId="instagram" className="mt-3">
              <Form.Label>Instagram</Form.Label>
              <Form.Control
                type="text"
                name="instagram"
                value={formData.links.socialMedia.instagram}
                onChange={handleSocialMediaChange}
              />
            </Form.Group>
            <Form.Group controlId="links.email" className="mt-3">
              <Form.Label>Public Email</Form.Label>
              <Form.Control
                type="email"
                name="links.email"
                value={formData.links.email}
                onChange={handleChange}
              />
            </Form.Group>
            <h4 className="mt-4">Portfolio Items (Max 2)</h4>
            {formData.portfolio.map((item, index) => (
              <div key={index} className="border p-3 mt-2">
                <Form.Group controlId={`portfolio-title-${index}`}>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      handlePortfolioChange(index, "title", e.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group
                  controlId={`portfolio-image-${index}`}
                  className="mt-2"
                >
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    value={item.image}
                    onChange={(e) =>
                      handlePortfolioChange(index, "image", e.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group
                  controlId={`portfolio-description-${index}`}
                  className="mt-2"
                >
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={item.description}
                    onChange={(e) =>
                      handlePortfolioChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
              </div>
            ))}
            <Button
              variant="secondary"
              className="mt-2"
              onClick={addPortfolioItem}
              disabled={formData.portfolio.length >= 2}
            >
              Add Portfolio Item
            </Button>
            <Form.Group controlId="picture" className="mt-3">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setPicture(e.target.files[0])}
              />
              <Button
                variant="primary"
                className="mt-2"
                onClick={() => handleFileUpload("picture", picture)}
                disabled={!picture}
              >
                Upload Picture
              </Button>
            </Form.Group>
            <Form.Group controlId="video" className="mt-3">
              <Form.Label>Showcase Video (MP4)</Form.Label>
              <Form.Control
                type="file"
                accept="video/mp4"
                onChange={(e) => setVideo(e.target.files[0])}
              />
              <Button
                variant="primary"
                className="mt-2"
                onClick={() => handleFileUpload("video", video)}
                disabled={!video}
              >
                Upload Video
              </Button>
            </Form.Group>
          </>
        )}
        <Button type="submit" className="mt-4">
          Save Profile
        </Button>
      </Form>
    </div>
  );
}

export default ProfileUpdateForm;
