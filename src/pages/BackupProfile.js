import { useState, useEffect, useCallback } from "react";
import axios from "../utils/axiosConfig";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  Image,
  Spinner,
} from "react-bootstrap";
import ReactStars from "react-rating-stars-component";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});

function Profile() {
  const [user, setUser] = useState({
    name: "",
    role: "",
    picture: "",
    headline: "",
    averageRating: 0,
    _id: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [picture, setPicture] = useState(null);
  const [headline, setHeadline] = useState("");
  const [portfolio, setPortfolio] = useState([
    { title: "", image: "", description: "" },
    { title: "", image: "", description: "" },
  ]);
  const [links, setLinks] = useState({
    portfolio: "",
    socialMedia: { twitter: "", linkedin: "", instagram: "" },
    email: "",
  });
  const [contact, setContact] = useState({ address: "", phone: "" });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });

      if (!res.data) {
        throw new Error("No profile data received");
      }

      const profileData = res.data;
      setUser({
        name: profileData.name || "",
        role: profileData.role || "",
        picture: profileData.picture || "https://via.placeholder.com/150",
        headline: profileData.headline || "",
        averageRating: profileData.averageRating || 0,
        _id: profileData._id || "",
      });

      setHeadline(profileData.headline || "");
      setPortfolio((prevPortfolio) =>
        profileData.portfolio?.length
          ? profileData.portfolio
          : [...prevPortfolio]
      );
      setLinks((prevLinks) => profileData.links || { ...prevLinks });
      setContact((prevContact) => profileData.contact || { ...prevContact });
      setIsOnline(profileData.isOnline || false);
      setLoading(false);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load profile. Please try again."
      );
      setLoading(false);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();

    const userId = localStorage.getItem("userId");
    if (userId) {
      socket.emit("setOnline", userId);
      const handleStatusUpdate = ({ userId: updatedUserId, isOnline }) => {
        if (updatedUserId === user?._id) setIsOnline(isOnline);
      };
      socket.on("statusUpdate", handleStatusUpdate);

      return () => {
        socket.emit("setOffline", userId);
        socket.off("statusUpdate", handleStatusUpdate);
      };
    }
  }, [fetchProfile, user?._id]);

  const handlePictureUpload = async (e) => {
    e.preventDefault();
    if (!picture) {
      setError("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("picture", picture);

    try {
      const res = await axios.post("/api/users/upload-picture", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Profile picture updated successfully");
      setUser((prev) => ({
        ...prev,
        picture: res.data.picture
          ? `http://localhost:5000${res.data.picture}`
          : prev.picture,
      }));
      setPicture(null);
      document.getElementById("pictureInput").value = "";
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to upload picture. Please try again."
      );
    }
  };

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
      setSuccess("Profile updated successfully");
      setUser((prev) => ({ ...prev, ...res.data }));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    }
  };

  const handleRating = async (e) => {
    e.preventDefault();
    if (!rating || !user?._id) {
      setError("Please select a rating");
      return;
    }

    try {
      await axios.post(
        `/api/users/rate/${user._id}`,
        { score: rating, comment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSuccess("Thank you for your rating!");
      setRating(0);
      setComment("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit rating. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!user && error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="profile-container py-5">
      <Row>
        <Col md={3} className="sidebar">
          <div className="status-box">
            <h4>Status</h4>
            <div
              className={`status-indicator ${isOnline ? "online" : "offline"}`}
            >
              {isOnline ? "Online" : "Offline"}
            </div>
          </div>
        </Col>
        <Col md={9}>
          <h2 className="profile-title">{user.name}'s Profile</h2>

          {error && (
            <Alert variant="danger" onClose={() => setError("")} dismissible>
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" onClose={() => setSuccess("")} dismissible>
              {success}
            </Alert>
          )}

          <Row className="profile-header">
            <Col md={4} className="text-center">
              <Image
                src={user.picture}
                roundedCircle
                className="profile-img"
                alt="Profile"
              />
              <Form onSubmit={handlePictureUpload} className="mt-3">
                <Form.Group>
                  <Form.Control
                    id="pictureInput"
                    type="file"
                    onChange={(e) => setPicture(e.target.files[0])}
                    accept="image/*"
                  />
                </Form.Group>
                <Button
                  type="submit"
                  variant="primary"
                  className="mt-2"
                  disabled={!picture}
                >
                  Upload Picture
                </Button>
              </Form>
            </Col>
            <Col md={8}>
              <h4 className="profile-headline">
                {user.headline || "No headline set"}
              </h4>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
              <p>
                <strong>Average Rating:</strong>{" "}
                {typeof user.averageRating === "number"
                  ? user.averageRating.toFixed(1)
                  : "0.0"}{" "}
                / 5
              </p>
            </Col>
          </Row>

          {user.role === "professional" && (
            <>
              <h3 className="section-title mt-4">Portfolio</h3>
              <Row>
                {portfolio.map((item, index) => (
                  <Col md={6} key={index} className="mb-3">
                    <Card className="portfolio-card">
                      <Card.Img
                        variant="top"
                        src={item.image || "https://via.placeholder.com/300"}
                        alt={item.title || "Portfolio item"}
                      />
                      <Card.Body>
                        <Card.Title>{item.title || "Untitled"}</Card.Title>
                        <Card.Text>
                          {item.description || "No description"}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <h3 className="section-title mt-4">Links</h3>
              <div className="links-section">
                {[
                  { label: "Portfolio", url: links.portfolio },
                  { label: "Twitter", url: links.socialMedia.twitter },
                  { label: "LinkedIn", url: links.socialMedia.linkedin },
                  { label: "Instagram", url: links.socialMedia.instagram },
                ].map((link, index) => (
                  <p key={index}>
                    <strong>{link.label}:</strong>{" "}
                    {link.url ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
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

              <h3 className="section-title mt-4">Contact</h3>
              <div className="contact-section">
                <p>
                  <strong>Address:</strong> {contact.address || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong> {contact.phone || "N/A"}
                </p>
              </div>
            </>
          )}

          {user.role === "customer" && (
            <Form onSubmit={handleRating} className="rating-form mt-4">
              <h3 className="section-title">Rate Professional</h3>
              <Form.Group>
                <Form.Label>Rating</Form.Label>
                <ReactStars
                  count={5}
                  value={rating}
                  size={24}
                  activeColor="#ffd700"
                  onChange={setRating}
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
              </Form.Group>
              <Button
                type="submit"
                variant="primary"
                className="mt-3"
                disabled={!rating}
              >
                Submit Rating
              </Button>
            </Form>
          )}

          <Form onSubmit={handleProfileUpdate} className="update-form mt-5">
            <h3 className="section-title">Update Profile</h3>

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
                  <div
                    key={index}
                    className="portfolio-item mb-4 p-3 border rounded"
                  >
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
                <Form.Group className="mb-2">
                  <Form.Label>Portfolio URL</Form.Label>
                  <Form.Control
                    type="url"
                    value={links.portfolio}
                    onChange={(e) =>
                      setLinks({ ...links, portfolio: e.target.value })
                    }
                    placeholder="https://yourportfolio.com"
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Twitter</Form.Label>
                  <Form.Control
                    type="url"
                    value={links.socialMedia.twitter}
                    onChange={(e) =>
                      setLinks({
                        ...links,
                        socialMedia: {
                          ...links.socialMedia,
                          twitter: e.target.value,
                        },
                      })
                    }
                    placeholder="https://twitter.com/yourhandle"
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>LinkedIn</Form.Label>
                  <Form.Control
                    type="url"
                    value={links.socialMedia.linkedin}
                    onChange={(e) =>
                      setLinks({
                        ...links,
                        socialMedia: {
                          ...links.socialMedia,
                          linkedin: e.target.value,
                        },
                      })
                    }
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Instagram</Form.Label>
                  <Form.Control
                    type="url"
                    value={links.socialMedia.instagram}
                    onChange={(e) =>
                      setLinks({
                        ...links,
                        socialMedia: {
                          ...links.socialMedia,
                          instagram: e.target.value,
                        },
                      })
                    }
                    placeholder="https://instagram.com/yourhandle"
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={links.email}
                    onChange={(e) =>
                      setLinks({ ...links, email: e.target.value })
                    }
                    placeholder="your@email.com"
                  />
                </Form.Group>

                <h4 className="mt-4">Contact Information</h4>
                <Form.Group className="mb-2">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={contact.address}
                    onChange={(e) =>
                      setContact({ ...contact, address: e.target.value })
                    }
                    placeholder="Your address"
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    value={contact.phone}
                    onChange={(e) =>
                      setContact({ ...contact, phone: e.target.value })
                    }
                    placeholder="Your phone number"
                  />
                </Form.Group>
              </>
            )}

            <Button type="submit" variant="primary" className="mt-4" size="lg">
              Save Profile Changes
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
