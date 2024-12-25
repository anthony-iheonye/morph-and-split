import numpy as np
import pandas as pd
import tensorflow as tf
from app.utils import create_directory
import os


class VisualAttributesDatasetCreator:
    def __init__(self,
                 train_visual_attributes_file_path: str,
                 val_visual_attributes_file_path: str = None,
                 test_visual_attributes_file_path: str = None,
                 save_directory: str = None,
                 visual_properties: tuple = ('L', 'a', 'b', 'contrast',
                                             'correlation', 'energy', 'entropy',
                                             'homogeneity', 'uniformity', 'equivalent_diameter', 'eccentricity',
                                             'feret_diameter_max', 'filled_area', 'perimeter', 'roundness')):

        """
        Produces normalized tensorflow dataset of the training, validation and test visual attributes.

        :param train_visual_attributes_file_path: (str) File path to the json or csv file containing the visual attributes for
            each of the images of the training set.
        :param val_visual_attributes_file_path: (str) File path to the json or csv file containing the visual attributes for
            each of the images of the validation set.
        :param test_visual_attributes_file_path: (str) File path to the json or csv file containing the visual attributes for
            each of the images of the test set.
        :param save_directory: (str) path to the directory where to save a csv file that contains the statistics
            (mean, standard deviation, median, etc.) for of the training set. This file would be used for normalization.
        :param visual_properties: (tuple) a tuple containing the various visual properties of interest. These are the
            ones that would be extracted from the json and used to form the tensorflow dataset as well as the final
            pandas dataframe.
        """
        self.visual_properties = list(visual_properties)

        # Dataframe containing the upper threshold for each of the bins associated with the individual visual properties
        self.upper_thresholds_dict = {}

        # create a dictionary containing individual list of number of samples per bin for each visual parameter
        self.num_of_samples_per_bin = {}

        # dictionary containing weight for each bin associated with the respective visual attributes
        self.bin_weights_dict = {}

        self.train_visual_props_file_path = train_visual_attributes_file_path

        if val_visual_attributes_file_path is not None:
            self.val_visual_props_file_path = val_visual_attributes_file_path
        else:
            self.val_visual_props_file_path = None

        if test_visual_attributes_file_path is not None:
            self.test_visual_props_file_path = test_visual_attributes_file_path
        else:
            self.test_visual_props_file_path = None

        self.train_stats = None
        if save_directory is not None:
            self.save_visual_props_stats = True
            self.save_dir = create_directory(dir_name=save_directory, return_dir=True,
                                             overwrite_if_existing=False)
        else:
            self.save_visual_props_stats = False

        self.train_unnorm_visual_props_dataframe = None
        self.val_unnorm_visual_props_dataframe = None
        self.test_unnorm_visual_props_dataframe = None

        self.train_visual_props_weights_dataframe = None
        self.train_visual_props_weights_dataset = None

        self.train_normalized_visual_props_df = None
        self.val_normalized_visual_props_df = None
        self.test_normalized_visual_props_df = None

        self.train_visual_props_dataset = None
        self.val_visual_props_dataset = None
        self.test_visual_props_dataset = None

        self.mean = None
        self.std = None

    @staticmethod
    def _get_file_extension(file_path):
        """Returns the extension of a file."""
        return os.path.splitext(file_path)[-1]

    def _read_visual_attribute_file(self, file_path):
        """Read a json file and fills the blank rows with zeros."""
        extension = self._get_file_extension(file_path)

        if extension == '.json':
            visual_props = pd.read_json(file_path)
        elif extension == '.csv':
            visual_props = pd.read_csv(file_path)
        else:
            raise TypeError(f'The visual attribute file must be a JSON or CSV format, got file of {extension} format.')
        visual_props = visual_props.copy().loc[::, self.visual_properties]
        # visual_props.drop(columns=['image_id'], inplace=True)

        # return a zero value for images with no infocus pea
        visual_props.fillna(value=0, inplace=True)
        return visual_props

    def _compute_bin_weights(self, unnorm_train_dataframe):
        """
        Computes the weights for each bin associated with the individual visual attributes. Before computing the
        weights, this method computes a dataframe of the upper threshold of the bins of all the visual attributes. in
        addition to that, it also computes a dictionary, `self.num_of_samples_per_bin`, which is the number of samples
        within each bin for the individual visual attributes.

        :param unnorm_train_dataframe: pandas dataframe of the un-normalized visual attributes values
        """
        # compute the upper threshold of the individual bins that make up each visual attribute
        for visual_property in self.visual_properties:
            # numpy arrays containing the number of samples per bin, as well as the upper thresholds for each bin
            # associated with a particular visual
            num_of_samples_per_bin, upper_thresholds = np.histogram(a=unnorm_train_dataframe[visual_property],
                                                                    bins='doane')

            # update the dictionary self.num_of_samples_per_bin with array of upper_thresholds for each bin associated
            # with each of the visual attributes
            # change 0s in num_per_bin to 1, so we don't divide by zero when computing weights
            zero_index = (num_of_samples_per_bin == 0)
            num_of_samples_per_bin[zero_index] = 1

            # weights per bin
            weight = num_of_samples_per_bin.max() / num_of_samples_per_bin
            weight = np.log10(weight) + 1
            weight[zero_index] = 0

            self.bin_weights_dict[visual_property] = weight
            self.upper_thresholds_dict[visual_property] = upper_thresholds
            num_of_samples_per_bin[zero_index] = 0
            self.num_of_samples_per_bin[visual_property] = num_of_samples_per_bin

    def _produce_visual_attribute_weights_dataframe(self):
        """
        Produces a dataframe containing sample weights for each of the training example within each column in
        a visual properties dataframe.

        :return: Pandas dataframe containing sample weight for each visual properties value with the
            'visual_props_dataframe'.
        """
        visual_attribute_weights_df = pd.DataFrame(data=None, columns=self.visual_properties)
        #
        # for column in visual_props_dataframe.columns:
        #     bin_threshold = self.upper_thresholds_dict[column]
        #     weights = self.bin_weights_dict[column]
        #
        #     visual_attribute_weights_df[column] = visual_props_dataframe[column].apply(func=self._assign_weight,
        #                                                                                args=(bin_threshold, weights))
        for visual_property in self.visual_properties:
            weight_indices = np.digitize(x=self.train_unnorm_visual_props_dataframe[visual_property],
                                         bins=self.upper_thresholds_dict[visual_property],
                                         right=True) - 1
            visual_attribute_weights_df.loc[::, visual_property] = self.bin_weights_dict[visual_property][
                weight_indices]

        return visual_attribute_weights_df

    def _compute_normalization_statistics(self, dataframe):
        """computer mean and standard deviation of the training set"""
        stats = dataframe.describe().transpose()
        mean = stats['mean']
        std = stats['std']
        self.train_stats = stats
        return mean, std

    def _save_stats(self):
        """
        Saves the stats (mean, std, etc.) of the visual attributes dataset, for
        the training, validation and test sets.
        """
        self.train_stats.to_csv(f'{self.save_dir}/training_stats.csv')

    def _normalize_dataframe(self, dataframe):
        # normalize dataframe
        normalized_data = (dataframe - self.mean) / self.std
        return normalized_data

    def _read_json_and_produce_normalized_training_dataframe(self):
        """read and normalizes the values within a training dataframe."""
        self.train_unnorm_visual_props_dataframe = self._read_visual_attribute_file(
            file_path=self.train_visual_props_file_path)

        self._compute_bin_weights(unnorm_train_dataframe=self.train_unnorm_visual_props_dataframe)

        self.train_visual_props_weights_dataframe = self._produce_visual_attribute_weights_dataframe()

        # compute normalization statistics (mean and std)
        self.mean, self.std = self._compute_normalization_statistics(dataframe=self.train_unnorm_visual_props_dataframe)
        self.train_normalized_visual_props_df = self._normalize_dataframe(
            dataframe=self.train_unnorm_visual_props_dataframe)

    def _read_json_and_produce_normalized_val_or_test_dataframe(self):
        """read and normalizes the values within a validation or test dataframe."""
        if self.val_visual_props_file_path is not None:
            self.val_unnorm_visual_props_dataframe = self._read_visual_attribute_file(
                file_path=self.val_visual_props_file_path)
            self.val_normalized_visual_props_df = self._normalize_dataframe(self.val_unnorm_visual_props_dataframe)

        if self.test_visual_props_file_path is not None:
            self.test_unnorm_visual_props_dataframe = self._read_visual_attribute_file(
                file_path=self.test_visual_props_file_path)
            self.test_normalized_visual_props_df = self._normalize_dataframe(self.test_unnorm_visual_props_dataframe)

    def _produce_train_val_test_datasets(self):
        """Produces the training, validation and test datasets."""
        if self.train_visual_props_file_path is not None:
            self.train_visual_props_dataset = tf.data.Dataset.from_tensor_slices(
                tensors=self.train_normalized_visual_props_df.to_dict('list'))

        if self.val_visual_props_file_path is not None:
            self.val_visual_props_dataset = tf.data.Dataset.from_tensor_slices(
                tensors=self.val_normalized_visual_props_df.to_dict('list'))

        if self.test_visual_props_file_path is not None:
            self.test_visual_props_dataset = tf.data.Dataset.from_tensor_slices(
                tensors=self.test_normalized_visual_props_df.to_dict('list'))

    def _produce_train_visual_props_weight_dataset(self):
        """Produces the training, validation and test datasets."""
        self.train_visual_props_weights_dataset = tf.data.Dataset.from_tensor_slices(
            tensors=self.train_visual_props_weights_dataframe.to_dict('list'))

    def process_data(self):
        self._read_json_and_produce_normalized_training_dataframe()
        self._read_json_and_produce_normalized_val_or_test_dataframe()
        self._produce_train_val_test_datasets()
        self._produce_train_visual_props_weight_dataset()
        if self.save_visual_props_stats:
            self._save_stats()


