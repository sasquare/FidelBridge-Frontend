import { useState } from "react";
import { Image, Form, Button } from "react-bootstrap";
import axios from "../../utils/axiosConfig";
import { Row, Col } from "react-bootstrap";

const ProfileHeader = ({ user, onPictureUpdate }) => {
  const [picture, setPicture] = useState(null);

  const handlePictureUpload = async (e) => {
    e.preventDefault();
    if (!picture) return;

    const formData = new FormData();
    formData.append("picture", picture);

    try {
      const res = await axios.post("/api/users/upload-picture", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onPictureUpdate(res.data.picture);
      setPicture(null);
      document.getElementById("pictureInput").value = "";
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <Row className="profile-header">
      <Col md={4} className="text-center">
        <Image
          src={user.picture || "/default-profile.png"}
          roundedCircle
          className="profile-img"
          alt="Profile"
          onError={(e) => {
            e.target.src = "/default-profile.png";
          }}
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
  );
};

export default ProfileHeader;
