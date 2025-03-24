from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Note
from datetime import datetime, timedelta
from sqlalchemy import and_

notes = Blueprint('notes', __name__)

@notes.route('/api/notes', methods=['GET'])
@jwt_required()
def get_notes():
    user_id = get_jwt_identity()
    
    # Get query parameters for filtering
    is_archived = request.args.get('archived', 'false').lower() == 'true'
    is_trashed = request.args.get('trashed', 'false').lower() == 'true'
    
    # Query notes based on user_id, archived status, and trashed status
    query = Note.query.filter_by(user_id=user_id)
    
    if is_trashed:
        # Show only trashed notes
        query = query.filter(Note.is_trashed == True)
    else:
        # In non-trash views, never show trashed notes
        query = query.filter(Note.is_trashed == False)
        
        if is_archived:
            # In archive view, show only archived notes
            query = query.filter(Note.is_archived == True)
        else:
            # In main view, show only non-archived notes
            query = query.filter(Note.is_archived == False)
    
    # Order by pinned status (except in trash) and then by updated time
    if not is_trashed:
        query = query.order_by(Note.is_pinned.desc(), Note.updated_at.desc())
    else:
        query = query.order_by(Note.trashed_at.desc())
    
    notes = query.all()
    
    return jsonify([note.to_dict() for note in notes]), 200

@notes.route('/api/notes', methods=['POST'])
@jwt_required()
def create_note():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate data
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Create new note
    new_note = Note(
        title=data.get('title', ''),
        content=data.get('content', ''),
        color=data.get('color', 'white'),
        is_pinned=data.get('is_pinned', False),
        is_archived=data.get('is_archived', False),
        is_trashed=data.get('is_trashed', False),
        user_id=user_id
    )
    
    db.session.add(new_note)
    db.session.commit()
    
    return jsonify(new_note.to_dict()), 201

@notes.route('/api/notes/<int:note_id>', methods=['GET'])
@jwt_required()
def get_note(note_id):
    user_id = get_jwt_identity()
    note = Note.query.filter_by(id=note_id, user_id=user_id).first()
    
    if not note:
        return jsonify({"error": "Note not found"}), 404
    
    return jsonify(note.to_dict()), 200

@notes.route('/api/notes/<int:note_id>', methods=['PUT'])
@jwt_required()
def update_note(note_id):
    user_id = get_jwt_identity()
    note = Note.query.filter_by(id=note_id, user_id=user_id).first()
    
    if not note:
        return jsonify({"error": "Note not found"}), 404
    
    data = request.get_json()
    
    # Update note fields if provided
    if 'title' in data:
        note.title = data['title']
    if 'content' in data:
        note.content = data['content']
    if 'color' in data:
        note.color = data['color']
    if 'is_pinned' in data:
        note.is_pinned = data['is_pinned']
    if 'is_archived' in data:
        note.is_archived = data['is_archived']
    if 'is_trashed' in data:
        note.is_trashed = data['is_trashed']
        if data['is_trashed']:
            note.trashed_at = datetime.utcnow()
        else:
            note.trashed_at = None
    
    note.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify(note.to_dict()), 200

@notes.route('/api/notes/<int:note_id>', methods=['DELETE'])
@jwt_required()
def delete_note(note_id):
    user_id = get_jwt_identity()
    note = Note.query.filter_by(id=note_id, user_id=user_id).first()
    
    if not note:
        return jsonify({"error": "Note not found"}), 404
    
    # Instead of deleting, move it to the trash
    note.is_trashed = True
    note.trashed_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({"message": "Note moved to trash"}), 200
# def delete_note(note_id):
#     user_id = get_jwt_identity()
#     note = Note.query.filter_by(id=note_id, user_id=user_id).first()
    
#     if not note:
#         return jsonify({"error": "Note not found"}), 404
    
#     db.session.delete(note)
#     db.session.commit()
    
#     return jsonify({"message": "Note deleted successfully"}), 200

@notes.route('/api/notes/<int:note_id>/archive', methods=['PATCH'])
@jwt_required()
def toggle_archive(note_id):
    user_id = get_jwt_identity()
    note = Note.query.filter_by(id=note_id, user_id=user_id).first()
    
    if not note:
        return jsonify({"error": "Note not found"}), 404
    
    note.is_archived = not note.is_archived
    db.session.commit()
    
    return jsonify(note.to_dict()), 200

@notes.route('/api/notes/<int:note_id>/pin', methods=['PATCH'])
@jwt_required()
def toggle_pin(note_id):
    user_id = get_jwt_identity()
    note = Note.query.filter_by(id=note_id, user_id=user_id).first()
    
    if not note:
        return jsonify({"error": "Note not found"}), 404
    
    note.is_pinned = not note.is_pinned
    db.session.commit()
    
    return jsonify(note.to_dict()), 200

@notes.route('/api/notes/<int:note_id>/trash', methods=['PATCH'])
@jwt_required()
def toggle_trash(note_id):
    user_id = get_jwt_identity()
    note = Note.query.filter_by(id=note_id, user_id=user_id).first()
    
    if not note:
        return jsonify({"error": "Note not found"}), 404
    
    note.is_trashed = not note.is_trashed
    
    if note.is_trashed:
        note.trashed_at = datetime.utcnow()
    else:
        note.trashed_at = None
    
    db.session.commit()
    
    return jsonify(note.to_dict()), 200

@notes.route('/api/notes/empty-trash', methods=['DELETE'])
@jwt_required()
def empty_trash():
    user_id = get_jwt_identity()
    
    # Find all trashed notes for this user
    trashed_notes = Note.query.filter_by(user_id=user_id, is_trashed=True).all()
    
    if not trashed_notes:
        return jsonify({"message": "Trash is already empty"}), 200
    
    # Delete all trashed notes
    for note in trashed_notes:
        db.session.delete(note)
    
    db.session.commit()
    
    return jsonify({"message": "Trash emptied successfully"}), 200

@notes.route('/api/notes/cleanup-trash', methods=['DELETE'])
def cleanup_trash():
    """
    Clean up notes that have been in trash for more than 7 days.
    This endpoint can be called by a scheduled task.
    """
    # Calculate the date 7 days ago
    cutoff_date = datetime.utcnow() - timedelta(days=7)
    
    # Find notes trashed before the cutoff date
    old_trashed_notes = Note.query.filter(
        and_(
            Note.is_trashed == True,
            Note.trashed_at <= cutoff_date
        )
    ).all()
    
    if not old_trashed_notes:
        return jsonify({"message": "No old trashed notes to clean up"}), 200
    
    # Delete all old trashed notes
    for note in old_trashed_notes:
        db.session.delete(note)
    
    db.session.commit()
    
    return jsonify({
        "message": f"Cleaned up {len(old_trashed_notes)} old trashed notes successfully"
    }), 200