import { useState } from "react";
import { Card, Image, Form, Button, Alert } from "react-bootstrap";
import axios from "../../utils/axiosConfig";
import ReactStars from "react-rating-stars-component";

function ProfileHeader({ user, onPictureUpdate }) {
  const [picture, setPicture] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePictureUpload = async () => {
    if (!picture) return;
    const formData = new FormData();
    formData.append("picture", picture);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated");
        setSuccess("");
        return;
      }

      const res = await axios.post("/api/users/upload-picture", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess(res.data.message || "Picture uploaded successfully");
      setError("");
      setPicture(null);
      if (res.data.pictureUrl) {
        onPictureUpdate(res.data.pictureUrl);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload picture");
      setSuccess("");
      console.error("Upload error:", err);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex align-items-center">
          <Image
            src={user?.picture || "https://via.placeholder.com/150"}
            roundedCircle
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
          <div className="ms-3">
            <h3>{user?.name || "No Name"}</h3>
            <p>{user?.headline || "No tagline"}</p>
            {user?.averageRating && (
              <ReactStars
                count={5}
                value={user.averageRating}
                size={24}
                activeColor="#ffd700"
                edit={false}
              />
            )}
          </div>
        </div>
        {user?.role === "professional" && (
          <div className="mt-3">
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form.Group controlId="picture">
              <Form.Label>Update Profile Picture</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setPicture(e.target.files[0])}
              />
              <Button
                variant="primary"
                className="mt-2"
                onClick={handlePictureUpload}
                disabled={!picture}
              >
                Upload Picture
              </Button>
            </Form.Group>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default ProfileHeader;
