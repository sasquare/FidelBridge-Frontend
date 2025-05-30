import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "../utils/axiosConfig";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  ListGroup,
  Alert,
} from "react-bootstrap";
import Message from "../components/Message";
import "../components/profile/Profile.css";

function Messages() {
  const location = useLocation();
  const { recipientId, recipientName } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!recipientId) {
      setError(
        "No recipient selected. Please select a professional to message."
      );
      setLoading(false);
      return;
    }
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view messages");
          setLoading(false);
          return;
        }
        const res = await axios.get(`/api/messages/${recipientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load messages");
        setLoading(false);
      }
    };
    fetchMessages();
  }, [recipientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to send messages");
        return;
      }
      const res = await axios.post(
        "/api/messages",
        { recipientId, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([...messages, res.data.data]);
      setContent("");
      setSuccess("Message sent successfully");
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send message");
      setSuccess("");
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error && !recipientId) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-5">
      <h2 className="profile-title">Messages with {recipientName || "User"}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Row>
        <Col md={8}>
          <ListGroup>
            {messages.map((msg) => (
              <ListGroup.Item
                key={msg._id}
                className={msg.senderId._id === recipientId ? "text-right" : ""}
              >
                <Message
                  sender={msg.senderId.name}
                  recipient={msg.recipientId.name}
                  content={msg.content}
                  timestamp={msg.createdAt}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Form onSubmit={handleSubmit} className="mt-3">
            <Form.Group controlId="content">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your message..."
                required
              />
            </Form.Group>
            <Button type="submit" className="mt-2">
              Send
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Messages;
