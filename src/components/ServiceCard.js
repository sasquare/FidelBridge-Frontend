import { useState } from "react";

function ServiceCard({ service }) {
  const [imgError, setImgError] = useState(false);

  const handleError = () => setImgError(true);

  return (
    <div className="service-card border rounded p-4 shadow hover:shadow-lg transition duration-300">
      {service.imageUrl && !imgError ? (
        <img
          src={service.imageUrl}
          alt={service.name}
          onError={handleError}
          className="w-full h-40 object-cover mb-3 rounded"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center mb-3 rounded">
          <span className="text-gray-500">Image not available</span>
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
      <p className="text-gray-700 mb-4">{service.description}</p>
      <button className="bg-sage text-white px-4 py-2 rounded hover:bg-sageDark transition duration-200">
        Explore
      </button>
    </div>
  );
}

export default ServiceCard;
