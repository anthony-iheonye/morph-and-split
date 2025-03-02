from typing import Union

import pandas as pd
from pandas import DataFrame
from app.utils import ValidationError

from app.utils import delete_file
from app.utils.directory_file_management import sort_filenames


def validate_stratification_data_file(file_path: str, number_of_image_mask_pairs: int) :
    """
    Function for validating the CSV stratification data file.

    :param file_path: (str) Filepath to the stratification data file.
    :param number_of_image_mask_pairs: (int) Number of image mask pairs.
    :return: List of stratification parameters.
    """
    try:
        # Load stratification parameter file
        df: DataFrame = pd.read_csv(file_path, header=0)

        # Drop columns whose names contain 'Unnamed:'
        df = df.loc[:, ~df.columns.str.contains('^Unnamed', case=False, na=False)]

        # Ensure column headers exist on the first row
        if df.empty or df.columns is None:
            raise ValidationError(error='CSV File Error',
                                  description="The CSV file is empty or missing headers. "
                                              "Ensure that the first row contains the column names.")

        # Ensure the number of rows is equal to the number of images
        if len(df) != number_of_image_mask_pairs:
            raise ValidationError(
                error="Row Count Mismatch",
                description=f"Expected {number_of_image_mask_pairs} rows (one per image), but found {len(df)}. "
                            "Ensure that each image in the dataset has a corresponding row in the CSV file."
            )
        # Remove columns with no name (empty column names)
        df = df.dropna(axis=1, how='all')
        df.columns = [col.strip() if isinstance(col, str) else '' for col in df.columns]
        df = df.loc[:, df.columns != '']  # remove unnamed columns

        # Ensure 'image_id' column exist in the DataFrame.
        if 'image_id' not in df.columns:
            raise ValidationError(
                error="Missing Column",
                description="The CSV file must include a column named 'image_id'. "
                            "Ensure that the first row contains 'image_id' as a header."
            )

        # Ensure 'image_id' values do not contain spaces
        if df['image_id'].astype(str).str.contains(" ").any():
            raise ValidationError(
                error="Invalid 'image_id' Values",
                description="The 'image_id' column contains values with spaces. "
                            "Ensure that all 'image_id' values are free of spaces."
            )

        # Ensure column names do not contain spaces and have a length between 1 and 30 characters
        invalid_columns = [col for col in df.columns if ' ' in col or not (1 <= len(col) <= 25)]
        if invalid_columns:
            raise ValidationError(
                error="Invalid column names",
                description=f"Column names must be between 1 and 25 characters long and cannot contain spaces. "
                            f"The following invalid columns were found: {invalid_columns}. "
                            "Please rename these columns and try again."
            )
        # Sort the DataFrame by "image_id" in ascending order
        df.set_index('image_id', inplace=True, drop=False)
        df = df.loc[sort_filenames(df['image_id'].to_list()), :]

        # Save the validation DataFrame back to the same file
        df.to_csv(file_path, index=False)

        # Return the remaining column names excluding 'image_id'
        return

    except Exception as e:
        # if an error occurs delete teh saved file
        delete_file(file_path)
        raise ValidationError(error="Validation Error", description=str(e))
