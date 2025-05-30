import { Card } from "react-bootstrap";

function Message({ sender, recipient, content, timestamp }) {
  return (
    <Card className="mb-2">
      <Card.Body>
        <Card.Text>
          <strong>
            From {sender} to {recipient}:
          </strong>{" "}
          {content}
        </Card.Text>
        <Card.Text>
          <small>{new Date(timestamp).toLocaleString()}</small>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Message;
