function ServiceCard({ service }) {
  return (
    <div className="service-card">
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      <button>Explore</button>
    </div>
  );
}

export default ServiceCard;
