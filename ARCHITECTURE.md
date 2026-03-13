
Author

Rajat Pandey
---

# ARCHITECTURE.md

```markdown
# System Architecture

This document describes the architecture decisions behind the AI Journal application.

---

# Overview

The system consists of two main components:

1. Backend API
2. Frontend Client
React Frontend
|
| HTTP API
|
Node.js + Express Backend
|
| Database Queries
|
SQLite Database
|
| LLM Analysis
|
Gemini API


### Controllers
Handle business logic.

Example:
- create journal
- analyze journal
- fetch insights

### Routes
Define API endpoints and connect them to controllers.

### Services
Contain external integrations.

Example:
- Gemini LLM service

### Database Layer
SQLite is used for simplicity and local development.

Tables:
journal_entries
journal_analysis


---

# LLM Integration

Journal entries are analyzed using Gemini.

The analysis extracts:

- emotion
- keywords
- summary

To reduce LLM costs, the system implements **analysis caching**.

### Caching Strategy

Before calling the LLM:
check journal_analysis table


If analysis already exists:


return cached result


Otherwise:


call Gemini API
store result
return response


This prevents repeated LLM calls.

---

# Insights Engine

Insights are computed using SQL aggregation queries.

Examples:

### Total entries


COUNT(*)


### Most common emotion


GROUP BY emotion
ORDER BY count DESC


### Most used ambience


GROUP BY ambience


### Recent keywords

Recent keyword extraction from stored analysis.

---

# Database Design

### journal_entries


id
userId
ambience
text
createdAt


### journal_analysis


id
journalId
emotion
keywords
summary
createdAt


Relationships:


journal_entries 1 -> 1 journal_analysis


---

# Scaling Strategy (100k+ users)

SQLite works well for development but not for large-scale systems.

For production scaling:

### Database

Move to:


PostgreSQL


or


MongoDB


Use connection pooling.

---

### Backend Scaling

Use:


Docker containers
Kubernetes
Load balancer


Multiple backend instances can serve traffic.

---

### Queue-Based LLM Processing

For heavy loads:


Journal entry → Queue → Worker → LLM


Tools:

- Redis Queue
- RabbitMQ
- BullMQ

Workers process LLM analysis asynchronously.

---

# Reducing LLM Costs

Strategies:

1. Cache results (already implemented)
2. Batch journal analysis
3. Use smaller models
4. Limit token size
5. Run analysis asynchronously

---

# Security Considerations

To protect user data:

### Authentication

Use:


JWT
OAuth


### Data Protection

- Encrypt journal entries
- Use HTTPS
- Apply rate limiting

### API Protection

Add:


Helmet
Rate limiting
Input validation


---

# Observability

For production monitoring:

- Logging (Winston)
- Metrics (Prometheus)
- Error tracking (Sentry)

---

# Future Architecture Improvements

- Vector database for semantic journal search
- Emotion trend visualization
- AI journaling recommendations
- Serverless LLM workers
- Real-time insights dashboard

---

# Conclusion

The architecture prioritizes:

- modular backend structure
- cost-efficient LLM usage
- scalable API design
- simple developer experience