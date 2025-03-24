# Google Keep Clone

A **Google Keep Clone** built with **React** for the frontend and **Flask** for the backend. This application allows users to create, update, delete, archive, and manage notes, including a trash feature for soft-deleted notes.

## Features

- **Create Notes**: Add new notes with titles and content.
- **Update Notes**: Edit existing notes.
- **Delete Notes**: Soft-delete notes by moving them to the trash.
- **Trash Management**: Restore notes from the trash or permanently delete them.
- **Archive Notes**: Archive notes to keep them separate from active notes.
- **Pin Notes**: Pin important notes to the top of the list.
- **Responsive Design**: Works seamlessly across devices.
- **Backend Integration**: Notes are stored and managed in a database using a Flask backend.

---

## Technologies Used

### Frontend
- **React**: For building the user interface.
- **React Router**: For navigation and routing.
- **Axios**: For making API requests.
- **Tailwind CSS**: For styling the application.

### Backend
- **Flask**: For building the REST API.
- **Flask-JWT-Extended**: For user authentication.
- **Flask-CORS**: For handling cross-origin requests.
- **SQLAlchemy**: For database management.
- **SQLite**: As the database.

---

## Installation and Setup

### Prerequisites
- **Node.js** and **npm** installed on your system.
- **Python 3.8+** installed on your system.
- **Git** installed on your system.

### Clone the Repository
```bash
git clone https://github.com/your-username/google-keep-clone.git
cd google-keep-clone
```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Google-keep-backend
   ```

2. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up the database:
   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

5. Run the backend server:
   ```bash
   flask run
   ```

   The backend will be available at `http://127.0.0.1:5000`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd GoogleKeep/google-keep
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`.

---

## Project Structure

### Frontend
```
GoogleKeep/google-keep/
├── src/
│   ├── components/       # Reusable UI components
│   ├── context/          # Context API for state management
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components (e.g., NotesPage, BinPage)
│   ├── services/         # API service for backend communication
│   ├── App.jsx           # Main application component
│   └── index.js          # Entry point
```

### Backend
```
Google-keep-backend/
├── app/
│   ├── __init__.py       # Flask app factory
│   ├── models.py         # Database models
│   ├── auth/             # Authentication routes
│   ├── notes/            # Notes-related routes
│   └── migrations/       # Database migrations
├── main.py               # Entry point for the backend
└── requirements.txt      # Backend dependencies
```

---

## API Endpoints

### Authentication
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Log in a user.

### Notes
- **GET** `/api/notes`: Fetch all notes (supports filters for `is_archived` and `is_trashed`).
- **POST** `/api/notes`: Create a new note.
- **PUT** `/api/notes/<id>`: Update an existing note.
- **PUT** `/api/notes/<id>/trash`: Move a note to the trash.
- **PUT** `/api/notes/<id>/archive`: Toggle archive status of a note.
- **DELETE** `/api/notes/<id>`: Permanently delete a note.

---

## Usage

1. **Create Notes**:
   - Use the "Add Note" button to create a new note.
2. **Manage Notes**:
   - Pin, archive, or delete notes using the action buttons on each note.
3. **Trash**:
   - View trashed notes in the "Bin" section. Restore or permanently delete notes from the trash.
4. **Archive**:
   - View archived notes in the "Archive" section.

---

## Screenshots

### Notes Page
![Notes Page](https://via.placeholder.com/800x400?text=Notes+Page)

### Bin Page
![Bin Page](https://via.placeholder.com/800x400?text=Bin+Page)

### Archive Page
![Archive Page](https://via.placeholder.com/800x400?text=Archive+Page)

---

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Acknowledgments

- Inspired by Google Keep.
- Built with ❤️ using React and Flask.

---

This README.md file provides a comprehensive overview of your project, including setup instructions, features, and usage. You can customize it further based on your specific requirements.

