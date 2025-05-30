import { useState, useEffect, lazy, Suspense } from "react";
import axios from "../utils/axiosConfig";
import { Link } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Table,
  Spinner,
  Alert,
  Button,
  Form,
  InputGroup,
  Badge,
} from "react-bootstrap";
import { Funnel, Calendar, Search } from "react-bootstrap-icons";

// Lazy load chart for better performance
const LineChart = lazy(() => import("../components/LineChart"));

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({
    status: "active",
    dateRange: "7d",
    searchQuery: "",
  });

  // Sample chart data - replace with real API data
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Service Requests",
        data: [12, 19, 8, 15, 12, 10, 7],
        borderColor: "#8b9d77",
        tension: 0.1,
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(filters);
        const [metricsRes, requestsRes] = await Promise.all([
          axios.get(`/api/dashboard/metrics?${params}`),
          axios.get(`/api/requests?${params}`),
        ]);

        setMetrics(metricsRes.data);
        setRequests(requestsRes.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) return <Spinner animation="border" className="mt-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="dashboard-container p-4">
      {/* Filters Section */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="all">All</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Date Range</Form.Label>
                <Form.Select
                  value={filters.dateRange}
                  onChange={(e) =>
                    handleFilterChange("dateRange", e.target.value)
                  }
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <InputGroup>
                  <Form.Control
                    placeholder="Search requests..."
                    value={filters.searchQuery}
                    onChange={(e) =>
                      handleFilterChange("searchQuery", e.target.value)
                    }
                  />
                  <Button variant="outline-sage">
                    <Search />
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Metrics Overview */}
      <Row className="mb-4 g-4">
        <Col md={3}>
          <MetricCard
            title="Requests Today"
            value={metrics.requestsToday}
            trend="up"
            change="12%"
            icon={<Funnel className="text-blue-500" />}
          />
        </Col>
        <Col md={3}>
          <MetricCard
            title="Avg. Response"
            value={`${metrics.avgResponse}h`}
            trend="down"
            change="5%"
            icon={<Calendar className="text-green-500" />}
          />
        </Col>
        <Col md={3}>
          <MetricCard
            title="Completed Jobs"
            value={metrics.completedJobs}
            trend="up"
            change="18%"
            icon={<Badge bg="success">✓</Badge>}
          />
        </Col>
        <Col md={3}>
          <MetricCard
            title="Earnings (7d)"
            value={`₦${metrics.earnings.toLocaleString()}`}
            trend="up"
            change="22%"
            icon={<span className="text-yellow-500">💰</span>}
            chartData={chartData}
          />
        </Col>
      </Row>

      {/* Active Requests */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-sage text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Service Requests</h5>
          <Badge bg="light" text="dark">
            {requests.length} Active
          </Badge>
        </Card.Header>
        <Card.Body className="p-0">
          <Table striped hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Service</th>
                <th>Client</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((req) => (
                  <RequestRow key={req._id} request={req} />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No requests found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}

// Enhanced Metric Card Component
function MetricCard({ title, value, icon, trend, change, chartData }) {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h6 className="text-muted">{title}</h6>
            <h4>{value}</h4>
            <small className={trend === "up" ? "text-success" : "text-danger"}>
              {trend === "up" ? "↑" : "↓"} {change}
            </small>
          </div>
          <div>{icon}</div>
        </div>
        {chartData && (
          <div style={{ height: "150px" }}>
            <Suspense fallback={<Spinner animation="border" />}>
              <LineChart data={chartData} />
            </Suspense>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

// Enhanced Request Row Component
function RequestRow({ request }) {
  const statusVariant = {
    active: "warning",
    completed: "success",
    pending: "secondary",
  };

  return (
    <tr>
      <td>
        <strong>{request.category}</strong>
      </td>
      <td>{request.client?.name || "N/A"}</td>
      <td>{request.location || "Not specified"}</td>
      <td>
        <Badge bg={statusVariant[request.status]}>{request.status}</Badge>
      </td>
      <td>
        <Button
          variant="outline-sage"
          size="sm"
          as={Link}
          to={`/requests/${request._id}`}
        >
          View
        </Button>
      </td>
    </tr>
  );
}
