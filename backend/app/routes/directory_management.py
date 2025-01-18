from flask import Blueprint, jsonify

from app.utils import create_project_directories, create_resized_augmentation_directories, delete_directory, \
    directory_store

# Blueprint definition
directory_management = Blueprint('directory_management', __name__)

@directory_management.route('/project_directories/create', methods=['POST'])
def create_project_directories():
    try:
        # Delete all data by creating empty project folders
        create_project_directories(return_dir=False, overwrite_if_existing=True)
        create_resized_augmentation_directories(return_dir=False, overwrite_if_existing=True)


        return jsonify({'success': True, 'message': "Project directories created successfully" }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@directory_management.route('/project_directories/delete', methods=['DELETE'])
def delete_project_directories():
    try:
        delete_directory(dir_name=directory_store.asset_dir)
        return jsonify({'success': True, 'message': "Project directories deleted" }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500