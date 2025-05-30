const StatusBox = ({ isOnline }) => {
  return (
    <div className="status-box">
      <h4>Status</h4>
      <div className={`status-indicator ${isOnline ? "online" : "offline"}`}>
        {isOnline ? "Online" : "Offline"}
      </div>
    </div>
  );
};

export default StatusBox;
