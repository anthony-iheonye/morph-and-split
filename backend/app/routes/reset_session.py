from flask import Blueprint, jsonify

from app.utils import create_project_directories, create_resized_augmentation_directories

# Blueprint definition
reset_session = Blueprint('reset_session', __name__)

@reset_session.route('/reset_session', methods=['POST'])
def reset_project_session():
    try:
        # Delete all data by creating empty project folders
        create_project_directories(return_dir=False, overwrite_if_existing=True)
        create_resized_augmentation_directories(return_dir=False, overwrite_if_existing=True)

        return jsonify({'success': True}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500