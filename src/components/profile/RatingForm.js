import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";
import axios from "../../utils/axiosConfig";
import AlertMessage from "./AlertMessage"; // Adjust the path if needed

const RatingForm = ({ userId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleRating = async (e) => {
    e.preventDefault();
    if (!rating || !userId) {
      setError("Please select a rating");
      return;
    }

    try {
      await axios.post(
        `/api/users/rate/${userId}`,
        { score: rating, comment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSuccess("Thank you for your rating!");
      setRating(0);
      setComment("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit rating");
    }
  };

  return (
    <Form onSubmit={handleRating} className="rating-form mt-4">
      <h3 className="section-title">Rate Professional</h3>
      {error && <AlertMessage variant="danger" message={error} />}
      {success && <AlertMessage variant="success" message={success} />}
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
  );
};

export default RatingForm;
