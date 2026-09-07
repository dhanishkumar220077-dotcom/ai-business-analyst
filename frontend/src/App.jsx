import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const chartData = data
    ? Object.entries(data.analysis.products).map(([product, revenue]) => ({
        product,
        revenue,
      }))
    : [];

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    const validTypes = [".csv", ".xlsx", ".xls"];

    const extension = selectedFile.name
      .toLowerCase()
      .slice(selectedFile.name.lastIndexOf("."));

    if (!validTypes.includes(extension)) {
      setError("Please upload a CSV or Excel file.");
      return;
    }

    setFile(selectedFile);
    setError("");
    setData(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const analyzeFile = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed.");
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setData(result);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the AI Analyst. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setData(null);
    setError("");
  };

  return (
    <div className="app">

      {/* Background effects */}
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="brand">

          <div className="brand-mark">
            <span>✦</span>
          </div>

          <div>
            <div className="brand-name">AURA</div>
            <div className="brand-subtitle">
              BUSINESS INTELLIGENCE
            </div>
          </div>

        </div>

        <div className="nav-status">
          <span className="status-dot"></span>
          AI ENGINE ONLINE
        </div>
      </nav>

      <main className="container">

        {/* ========================= */}
        {/* LANDING / UPLOAD SCREEN */}
        {/* ========================= */}

        {!data && (
          <section className="hero">

            <div className="eyebrow">
              <span>✦</span>
              AI-POWERED BUSINESS INTELLIGENCE
            </div>

            <h1>
              Turn your data into
              <span> decisions.</span>
            </h1>

            <p className="hero-description">
              Upload your business data and let AI uncover revenue
              opportunities, risks, product performance and your next
              best actions.
            </p>

            {/* Upload area */}
            <div
              className={`upload-zone ${
                dragging ? "dragging" : ""
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >

              <div className="upload-icon">
                ↑
              </div>

              <h2>
                {file
                  ? file.name
                  : "Drop your business data here"}
              </h2>

              <p>
                {file
                  ? "Your file is ready for analysis"
                  : "CSV or Excel files · Maximum clarity, zero guesswork"}
              </p>

              <label className="choose-file">

                {file
                  ? "Choose another file"
                  : "Browse files"}

                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) =>
                    handleFile(e.target.files[0])
                  }
                  hidden
                />

              </label>

              {file && (
                <div className="file-ready">
                  <span>✓</span>
                  {file.name}
                </div>
              )}

            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              className="analyze-button"
              onClick={analyzeFile}
              disabled={!file || loading}
            >

              {loading ? (
                <>
                  <span className="spinner"></span>
                  ANALYZING DATA...
                </>
              ) : (
                <>
                  ANALYZE MY BUSINESS
                  <span>→</span>
                </>
              )}

            </button>

            <div className="trust-row">
              <span>✓ Automated analysis</span>
              <span>✓ AI recommendations</span>
              <span>✓ Private processing</span>
            </div>

          </section>
        )}

        {/* ========================= */}
        {/* DASHBOARD */}
        {/* ========================= */}

        {data && (
          <section className="dashboard">

            {/* Dashboard header */}
            <div className="dashboard-header">

              <div>

                <div className="eyebrow">
                  <span>✦</span>
                  BUSINESS INTELLIGENCE REPORT
                </div>

                <h1>
                  Executive Overview
                </h1>

                <p>
                  AI analysis generated from{" "}
                  <strong>{data.filename}</strong>
                </p>

              </div>

              <button
                className="new-analysis"
                onClick={resetAnalysis}
              >
                + NEW ANALYSIS
              </button>

            </div>

            {/* ========================= */}
            {/* KPI CARDS */}
            {/* ========================= */}

            <div className="kpi-grid">

              <div className="kpi-card featured">

                <div className="kpi-label">
                  TOTAL REVENUE
                </div>

                <div className="kpi-value">
                  ₹
                  {Number(
                    data.analysis.total_revenue
                  ).toLocaleString()}
                </div>

                <div className="kpi-meta">
                  <span className="positive">
                    ●
                  </span>
                  Revenue generated
                </div>

              </div>

              <div className="kpi-card">

                <div className="kpi-label">
                  TOTAL ORDERS
                </div>

                <div className="kpi-value">
                  {data.analysis.total_orders}
                </div>

                <div className="kpi-meta">
                  Completed records
                </div>

              </div>

              <div className="kpi-card">

                <div className="kpi-label">
                  ITEMS SOLD
                </div>

                <div className="kpi-value">
                  {data.analysis.total_items_sold}
                </div>

                <div className="kpi-meta">
                  Units sold
                </div>

              </div>

              <div className="kpi-card">

                <div className="kpi-label">
                  AVERAGE ORDER
                </div>

                <div className="kpi-value">
                  ₹
                  {Number(
                    data.analysis.average_order_value
                  ).toLocaleString()}
                </div>

                <div className="kpi-meta">
                  Revenue per order
                </div>

              </div>

            </div>

            {/* ========================= */}
            {/* INTELLIGENCE GRID */}
            {/* ========================= */}

            <div className="intelligence-grid">

              {/* AI ANALYSIS */}
              <div className="ai-panel">

                <div className="panel-header">

                  <div>

                    <div className="panel-kicker">
                      <span>✦</span>
                      AI ANALYST
                    </div>

                    <h2>
                      What the data is telling you
                    </h2>

                  </div>

                  <div className="ai-badge">
                    AI
                  </div>

                </div>

                <div className="insight-list">

                  {/* Key Insight */}
                  <div className="insight-item">

                    <div className="insight-number">
                      01
                    </div>

                    <div>

                      <div className="insight-title">
                        KEY INSIGHT
                      </div>

                      <p>
                        {data.ai_insights.key_insight}
                      </p>

                    </div>

                  </div>

                  {/* Opportunity */}
                  <div className="insight-item">

                    <div className="insight-number">
                      02
                    </div>

                    <div>

                      <div className="insight-title">
                        BIGGEST OPPORTUNITY
                      </div>

                      <p>
                        {data.ai_insights.biggest_opportunity}
                      </p>

                    </div>

                  </div>

                  {/* Problem */}
                  <div className="insight-item warning">

                    <div className="insight-number">
                      03
                    </div>

                    <div>

                      <div className="insight-title">
                        POTENTIAL PROBLEM
                      </div>

                      <p>
                        {data.ai_insights.potential_problem}
                      </p>

                    </div>

                  </div>

                  {/* Action */}
                  <div className="insight-item action">

                    <div className="insight-number">
                      04
                    </div>

                    <div>

                      <div className="insight-title">
                        RECOMMENDED ACTION
                      </div>

                      <p>
                        {data.ai_insights.recommended_action}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* ========================= */}
              {/* PRODUCT CHART */}
              {/* ========================= */}

              <div className="products-panel">

                <div className="panel-header">

                  <div>

                    <div className="panel-kicker">
                      PRODUCT PERFORMANCE
                    </div>

                    <h2>
                      Revenue by product
                    </h2>

                  </div>

                </div>

                <div className="chart-container">

                  <ResponsiveContainer
                    width="100%"
                    height={280}
                  >

                    <BarChart
                      data={chartData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 5,
                      }}
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.06)"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="product"
                        tick={{
                          fill: "#7f89a0",
                          fontSize: 10,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{
                          fill: "#7f89a0",
                          fontSize: 10,
                        }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) =>
                          `₹${value}`
                        }
                      />

                      <Tooltip
                        cursor={{
                          fill: "rgba(100,114,255,0.08)",
                        }}
                        contentStyle={{
                          background: "#111520",
                          border: "1px solid #343b55",
                          borderRadius: "10px",
                          color: "#ffffff",
                        }}
                        formatter={(value) => [
                          `₹${Number(
                            value
                          ).toLocaleString()}`,
                          "Revenue",
                        ]}
                      />

                      <Bar
                        dataKey="revenue"
                        fill="#6875ff"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={55}
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

                {/* Product summary */}
                <div className="performance-footer">

                  <div>

                    <span>
                      TOP PERFORMER
                    </span>

                    <strong>
                      {data.analysis.best_product}
                    </strong>

                  </div>

                  <div>

                    <span>
                      NEEDS ATTENTION
                    </span>

                    <strong>
                      {data.analysis.worst_product}
                    </strong>

                  </div>

                </div>

              </div>

            </div>

          </section>
        )}

      </main>

      {/* Footer */}
      <footer>

        <span>
          AURA AI
        </span>

        <span>
          Business Intelligence Platform
        </span>

        <span>
          v1.0
        </span>

      </footer>

    </div>
  );
}

export default App;