import { Alert } from "react-bootstrap";

const AlertMessage = ({ variant, message, onClose }) => {
  return (
    <Alert variant={variant} onClose={onClose} dismissible>
      {message}
    </Alert>
  );
};

export default AlertMessage;
