# BCG Knowledge Search Tool

## Overview

The BCG Knowledge Search Tool is a powerful, web-based application designed to streamline access to BCG's internal knowledge base. It combines a robust backend API with a user-friendly frontend interface, providing authorized users with quick and efficient search capabilities across BCG's vast repository of information.

## Key Features

- **Secure Authentication**: Utilizes Firebase for robust, email-domain restricted user authentication.
- **Advanced Search**: Enables users to search using keywords and apply various filters for precise results.
- **Responsive Design**: Ensures a seamless experience across desktop and mobile devices.
- **Scalable Architecture**: Built with FastAPI and React for high performance and easy scalability.

## Roadmap

### Short-term Goals
- Deploy a build version of the application to GCP or internal servers after discussing with the team.
- Implement more granular search filters (e.g., by category, column, etc.)
- Add simple LLM answering capabilities

### Long-term Vision
- Integration of LLM agents (Considering the team's needs, which is the LLM needs to read multiple webpages and summarize them/scrape/categorize them, this isthe way to go)
- Add new route for the user to easily add more data to the database

## Technical Architecture

### Backend
- **Framework**: FastAPI
- **Database**: Database.csv handed from BCG internal team
- **Key Libraries**: Listed in `requirements.txt`

### Frontend
- **Framework**: React
- **Authentication**: Firebase
- **State Management**: React Hooks
- **Styling**: Tailwind CSS

## Installation and Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- Docker (for containerized deployment)

### Local Development Setup

1. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Development Domain Setup** (Optional):
   ```bash
   ngrok http 3000
   ```
   Add the ngrok-provided URL to Firebase authorized domains for testing.

### Docker Deployment

Build and run the Docker image:
```bash
docker build -t bcg-knowledge-search-tool .
docker run -p 8000:8000 -p 3000:3000 bcg-knowledge-search-tool
```

## Usage Guide

1. Access the application through the provided URL.
2. Log in using your @infomineo.com email address.
3. Use the search bar to enter keywords.
4. Apply filters as needed to refine your search.
5. Click on search results to view detailed information.
