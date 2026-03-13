import { useState } from "react";
import axios from "axios";
import "./App.css";

const API = "/api/journal";

function App() {
  const [userId, setUserId] = useState("user1");
  const [ambience, setAmbience] = useState("rain");
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);
  const [insights, setInsights] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateEntry = async (e) => {
    e.preventDefault();

    if (!userId || !text) {
      alert("userId and text are required");
      return;
    }

    try {
      setLoading(true);

      await axios.post(API, {
        userId,
        ambience,
        text
      });

      setText("");
      await fetchEntries();
      await fetchInsights();
    } catch (error) {
      console.error("Create entry error:", error);
      alert(error.response?.data?.error || "Failed to create entry");
    } finally {
      setLoading(false);
    }
  };

  const fetchEntries = async () => {
    if (!userId) {
      alert("Enter userId first");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${API}/${userId}`);
      setEntries(res.data);
    } catch (error) {
      console.error("Fetch entries error:", error);
      alert(error.response?.data?.error || "Failed to fetch entries");
    } finally {
      setLoading(false);
    }
  };

  const analyzeEntry = async (journalId) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API}/analyze`, { journalId });
      setSelectedAnalysis(res.data);
      await fetchInsights();
    } catch (error) {
      console.error("Analyze entry error:", error);
      alert(error.response?.data?.error || "Failed to analyze entry");
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(`${API}/insights/${userId}`);
      setInsights(res.data);
    } catch (error) {
      console.error("Fetch insights error:", error);
      alert(error.response?.data?.error || "Failed to fetch insights");
    }
  };

  return (
    <div className="container">
      <h1>Journal App</h1>
      <p className="subtitle">Full-Stack Assignment Demo</p>

      <section className="card">
        <h2>Create Journal Entry</h2>
        <form onSubmit={handleCreateEntry} className="form">
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />

          <select value={ambience} onChange={(e) => setAmbience(e.target.value)}>
            <option value="rain">Rain</option>
            <option value="forest">Forest</option>
            <option value="ocean">Ocean</option>
            <option value="cafe">Cafe</option>
            <option value="night">Night</option>
          </select>

          <textarea
            placeholder="Write your journal entry..."
            rows="5"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Entry"}
          </button>
        </form>
      </section>

      <section className="card">
        <div className="section-header">
          <h2>Entries</h2>
          <button onClick={fetchEntries} disabled={loading}>
            Load Entries
          </button>
        </div>

        {entries.length === 0 ? (
          <p>No entries found.</p>
        ) : (
          <div className="entry-list">
            {entries.map((entry) => (
              <div key={entry.id} className="entry-item">
                <p><strong>ID:</strong> {entry.id}</p>
                <p><strong>User:</strong> {entry.userId}</p>
                <p><strong>Ambience:</strong> {entry.ambience || "N/A"}</p>
                <p><strong>Text:</strong> {entry.text}</p>
                <p><strong>Created:</strong> {entry.createdAt}</p>

                <button onClick={() => analyzeEntry(entry.id)} disabled={loading}>
                  Analyze
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <div className="section-header">
          <h2>Latest Analysis</h2>
        </div>

        {!selectedAnalysis ? (
          <p>No analysis yet.</p>
        ) : (
          <div className="analysis-box">
            <p><strong>Journal ID:</strong> {selectedAnalysis.journalId}</p>
            <p><strong>Emotion:</strong> {selectedAnalysis.emotion}</p>
            <p>
              <strong>Keywords:</strong>{" "}
              {selectedAnalysis.keywords?.join(", ") || "None"}
            </p>
            <p><strong>Summary:</strong> {selectedAnalysis.summary}</p>
            <p><strong>Cached:</strong> {selectedAnalysis.cached ? "Yes" : "No"}</p>
          </div>
        )}
      </section>

      <section className="card">
        <div className="section-header">
          <h2>Insights</h2>
          <button onClick={fetchInsights} disabled={loading}>
            Load Insights
          </button>
        </div>

        {!insights ? (
          <p>No insights available.</p>
        ) : (
          <div className="insights-box">
            <p><strong>Total Entries:</strong> {insights.totalEntries}</p>
            <p><strong>Top Emotion:</strong> {insights.topEmotion || "N/A"}</p>
            <p>
              <strong>Most Used Ambience:</strong>{" "}
              {insights.mostUsedAmbience || "N/A"}
            </p>
            <p>
              <strong>Recent Keywords:</strong>{" "}
              {insights.recentKeywords?.length
                ? insights.recentKeywords.join(", ")
                : "None"}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;