import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Image,
  Button,
  Spinner,
} from "react-bootstrap";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import ProfileHeader from "../components/profile/ProfileHeader";
import PortfolioSection from "../components/profile/PortfolioSection";
import LinksSection from "../components/profile/LinksSection";
import ContactSection from "../components/profile/ContactSection";
import "../components/profile/Profile.css";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});

function ProfessionalProfile() {
  const { id } = useParams();
  const [professional, setProfessional] = useState(null);
  const [error, setError] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view this profile");
          setLoading(false);
          return;
        }
        const res = await axios.get(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfessional(res.data);
        setIsOnline(res.data.isOnline);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load professional");
        setLoading(false);
      }
    };
    fetchProfessional();

    socket.on("statusUpdate", ({ userId, isOnline }) => {
      if (userId === id) setIsOnline(isOnline);
    });

    return () => socket.off("statusUpdate");
  }, [id]);

  const handleMessageClick = () => {
    navigate("/messages", {
      state: { recipientId: id, recipientName: professional.name },
    });
  };

  if (loading) return <Spinner animation="border" className="mt-5 mx-auto" />;

  if (!professional && error) return <Alert variant="danger">{error}</Alert>;

  if (!professional) return <div>Loading...</div>;

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
          <Button
            className="message-button w-100 mt-3"
            onClick={handleMessageClick}
          >
            Message {professional.name}
          </Button>
        </Col>
        <Col md={9}>
          <h2 className="profile-title">{professional.name}'s Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <ProfileHeader user={professional} />

          {professional.videoUrl && (
            <>
              <h3 className="section-title">Showcase Video</h3>
              <div className="video-section">
                <video controls className="w-full rounded-lg">
                  <source src={professional.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </>
          )}

          <PortfolioSection portfolio={professional.portfolio} />
          <LinksSection links={professional.links} />
          <ContactSection contact={professional.contact} />
        </Col>
      </Row>
    </Container>
  );
}

export default ProfessionalProfile;
