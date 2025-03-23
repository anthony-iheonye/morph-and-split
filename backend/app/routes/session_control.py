from flask import Blueprint, jsonify
import threading

session_is_running = threading.Event()


# Blueprint definition
set_session = Blueprint('set_session', __name__)

@set_session.route('/session/start_session', methods=['POST'])
def start_session():
    """
    Register that a session has started.
    :return:
    """
    try:
        session_is_running.set()
        return jsonify({'isRunning': True, 'message': 'Session is running'}), 200
    except Exception as e:
        return jsonify({'isRunning': False, 'error': str(e)}), 500


@set_session.route('/session/stop_session', methods=['POST'])
def stop_session():
    """
    Mark the session as not running.
    """
    try:
        session_is_running.clear()
        return jsonify({'isRunning': False, 'message': 'Session stopped'}), 200
    except Exception as e:
        return jsonify({'isRunning': True, 'error': str(e)}), 500


