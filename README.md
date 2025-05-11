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
pip install flask flask-cors python-dotenv python-docx
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
│   ├── utils/
│   │   └── sae_parser.py
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

- The application assumes .docx files follow a standard clinical trial format with SAE tables.
- SAE tables are consistently formatted and contain "Preferred Term", "Placebo", and "Compound X" columns.
- Only one summary is stored in memory at a time (last uploaded file).
- Uploaded files are to be processed in-memory and not saved to disk.
- The application is primarily used in a development/testing environment.
- Network connectivity is stable for API calls between frontend and backend.


## Limitations

- No user authentication system implemented.
- Limited error handling for malformed .docx files or unexpected table formats.
- No data persistence (results are not stored beyond the last upload).
- No support for batch processing of multiple files at once.
- Limited validation of input data.
- No support for different document formats (PDF, etc.).
- No automated testing suite.
- No production deployment configuration.
- Downloaded summary is always for the last uploaded file only.
- Large numbers of results may impact frontend performance, though batch rendering is implemented.

## Potential Improvements

### Frontend
- Add file upload progress indicator.
- Implement error boundary components in frontend.
- Add unit and integration tests.
- Implement proper form validation.
- Add pagination or infinite scroll for very large result sets.
- Add dark mode support.


### Backend
- Add proper logging system.
- Implement rate limiting.
- Add input validation middleware.
- Implement caching for processed documents.
- Add database integration for storing results.
- Implement user authentication.
- Implement batch processing capabilities.
- Add comprehensive API documentation.
- Implement automated testing.

### DevOps/Production
- Add Docker configuration.
- Set up CI/CD pipeline.
- Implement monitoring and error tracking.
- Add automated deployment scripts.
- Set up staging environment.

## License

MIT
