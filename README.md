# SAE Summary Tool

A full-stack application for parsing and summarizing clinical trial SAE (Serious Adverse Event) data. Built with Next.js (frontend) and Flask (backend).

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Bootstrap
- **Backend**: Flask, Python
- **Development**: ESLint, TypeScript

## Prerequisites

- Node.js (v18 or higher)
- Python 3.x
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install flask flask-cors python-dotenv
```

4. Run the backend server:
```bash
python app.py
```
The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```
The frontend will run on http://localhost:3000

## Project Structure

```
.
├── backend/
│   ├── venv/
│   └── app.py
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   └── ...
    └── package.json
```

## Development

- Backend API endpoints are prefixed with `/api`
- Frontend uses Bootstrap for styling
- TypeScript is used for type safety
- CORS is enabled for local development

## Assumptions

- The application assumes .docx files follow a standard clinical trial format
- SAE tables are consistently formatted within the documents
- Users have basic understanding of clinical trial terminology
- The application is primarily used in a development/testing environment
- Network connectivity is stable for API calls between frontend and backend

## Limitations

## Potential Improvements

### Frontend

### Backend

### DevOps


## License

MIT
