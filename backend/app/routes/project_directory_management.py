import os

from flask import Blueprint, jsonify, request

from app.utils import create_project_directories, create_resized_augmentation_directories, delete_directory, \
    create_directory, delete_file, list_filenames

from app.services import session_store

# Blueprint definition
directory_management = Blueprint('directory_management', __name__)

@directory_management.route('/project_directories/create', methods=['POST'])
def create_all_directories():
    try:
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id=session_id)

        # Delete all data by creating empty project folders
        create_project_directories(directory_store=directory_store,
                                   return_dir=False,
                                   overwrite_if_existing=True)

        create_resized_augmentation_directories(directory_store=directory_store,
                                                return_dir=False,
                                                overwrite_if_existing=True)

        return jsonify({'success': True, 'message': "Project directories created successfully" }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@directory_management.route('/project_directory/images/create', methods=['POST'])
def create_image_directories():
    try:
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id=session_id)

        # Delete all data by creating empty project folders
        create_directory(dir_name=directory_store.image_dir, return_dir=False, overwrite_if_existing=True)
        create_directory(dir_name=directory_store.resized_image_dir, return_dir=False, overwrite_if_existing=True)

        return jsonify({'success': True,
                        'message': "Images and resized images directories created successfully" }), 201

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@directory_management.route('/project_directory/masks/create', methods=['POST'])
def create_mask_directories():
    try:
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id=session_id)

        # Delete all data by creating empty project folders
        create_directory(dir_name=directory_store.mask_dir, return_dir=False, overwrite_if_existing=True)
        create_directory(dir_name=directory_store.resized_mask_dir, return_dir=False, overwrite_if_existing=True)
        return jsonify({'success': True,
                        'message': "Images and resized images directories created successfully" }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@directory_management.route('/project_directories/delete', methods=['DELETE'])
def delete_all_directories():
    """
    Delete the project directory
    """
    try:
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id=session_id)

        delete_directory(dir_name=directory_store.asset_dir)
        return jsonify({'success': True, 'message': "Project directories deleted" }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@directory_management.route('/project_directory/images/delete', methods=['DELETE'])
def delete_uploaded_images():
    """Delete all uploaded images"""
    try:
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id=session_id)

        delete_directory(directory_store.image_dir)
        delete_directory(directory_store.resized_image_dir)
        return jsonify({'success': True, 'message': "Successfully deleted uploaded images." }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@directory_management.route('/project_directory/masks/delete', methods=['DELETE'])
def delete_uploaded_masks():
    """Delete all uploaded masks"""
    try:
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id=session_id)

        delete_directory(directory_store.mask_dir)
        delete_directory(directory_store.resized_mask_dir)
        return jsonify({'success': True, 'message': "Successfully deleted uploaded images." }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@directory_management.route('/project_directory/stratification_data_file/delete', methods=['DELETE'])
def delete_stratification_data_file():
    """Delete the stratification data file."""
    try:
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id=session_id)

        file_name = list_filenames(directory_store.stratification_data_file_dir)
        if not file_name:
            return jsonify({'success': True, 'message': "No stratification data file exist."}), 200
        else:
            file_path = os.path.join(directory_store.stratification_data_file, file_name[0])
            os.remove(file_path)
            delete_directory(directory_store.resized_mask_dir)
            return jsonify({'success': True,
                            'message': f"Successfully deleted the stratification data file '{file_name}'." }), 201

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

