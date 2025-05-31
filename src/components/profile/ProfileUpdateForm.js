import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "../../utils/axiosConfig";

function ProfileUpdateForm({ user, onUpdate, isProfessional }) {
  // Initialize form data with user info and nested objects if professional
  const initialFormData = {
    name: user?.name || "",
    email: user?.email || "",
    ...(isProfessional && {
      headline: user?.headline || "",
      serviceType: user?.serviceType || "",
      businessRegNumber: user?.businessRegNumber || "",
      contact: {
        address: user?.contact?.address || "",
        phone: user?.contact?.phone || "",
      },
      links: {
        portfolio: user?.links?.portfolio || "",
        socialMedia: {
          twitter: user?.links?.socialMedia?.twitter || "",
          linkedin: user?.links?.socialMedia?.linkedin || "",
          instagram: user?.links?.socialMedia?.instagram || "",
        },
        email: user?.links?.email || "",
      },
      portfolio: user?.portfolio || [],
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

  // Handles changes for inputs, supports nested keys with dot notation like "contact.address"
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      // For nested keys e.g. contact.address
      const keys = name.split(".");
      setFormData((prev) => {
        const updated = { ...prev };
        let obj = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          obj[keys[i]] = { ...obj[keys[i]] };
          obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
        return updated;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      if (name === "picture") setPicture(files[0]);
      else if (name === "video") setVideo(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const formPayload = new FormData();

      // Helper to append nested data recursively
      const appendFormData = (data, parentKey = "") => {
        Object.entries(data).forEach(([key, value]) => {
          const formKey = parentKey ? `${parentKey}.${key}` : key;
          if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof File)) {
            appendFormData(value, formKey);
          } else {
            formPayload.append(formKey, value);
          }
        });
      };

      appendFormData(formData);

      if (picture) formPayload.append("picture", picture);
      if (video) formPayload.append("video", video);

      const response = await axios.put("/profile/update", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Profile updated successfully!");
      onUpdate && onUpdate(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed. Please try again.");
    }
  };

  return (
    <Form onSubmit={handleSubmit} encType="multipart/form-data">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

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
            <Form.Label>Headline</Form.Label>
            <Form.Control
              type="text"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="serviceType" className="mt-3">
            <Form.Label>Service Type</Form.Label>
            <Form.Select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
            >
              <option value="">Select a service</option>
              {serviceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Select>
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

          {/* Contact Info */}
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
              type="tel"
              name="contact.phone"
              value={formData.contact.phone}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Links */}
          <Form.Group controlId="links.portfolio" className="mt-3">
            <Form.Label>Portfolio URL</Form.Label>
            <Form.Control
              type="url"
              name="links.portfolio"
              value={formData.links.portfolio}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="links.socialMedia.twitter" className="mt-3">
            <Form.Label>Twitter URL</Form.Label>
            <Form.Control
              type="url"
              name="links.socialMedia.twitter"
              value={formData.links.socialMedia.twitter}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="links.socialMedia.linkedin" className="mt-3">
            <Form.Label>LinkedIn URL</Form.Label>
            <Form.Control
              type="url"
              name="links.socialMedia.linkedin"
              value={formData.links.socialMedia.linkedin}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="links.socialMedia.instagram" className="mt-3">
            <Form.Label>Instagram URL</Form.Label>
            <Form.Control
              type="url"
              name="links.socialMedia.instagram"
              value={formData.links.socialMedia.instagram}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="links.email" className="mt-3">
            <Form.Label>Contact Email</Form.Label>
            <Form.Control
              type="email"
              name="links.email"
              value={formData.links.email}
              onChange={handleChange}
            />
          </Form.Group>

          {/* File inputs */}
          <Form.Group controlId="picture" className="mt-3">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control
              type="file"
              name="picture"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>

          <Form.Group controlId="video" className="mt-3">
            <Form.Label>Introduction Video</Form.Label>
            <Form.Control
              type="file"
              name="video"
              accept="video/*"
              onChange={handleFileChange}
            />
          </Form.Group>
        </>
      )}

      <Button variant="primary" type="submit" className="mt-4">
        Update Profile
      </Button>
    </Form>
  );
}

export default ProfileUpdateForm;
