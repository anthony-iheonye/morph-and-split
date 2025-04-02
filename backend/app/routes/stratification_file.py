import os
import pandas as pd

from flask import Blueprint, request, jsonify

from app.services import validate_stratification_data_file, session_store
from app.utils import list_filenames, ValidationError, delete_file

stratification_data_file_processing = Blueprint('upload_stratification_data_file', __name__)


@stratification_data_file_processing.route('/upload/backend/stratification_file', methods=['POST'])
def upload_stratification_file():
    try:
        session_id = request.args.get('sessionId')
        files = request.files.getlist("stratificationDataFile")

        directory_store = session_store.get_directory_store(session_id=session_id)
        no_of_images = len(list_filenames(directory_store.image_dir))

        if not files:
            return jsonify({'success': False, 'error': "No file was uploaded", 'results': []}), 400

        stratification_data_file = files[0]
        filename = stratification_data_file.filename
        save_path = os.path.join(directory_store.stratification_data_file_dir, filename)
        stratification_data_file.save(save_path)

        try:
            stratification_parameters = validate_stratification_data_file(
                file_path=save_path, number_of_image_mask_pairs=no_of_images
            )
            return jsonify({'success': True, 'results': stratification_parameters}), 200

        except ValidationError as ve:
            return jsonify({'success': False, 'error': ve.error, 'message': ve.description}), 400

    except Exception as e:
        return jsonify({'success': False, 'error': "Internal Server Error", 'message': str(e)}), 500


@stratification_data_file_processing.route('/stratification_data_file/parameters', methods=['GET'])
def get_stratification_parameters():
    try:
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id=session_id)
        stratification_dir = directory_store.stratification_data_file_dir


        file_names = list_filenames(stratification_dir)
        if not file_names:
            return jsonify({'success': True,
                            'results': [],
                            'message': 'No stratification data file was found.'}), 200

        filepath = str(os.path.join(stratification_dir, file_names[0]))
        df = pd.read_csv(filepath, header=0)
        parameters = [col for col in df.columns if col != 'image_id']

        return jsonify({'success': True, 'results': parameters}), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@stratification_data_file_processing.route('/stratification_data_file/delete', methods=['DELETE'])
def delete_stratification_data_file():
    try:
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id=session_id)
        stratification_dir = directory_store.stratification_data_file_dir

        file_names = list_filenames(stratification_dir)
        if not file_names:
            return jsonify({'success': True,
                            'error': 'File not Found',
                            'message': 'No stratification data file was found.'}), 200

        filepath = str(os.path.join(stratification_dir, file_names[0]))
        delete_file(filepath)
        return jsonify({'success': True, 'message': f"Successfully delete stratification data file {file_names[0]}"}), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

