from flask import Blueprint, jsonify, request
from app.services import session_store

# Blueprint definition
set_session = Blueprint('set_session', __name__)

@set_session.route('/session/start_session', methods=['POST'])
def start_session():
    """
    Register that a session has started.
    :return:
    """
    try:
        session_id = request.args.get('sessionId')
        session_store.set_session_running(session_id)

        return jsonify({'isRunning': True, 'message': 'Session is running'}), 200
    except Exception as e:
        return jsonify({'isRunning': False, 'error': str(e)}), 500


@set_session.route('/session/clear_session', methods=['POST'])
def clear_session():
    """
    Mark the session as not running and delete all states associated with the session.
    """
    try:
        session_id = request.args.get('sessionId')
        session_store.clear_session(session_id)

        return jsonify({'success': True, 'message': f'Successfully deleted session ID: {session_id}.'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


