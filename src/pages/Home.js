import {
  Container,
  Row,
  Col,
  Button,
  Carousel,
  Form,
  InputGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { Twitter, Facebook, Instagram, Search } from "react-bootstrap-icons";
import { useState } from "react";

const services = [
  { name: "Plumbing", img: "/images/Plumber.jpg" },
  { name: "Tutoring", img: "/images/Tutor.jpg" },
  { name: "Cleaning", img: "/images/Cleaning.jpg" },
  { name: "Electrical", img: "/images/Electrician.jpg" },
  { name: "Haircut", img: "/images/haircut.jpg" },
  { name: "Photography", img: "/images/Photographer.jpg" },
  { name: "Carpentry", img: "/images/Carpentry.jpg" },
  { name: "Catering", img: "/images/Catering.jpg" },
  { name: "Fashion Designers", img: "/images/Designers.jpg" },
  { name: "Gardeners", img: "/images/Gardeners.jpg" },
  { name: "Logistics & Moving", img: "/images/Moving.jpg" },
  { name: "Personal Trainers", img: "/images/Trainer.jpg" },
];

const quickServicesRow1 = [
  "Plumbing",
  "Cleaning",
  "Electrical",
  "Carpentry",
  "Moving",
  "Painting",
];

const quickServicesRow2 = ["Photography", "Tutoring", "Catering", "Others"];

const featuredProfessionals = [
  { name: "Tunde Electric", rating: 4.9, jobs: 127, service: "Electrical" },
  { name: "Mama Clean", rating: 4.8, jobs: 94, service: "Cleaning" },
  { name: "Photo by Femi Sasa", rating: 5.0, jobs: 63, service: "Photography" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen">
      {/* Hero Jumbotron with Background Image */}
      <div
        className="relative flex items-center justify-center text-center text-white py-20 md:py-32"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "50vh",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <Container className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow">
            Welcome to FidelBridge
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-shadow">
            Bridging The Trust Gap
          </p>
          <Button
            as={Link}
            to="/request"
            className="bg-#a881af hover:bg-#f4f6f9 px-7 py-2 text-lg"
            size="lg"
          >
            Get Started
          </Button>
        </Container>
      </div>

      {/* Services Carousel */}
      <Container className="py-8">
        <Carousel indicators={false} interval={6000}>
          {[...Array(Math.ceil(services.length / 3))].map((_, i) => (
            <Carousel.Item key={i}>
              <Row className="g-4">
                {services.slice(i * 3, i * 3 + 3).map((service, idx) => (
                  <Col key={idx} md={4}>
                    <ServiceCard service={service} />
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>

      {/* Search Bar */}
      <Container className="mb-6">
        <InputGroup className="shadow-lg">
          <Form.Control
            type="search"
            placeholder="Find Service"
            className="py-3 border-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="primary"
            className="px-6 text-white"
            style={{ backgroundColor: "#2c5282" }}
          >
            <Search size={20} className="mr-2" />
            Search
          </Button>
        </InputGroup>
      </Container>

      {/* Service Tiles */}
      <Container className="mb-8">
        <Row className="g-2 mb-3 justify-content-center">
          {quickServicesRow1.map((service, i) => (
            <Col key={i} xs={4} sm={2}>
              <Button
                variant="primary"
                className="w-full py-2 text-sm"
                style={{
                  backgroundColor: "#4299e1",
                  borderColor: "#2b6cb0",
                }}
                as={Link}
                to={`/search?q=${service}`}
              >
                {service}
              </Button>
            </Col>
          ))}
        </Row>
        <Row className="g-2 justify-content-center">
          {quickServicesRow2.map((service, i) => (
            <Col key={i} xs={3} sm={2}>
              <Button
                variant={service === "Others" ? "dark" : "primary"}
                className="w-full py-2 text-sm"
                style={{
                  backgroundColor: service === "Others" ? "#4a5568" : "#4299e1",
                  borderColor: service === "Others" ? "#2d3748" : "#2b6cb0",
                }}
                as={Link}
                to={service === "Others" ? "/services" : `/search?q=${service}`}
              >
                {service}
              </Button>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Trust Indicators */}
      <div className="bg-softGray py-8">
        <Container>
          <Row className="g-4 text-center">
            <Col md={4}>
              <div className="text-3xl font-bold text-sage">10,000+</div>
              <div className="text-lg">Verified Professionals</div>
            </Col>
            <Col md={4}>
              <div className="text-3xl font-bold text-sage">4.8★</div>
              <div className="text-lg">Average Rating</div>
            </Col>
            <Col md={4}>
              <div className="text-3xl font-bold text-sage">24h</div>
              <div className="text-lg">Average Response Time</div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Featured Professionals */}
      <Container className="py-8">
        <h2 className="text-2xl font-bold mb-4">Featured Professionals</h2>
        <Row className="g-4">
          {featuredProfessionals.map((pro, i) => (
            <Col key={i} md={4}>
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-sage rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {pro.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold">{pro.name}</div>
                    <div className="text-sm text-gray-600">{pro.service}</div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{pro.rating}</span>
                    <span className="text-gray-500 ml-2">
                      ({pro.jobs}+ jobs)
                    </span>
                  </div>
                  <Button
                    variant="outline-sage"
                    size="sm"
                    as={Link}
                    to={`/professionals/${pro.name
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Testimonials */}
      <div className="bg-cream py-8">
        <Container>
          <h2 className="text-2xl font-bold mb-6 text-center">
            What Our Customers Say
          </h2>
          <Row>
            <Col md={4} className="mb-4">
              <TestimonialCard
                text="Found an excellent plumber within minutes of posting my request."
                author="Adeola, Lagos"
                rating={5}
              />
            </Col>
            <Col md={4} className="mb-4">
              <TestimonialCard
                text="The electrician was professional and fixed my issue at a fair price."
                author="Chinedu, Abuja"
                rating={4}
              />
            </Col>
            <Col md={4}>
              <TestimonialCard
                text="ServiceHub saved me so much time finding a reliable cleaner."
                author="Bisi, Ibadan"
                rating={5}
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* CTA Section */}
      <div className="py-12 bg-sage text-white text-center">
        <Container>
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <Button
            as={Link}
            to="/register"
            className="bg-skyblue text-sage hover:bg-gray-100 px-8 py-3 text-lg"
            size="lg"
          >
            Sign Up Now
          </Button>
        </Container>
      </div>

      {/* Footer */}
      <footer className="bg-sageDark text-white py-6">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="mb-4 md:mb-0">
              <div className="text-xl font-bold mb-2">FidelBridge</div>
              <div className="text-sm">
                Nigeria's trusted service marketplace
              </div>
            </Col>
            <Col md={6} className="text-md-end">
              <div className="flex justify-center md:justify-end space-x-4 mb-3">
                <Button variant="link" className="text-white p-0">
                  <Twitter size={18} />
                </Button>
                <Button variant="link" className="text-white p-0">
                  <Facebook size={18} />
                </Button>
                <Button variant="link" className="text-white p-0">
                  <Instagram size={18} />
                </Button>
              </div>
              <div className="text-sm">
                © {new Date().getFullYear()} FidelBridge. All rights reserved.
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}

// Service Card Component
function ServiceCard({ service }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform hover:-translate-y-1 h-full">
      <img
        src={service.img}
        alt={service.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
        <Button
          as={Link}
          to={`/request?service=${service.name}`}
          className="w-full bg-sage hover:bg-sageDark text-white"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}

// Testimonial Card Component
function TestimonialCard({ text, author, rating }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-lg ${
              i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
      <p className="italic mb-4">"{text}"</p>
      <p className="font-semibold text-sage">{author}</p>
    </div>
  );
}
