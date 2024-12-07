import os
import random
import re
from typing import Union, Tuple
import gc
import matplotlib.pyplot as plt
import pandas as pd
import tensorflow as tf
from keras.layers import RandomRotation
from skimage import io
from sklearn.model_selection import StratifiedShuffleSplit
from sklearn.model_selection import train_test_split

from app.utils import create_directory
from .visual_attributes_service import VisualAttributesDatasetCreator


class DataSplitterAugmenterAndSaver:
    def __init__(self,
                 images_directory: str,
                 masks_directory: str,
                 train_directory: str,
                 val_directory: Union[str, None],
                 test_directory: Union[str, None],
                 initial_save_id_train: int,
                 initial_save_id_val: int,
                 initial_save_id_test: int,
                 visual_attributes_json_path: str = None,
                 image_mask_channels: Union[Tuple[int, int], tuple] = (3, 3),
                 image_format: str = 'png',
                 final_image_size: Union[Tuple[int, int], tuple, None] = None,
                 image_save_format: str = 'png',
                 image_save_prefix: str = 'img',
                 mask_save_prefix: str = 'mask',
                 val_size: float = 0.2,
                 test_size: float = 0.2,
                 seed: int = None,
                 crop_image_and_mask: bool = False,
                 crop_dimension: Tuple[int, int, int, int] = None,
                 augmentation_prob: int = 6,
                 augment_validation_data: bool = False,
                 random_crop: bool = True,
                 flip_left_right: bool = True,
                 flip_up_down: bool = True,
                 random_rotate: bool = True,
                 corrupt_brightness: bool = False,
                 corrupt_contrast: bool = False,
                 corrupt_saturation: bool = False,
                 cache_directory: str = None,
                 display_split_histogram: bool = False,
                 number_of_training_images_after_augmentation: int = 1000,
                 visual_attributes: tuple = ('eccentricity', 'equivalent_diameter', 'feret_diameter_max',
                                             'filled_area', 'perimeter', 'roundness', 'L', 'a', 'b', 'contrast',
                                             'correlation', 'energy', 'entropy', 'homogeneity', 'uniformity'),
                 parameter_for_stratified_splitting: str = 'a'):
        """
        The DataSplitterAugmenterAndSaver class is used to split a directory containing images and masks, into training,
        validation and test set images and masks, saved in their respective folders.

        NOTE: If `.process_data` method is run when all the different transformations are set to False, the original images and masks would be split and saved in the train, validation and test directories,
        without being augmented.

        :param display_split_histogram: (bool) if true, the histogram used for the stratified splitting would be
            displayed
        :param visual_attributes_json_path: (str) File path to the json file containing the visual attributes for
            each of the images of the validation set.
        :param visual_attributes: (tuple) a tuple containing the various visual properties of interest. From among the
            properties within this tuple, one would used to split the images into training, validation and test sets.
        :param parameter_for_stratified_splitting: (str): visual parameter within the `visual_properties` attributes
            that would be used to split the images and masks into training, validation and test set.
        :param images_directory: (str): Path to directory containing the original images that would later be split into
            training, validation and test sets.
        :param masks_directory: (str): Path to directory containing the original masks that would later be split into
            training, validation and test sets.
        :param train_directory: (str): Path to the directory where the training images and mask would be saved. Within
            this directory, an image and mask subdirectory would be created to store the images and mask assigned to
            the training set. If the path supplied as the train_directory already contains subdirectory 'images' and
            'mask', these subdirectories would be retained, together with the images within them. To ensure that the
            images or mask in these subdirectories are not overwritten, the train_start_index should be higher than the
            index used for any of the images within the folder.
        :param val_directory: (str): Path to the directory where the validation images and mask would be saved. Within
            this an image and mask subdirectory would be created to store the images and mask assigned to the
            validation set. If the path supplied as the val_directory already contains subdirectory 'images' and
            'mask', these subdirectories would be retained, together with the images within them. To ensure that the
            images or mask in these subdirectories are not overwritten, the val_start_index should be higher than the
            index used for any of the images within the folder.
        :param test_directory: (str): Path to the directory where the training images and mask would be saved. Within
            this an image and mask subdirectory would be created to store the images and mask assigned to the training
            set. If the path supplied as the test_directory already contains subdirectory 'images' and  'mask', these
            subdirectories would be retained, together with the images within them. To ensure that the
            images or mask in these subdirectories are not overwritten, the test_start_index should be higher than the
            index used for any of the images within the folder.
        :param image_mask_channels: The number of channels in the image and mask. The first value is the number of
            channels for the image, while the other is for the mask.
        :param image_format: (str) The format of the image. It can be 'jpg', 'png', or 'bmp'.
        :param val_size: (float): The number of image/mask in percentage that would be assigned to the validation set.
            The number must be between 0 and 1.
        :param test_size: (float): The number of image/mask in percentage that would be assigned to the test set.
            The number must be between 0 and 1.
        :param seed:  (int): An int used to shuffle the original set of images and masks before grouping them into
            training, validation and test sets. If not specified (and shuffle is set to true), a random integer is
            assigned to seed.
        :param image_save_prefix: (str): Prefix for saving the images. By default, it is left blank.
        :param mask_save_prefix: (str): Prefix for saving the mask. By default, it is left blank.
        :param initial_save_id_train: (int): A number that would be used to save the first image and mask in the
            training_dataset. Eg. if it set to 5, and the image_save_prefix is 'img', the first image would be saved as
            'img_5.jpg'
        :param initial_save_id_val: (int): A number that would be used to save the first image and mask in the
            validation_dataset. Eg. if it set to 5, and the image_save_prefix is 'img', the first image would be saved
            as 'img_5.jpg'
        :param initial_save_id_test: (int): A number that would be used to save the first image and mask in the
            test_dataset. Eg. if it set to 5, and the image_save_prefix is 'img', the first image would be saved as
            'img_5.jpg'
        :param resize_images: (bool): If 'True', the images and masks would be resized
        :param final_image_size: (Tuple): The final height and width after resizing the loaded images and mask. This is
            the size of the image and mask that would be loaded to the deep learning model after resizing. If the image
            is not resized, its original size would be retained.
        :param crop_image_and_mask: (bool): If 'True' the all the input masks and images would be cropped before
            resizing them to the required size (image_size)
        :param crop_dimension: (Tuple): A tuple (offset_height, offset_width, target_height, target_width) containing
            the region to be for cropped
        :param augmentation_prob: (int): An integer used to determine the probability that a augmentation method would
            be implemented.
        :param augment_validation_data: (bool): If True, the validation set will be augmented. For the validation data
            to be augmented, the parameter 'apply_data_augmentation' must also be set to 'True'.
        :param random_crop: (bool): If True, the images and masks in the training set would be randomly cropped during
            augmentation
        :param flip_left_right: (bool): If True, the images and masks in the training set would be randomly flipped
            left-to-right during data augmentation
        :param flip_up_down: bool): If True, the images and masks in the training set would be randomly flipped
            up-to-down during data augmentation
        :param random_rotate: (bool): If True, the images and masks in the training set would be randomly rotated during
            data augmentation
        :param corrupt_brightness: (bool): If True, the brightness of the images in the training set would be randomly
            adjusted during data augmentation
        :param corrupt_contrast: (bool): If True, the contrast of the images in the training set would be randomly
            adjusted during data augmentation
        :param corrupt_saturation: (bool): If True, the saturation of the images in the training set would be randomly
            adjusted during data augmentation
        """

        apply_data_augmentation = any([random_crop, flip_left_right, flip_up_down, random_rotate,
                corrupt_brightness, corrupt_contrast, corrupt_saturation])

        self.images_directory = images_directory
        self.masks_directory = masks_directory

        if visual_attributes_json_path is None or visual_attributes is None:
            self.visual_attributes_json_path = None
        else:
            self.visual_attributes_json_path = visual_attributes_json_path

            self.visual_attributes = visual_attributes
            self.parameter_for_stratified_splitting = parameter_for_stratified_splitting

            self.before_split_dataframe = None
            self.after_split_dataframe = None

            self.vis_attribute_creator = VisualAttributesDatasetCreator(
                train_visual_attributes_json_path=self.visual_attributes_json_path,
                visual_properties=self.visual_attributes)

            self.vis_attribute_creator.process_data()
            self.original_visual_props_dataframe = self.vis_attribute_creator.train_unnorm_visual_props_dataframe
            self.upper_thresholds_dict = self.vis_attribute_creator.upper_thresholds_dict
            self.specific_upper_threshold = self.upper_thresholds_dict[parameter_for_stratified_splitting]

            column_names = ['image_path', 'mask_path']
            column_names.extend(self.visual_attributes)
            self.original_dataframe = pd.DataFrame(data=None, columns=column_names)
            self.train_dataframe = pd.DataFrame(data=None, columns=column_names)
            self.val_dataframe = pd.DataFrame(data=None, columns=column_names)
            self.test_dataframe = pd.DataFrame(data=None, columns=column_names)

        self.display_split_histogram = display_split_histogram
        self.original_image_paths = []
        self.original_mask_paths = []
        self.train_directory = create_directory(dir_name=train_directory, return_dir=True,
                                                overwrite_if_existing=False)

        if val_directory is not None:
            self.val_directory = create_directory(dir_name=val_directory, return_dir=True,
                                                  overwrite_if_existing=False)
        else:
            self.val_directory = None

        if test_directory is not None:
            self.test_directory = create_directory(dir_name=test_directory, return_dir=True,
                                                   overwrite_if_existing=False)
        else:
            self.test_directory = None

        self.train_subdirectories = {}
        self.validation_subdirectories = {}
        self.test_subdirectories = {}
        self.image_save_directory = None
        self.mask_save_directory = None
        self.training_image_paths = []
        self.training_mask_paths = []
        self.validation_image_paths = []
        self.validation_mask_paths = []
        self.test_image_paths = []
        self.test_mask_paths = []
        self.val_size = val_size
        self.test_size = test_size
        self.no_of_train_examples = None
        self.no_of_val_examples = None
        self.no_of_test_examples = None
        self.image_mask_channels = image_mask_channels

        self.image_format = image_format
        if self.image_format.lower() in ['jpg', 'jpeg']:
            self.decode_image = tf.image.decode_jpeg
        elif self.image_format.lower() == 'png':
            self.decode_image = tf.image.decode_png
        elif self.image_format.lower() == 'bmp':
            self.decode_image = tf.image.decode_bmp

        self.image_save_format = image_save_format

        self.image_channels = self.image_mask_channels[0]
        self.mask_channels = self.image_mask_channels[1]
        self.image_save_prefix = image_save_prefix
        self.mask_save_prefix = mask_save_prefix
        self.image_size = None

        self.crop_image_and_mask = crop_image_and_mask
        self.crop_dimension = crop_dimension
        self.apply_data_augmentation = apply_data_augmentation
        self.augmentation_prob = augmentation_prob
        self.augment_validation_data = augment_validation_data
        self.random_crop = random_crop
        self.flip_left_right = flip_left_right
        self.flip_up_down = flip_up_down
        self.random_rotate = random_rotate
        self.rotate = RandomRotation(factor=0.3)
        self.corrupt_brightness = corrupt_brightness
        self.corrupt_contrast = corrupt_contrast
        self.corrupt_saturation = corrupt_saturation
        self.number_of_training_images_after_augmentation = number_of_training_images_after_augmentation
        self.iterations = None
        self.current_train_index = initial_save_id_train
        self.current_val_index = initial_save_id_val
        self.current_test_index = initial_save_id_test
        self.tune = tf.data.experimental.AUTOTUNE
        self.training_dataset = None
        self.validation_dataset = None
        self.test_dataset = None

        if cache_directory is not None:
            self.cache_directory = create_directory(dir_name=cache_directory, return_dir=True,
                                                    overwrite_if_existing=True)
            self.train_cache = create_directory(os.path.join(self.cache_directory, 'train'), return_dir=True)
            self.val_cache = create_directory(os.path.join(self.cache_directory, 'val'), return_dir=True)
            self.test_cache = create_directory(os.path.join(self.cache_directory, 'test'), return_dir=True)
        else:
            self.cache_directory = None
            self.train_cache = self.val_cache = self.test_cache = ''

        if seed is None:
            self.seed = random.randint(0, 1000)
        else:
            self.seed = seed

        self._split_paths_into_train_val_test()
        self._create_directories()

        if final_image_size is not None:
            self.final_image_size = final_image_size + (self.image_channels,)
            self.new_image_height = tuple(self.final_image_size)[0]
            self.new_image_width = tuple(self.final_image_size)[1]

            if tuple(self.image_size) != self.final_image_size:
                self.resize_images = True
            else:
                self.resize_images = False
        else:
            self.resize_images = False
            self.final_image_size = self.image_size
            self.new_image_height = self.image_size[0]
            self.new_image_width = self.image_size[1]

        if crop_dimension is not None and crop_image_and_mask:
            self.offset_height = crop_dimension[0]
            self.offset_width = crop_dimension[1]
            self.target_height = crop_dimension[2]
            self.target_width = crop_dimension[3]
            self.resize_images = True
        else:
            self.crop_image_and_mask = False

    @staticmethod
    def sort_filenames(file_paths):
        return sorted(file_paths, key=lambda var: [
            int(x) if x.isdigit() else x.lower() for x in re.findall(r'\D+|\d+', var)
        ])

    def _get_filepaths_for_images_and_masks(self, images_dir, masks_dir):
        """
        Generates the list of path for images and masks within specified directories.

        :param images_dir: a directory containing images
        :param masks_dir: a directory containing masks
        :return: Returns two lists, one containing the file path for the images and other list containing the file
            paths for the masks
        """
        image_file_list = os.listdir(path=images_dir)
        mask_file_list = os.listdir(path=masks_dir)
        image_paths = [os.path.join(images_dir, filename) for filename in image_file_list]
        mask_paths = [os.path.join(masks_dir, filename) for filename in mask_file_list]

        # sort the file paths in ascending other
        # image_paths.sort(key=lambda var: [int(x) if x.isdigit() else x for x in re.findall(r'[^0-9]|[0-9]+', var)])
        # mask_paths.sort(key=lambda var: [int(x) if x.isdigit() else x for x in re.findall(r'[^0-9]|[0-9]+', var)])
        image_paths = self.sort_filenames(image_paths)
        mask_paths = self.sort_filenames(mask_paths)

        return image_paths, mask_paths

    def _read_json_file(self, json_file_path):
        """Read a json file and fills the blank rows with zeros."""
        visual_props = pd.read_json(json_file_path)
        visual_props = visual_props.copy().loc[::, self.visual_properties]
        # visual_props.drop(columns=['image_id'], inplace=True)

        # return a zero value for images with no infocus pea
        visual_props.fillna(value=0, inplace=True)
        return visual_props

    def _stratified_split(self, dataframe, test_size: float, first_split: bool = None):
        """
        Splits the dataframe into training and test set, using information contained in a particular column.

        :param dataframe: Dataframe that would be split into training and test set
        :param test_size: If float, should be between 0.0 and 1.0 and represent the proportion of the dataset to
            include in the test split. If int, represents the absolute number of test samples. If None, the value is
            set to the complement of the train size. If train_size is also None, it will be set to 0.1
        :param first_split: (bool) The dataset would be split twice. "first" when creating the validation set from the original
            dataset, and 'second', when creating the test set from the remaining dataset. set first_slit to True
            when applying stratified_split for the first time, and False the second time. When set to True, the
            'before_split_dataframe' attribute is populated with the appropriate data for plotting the histogram of the
            stratified_split parameter just before the first split was done. on the other hand, when first_split is set to
             False, the 'after_split_dataframe' is populated with data for plotting the histogram of the stratified_split
             parameter, just before the second split was done.
        :return:
        """
        new_dataframe = dataframe.copy()
        bin_parameter = self.parameter_for_stratified_splitting + "_cut"
        no_of_bins = len(self.specific_upper_threshold)

        # add the categorical column to the end of the visual properties table
        new_dataframe[bin_parameter] = pd.cut(x=new_dataframe[self.parameter_for_stratified_splitting],
                                              bins=self.specific_upper_threshold, include_lowest=True,
                                              labels=list(range(1, no_of_bins)))

        if first_split is not None:
            if first_split:
                self.before_split_dataframe = new_dataframe[bin_parameter]
            else:
                self.after_split_dataframe = new_dataframe[bin_parameter]

        # Create a StratifiedShuffleSplit object
        split_object = StratifiedShuffleSplit(n_splits=1, test_size=test_size, random_state=self.seed)

        # Create two empty Dataframes for the test and training sets
        strat_train_set = pd.DataFrame(columns=self.visual_attributes)
        strat_test_set = pd.DataFrame(columns=self.visual_attributes)

        # Generate indices (train_index and test_index) that would be used to split the dataset
        for train_index, test_index in split_object.split(new_dataframe, new_dataframe[bin_parameter]):
            strat_train_set = new_dataframe.iloc[train_index]
            strat_test_set = new_dataframe.iloc[test_index]

        # Remove the added categorical column
        # strat_train_set = strat_train_set.drop(bin_parameter, axis=1)
        # strat_test_set = strat_test_set.drop(bin_parameter, axis=1)
        return strat_train_set, strat_test_set

    def plot_split_histogram(self):
        """
        plots the split histogram.
        """
        # plot histogram of split
        self.before_split_dataframe.hist()
        plt.title(f"{self.parameter_for_stratified_splitting} before splitting", fontsize=14)
        plt.show()

        self.after_split_dataframe.hist()
        plt.title(f"{self.parameter_for_stratified_splitting} after splitting", fontsize=14)
        plt.show()

    def _split_paths_without_visual_attributes(self):
        """
        Splits the original images and masks file paths into training, validation and test paths. The images are
        split randomly, without using the visual attributes of the images.
        """

        # Split the original image paths into validation list and a temporary training list
        train_image_paths = self.original_image_paths
        train_mask_paths = self.original_mask_paths

        val_image_paths = val_mask_paths = test_image_paths = test_mask_paths = []

        if self.val_directory is not None:
            train_image_paths, val_image_paths, train_mask_paths, val_mask_paths = train_test_split(
                train_image_paths, train_mask_paths, test_size=self.val_size, random_state=self.seed)

        if self.test_directory is not None:
            train_image_paths, test_image_paths, train_mask_paths, test_mask_paths = train_test_split(
                train_image_paths, train_mask_paths, test_size=self.test_size, random_state=self.seed)

        self.training_image_paths = train_image_paths
        self.training_mask_paths = train_mask_paths
        self.validation_image_paths = val_image_paths
        self.validation_mask_paths = val_mask_paths
        self.test_image_paths = test_image_paths
        self.test_mask_paths = test_mask_paths
        self.no_of_train_examples = len(train_image_paths)
        self.no_of_val_examples = len(val_image_paths)
        self.no_of_test_examples = len(test_image_paths)

        # The number of the times the data augmentation step has be run per iteration, inorder to produce enough
        # training and validation examples, to produce the total number of training images and mask required.
        if self.apply_data_augmentation:
            if self.number_of_training_images_after_augmentation // self.no_of_train_examples != 0:
                self.iterations = self.number_of_training_images_after_augmentation // self.no_of_train_examples + 1
            else:
                self.iterations = self.number_of_training_images_after_augmentation // self.no_of_train_examples
        else:
            self.iterations = 1

    def _split_paths_using_visual_attributes(self):
        """
        Splits the original images and masks file paths into training, validation and test paths. The images are
        split randomly using a selected visual attribute of the images.
        """
        # Add the images and masks paths, as well as their visual properties to a new dataframe called
        # original_dataframe
        self.original_dataframe.loc[::, 'image_path'] = self.original_image_paths
        self.original_dataframe.loc[::, 'mask_path'] = self.original_mask_paths
        self.original_dataframe.loc[::, self.visual_attributes] = self.original_visual_props_dataframe

        # Split the contents of the original_dataframe validation dataframe and a temporary training dataframe
        train_dataframe, self.val_dataframe = self._stratified_split(dataframe=self.original_dataframe,
                                                                     test_size=self.val_size,
                                                                     first_split=True)

        # Split the contents of the temporary train_dataframe into a testing and  training dataframe
        self.train_dataframe, self.test_dataframe = self._stratified_split(dataframe=train_dataframe,
                                                                           test_size=self.test_size,
                                                                           first_split=False)

        if self.display_split_histogram:
            self.plot_split_histogram()

        self.training_image_paths = self.train_dataframe['image_path'].to_list()
        self.training_mask_paths = self.train_dataframe['mask_path'].to_list()
        self.validation_image_paths = self.val_dataframe['image_path'].to_list()
        self.validation_mask_paths = self.val_dataframe['mask_path'].to_list()
        self.test_image_paths = self.test_dataframe['image_path'].to_list()
        self.test_mask_paths = self.test_dataframe['mask_path'].to_list()
        self.no_of_train_examples = len(self.training_image_paths)
        self.no_of_val_examples = len(self.validation_image_paths)
        self.no_of_test_examples = len(self.test_image_paths)

        # The number of the times the data augmentation step has be run per iteration, inorder to produce enough
        # training and validation examples, to produce the total number of training images and mask required.
        if self.apply_data_augmentation:
            if self.number_of_training_images_after_augmentation // self.no_of_train_examples != 0:
                self.iterations = self.number_of_training_images_after_augmentation // self.no_of_train_examples + 1
            else:
                self.iterations = self.number_of_training_images_after_augmentation // self.no_of_train_examples
        else:
            self.iterations = 1

    def _split_paths_into_train_val_test(self):
        """
        Splits the original images and masks file paths into training, validation and test paths
        """
        # create lists of file paths for the original images and masks
        image_paths, mask_paths = self._get_filepaths_for_images_and_masks(images_dir=self.images_directory,
                                                                           masks_dir=self.masks_directory)
        # assign them to their attributes
        self.original_image_paths = image_paths
        self.original_mask_paths = mask_paths

        # get the image shape
        image = tf.io.read_file(image_paths[0])
        image = self.decode_image(image, channels=self.image_channels)
        self.image_size = image.shape

        if self.visual_attributes_json_path is None or self.visual_attributes is None:
            self._split_paths_without_visual_attributes()
        else:
            try:
                self._split_paths_using_visual_attributes()
            except ValueError:
                print(f"ERROR! ERROR!! ERROR!!\n"
                      f"At least one of the non-empty bins in stratification parameter '{self.parameter_for_stratified_splitting}' contains only one element.\n"
                      f"To use a visual attribute for stratified splitting, each non-empty bin must contain at least 2 elements.\n\n"
                      f"SOLUTION: Choose a different value for 'parameter_for_stratified_splitting', or increase the split size assigned to val_size and test_size.")

    def _create_directories(self):
        """
        Creates directories the subdirectories named 'image' and 'mask', where  images and masks for the training,
        validation and test sets would be saved.

        :return: A dictionary containing the path to the respective directories. These can be accessed using the
            'train_subdirectories', 'validation_subdirectories' and 'test_subdirectories' attributes.
        """

        self.train_subdirectories['images'] = create_directory(
            dir_name=os.path.join(self.train_directory, 'images'), return_dir=True)
        self.train_subdirectories['masks'] = create_directory(
            dir_name=os.path.join(self.train_directory, 'masks'), return_dir=True)

        if self.val_directory is not None:
            self.validation_subdirectories['images'] = create_directory(
                dir_name=os.path.join(self.val_directory, 'images'), return_dir=True)
            self.validation_subdirectories['masks'] = create_directory(
                dir_name=os.path.join(self.val_directory, 'masks'), return_dir=True)

        if self.test_directory is not None:
            self.test_subdirectories['images'] = create_directory(
                dir_name=os.path.join(self.test_directory, 'images'), return_dir=True)
            self.test_subdirectories['masks'] = create_directory(
                dir_name=os.path.join(self.test_directory, 'masks'), return_dir=True)

    def _set_shape(self, image, mask):
        """
        Returns information on the shape of the image and the mask. This function is useful especially when data
        augmentation is applied. If not model.fit function would return a 'ValueError' when its run.
        """
        image.set_shape([self.new_image_height, self.new_image_width, self.image_channels])
        mask.set_shape([self.new_image_height, self.new_image_width, self.mask_channels])
        return image, mask

    def _read_and_decode_image_and_mask(self, image_path: str, mask_path: str):
        """
        Reads and decodes and image and its corresponding masks.
        :param image_path: (str) The image's filepath
        :param mask_path: (str) The mask's filepath
        :return: (tensors) Image and corresponding mask
        """
        # Read image and mask
        image = tf.io.read_file(image_path)
        mask = tf.io.read_file(mask_path)

        image = self.decode_image(contents=image, channels=self.image_channels)
        mask = self.decode_image(contents=mask, channels=self.mask_channels)
        image, mask = self._set_shape(image, mask)
        return image, mask

    def _crop_image_and_mask(self, image, mask):
        """Crops out a portion of the image and mask."""
        # crop image and mask
        if self.crop_image_and_mask and self.crop_dimension is not None:
            image = tf.image.crop_to_bounding_box(image, self.offset_height, self.offset_width,
                                                  self.target_height, self.target_width)

            # mask = tf.expand_dims(mask, axis=-1) if len(mask.shape) == 2 else mask

            mask = tf.image.crop_to_bounding_box(mask, self.offset_height, self.offset_width,
                                                 self.target_height, self.target_width)
        return image, mask

    def _resize_image_and_mask(self, image, mask):
        """Resize the image and mask to the predefined dimension."""
        if self.resize_images:
            image = tf.image.resize(images=image, size=(self.new_image_height, self.new_image_width),
                                    method='bilinear')
            image = tf.reshape(tensor=image, shape=(self.new_image_height, self.new_image_width, self.image_channels))

            # mask = tf.expand_dims(mask, axis=-1) if len(mask.shape) == 2 else mask
            mask = tf.image.resize(images=mask, size=(self.new_image_height, self.new_image_width),
                                   method='nearest')
            mask = tf.reshape(tensor=mask, shape=(self.new_image_height, self.new_image_width, self.mask_channels))
        return image, mask

    @staticmethod
    def _convert_to_float(image, mask):
        image = tf.image.convert_image_dtype(image, dtype=tf.float32)
        mask = tf.image.convert_image_dtype(mask, dtype=tf.float32)
        return image, mask

    @staticmethod
    def _convert_image_to_float(image, mask):
        image = tf.image.convert_image_dtype(image, dtype=tf.float32)
        return image, mask

    @staticmethod
    def _convert_to_uint8(image, mask):
        image = tf.image.convert_image_dtype(image, dtype=tf.uint8)
        mask = tf.image.convert_image_dtype(mask, dtype=tf.uint8)
        return image, mask

    def _step1_read_crop_and_resize(self, image_path: str, mask_path: str):
        """
        Reads and decodes and image and its corresponding masks.
        This function also assigns labels to the the background of the image, the pea's outline and its body. The labels
        are as follows:
        - background of image:  0
        - peas body: 1
        - pea outline:  2

        :param image_path: (str) path to an Image
        :param mask_path: (str) path to the mask that corresponds to the image
        :return: (Tensors) Two TF Tensors - one for the rgb image, and the other
            for the mask, with the pixel locations properly labelled as background (1)
            pea's body (1), or pea outline (3).
        """
        image, mask = self._read_and_decode_image_and_mask(image_path=image_path, mask_path=mask_path)
        image, mask = self._crop_image_and_mask(image=image, mask=mask)
        # image, mask = self._convert_image_to_float(image=image, mask=mask)
        image, mask = self._resize_image_and_mask(image=image, mask=mask)
        # image, mask = self._convert_to_float(image=image, mask=mask) if (
        #         self.crop_image_and_mask is False and self.resize_images is False) else (image, mask)
        image, mask = self._convert_to_float(image=image, mask=mask)
        return image, mask

    def _random_rotate(self, image, mask):
        """randomly rotates the image and mask"""
        if self.random_rotate:
            comb_tensor = tf.concat([image, mask], axis=-1)

            # determine whether to rotate image and mask
            cond_rotate = tf.cast(tf.random.uniform([], maxval=self.augmentation_prob, dtype=tf.int32), dtype=tf.bool)
            rotated_tensor = tf.cond(cond_rotate,
                                     true_fn=lambda: self.rotate(tf.expand_dims(comb_tensor, 0)),
                                     false_fn=lambda: tf.identity(tf.expand_dims(comb_tensor, 0)))

            rotated_tensor = tf.squeeze(rotated_tensor)
            image, mask = tf.split(rotated_tensor, [self.image_channels, self.mask_channels], axis=-1)
        return image, mask

    @staticmethod
    def _compute_crop_percent():
        return tf.random.uniform(shape=[], minval=0.5, maxval=1, dtype=tf.float32)

    def _random_crop(self, image, mask):
        """ Randomly crop image and mask in accord"""
        if self.random_crop:
            # compute a percentage by which the image would be cropped
            crop_percent = self._compute_crop_percent()

            # Get the shape of image, so it can be resized after random crop
            image_shape = image.shape
            height = image_shape[0]
            width = image_shape[1]

            # extract and convert the shape of the frame to decimals/floats
            shape = tf.cast(tf.shape(image), tf.float32)

            h = tf.cast(shape[0] * crop_percent, tf.int32)
            w = tf.cast(shape[1] * crop_percent, tf.int32)

            # concatenate the image and the mask
            comb_tensor = tf.concat([image, mask], axis=-1)

            # Generates a conditional if cond_crop_image is True or False
            cond_crop_image = tf.cast(tf.random.uniform([], maxval=self.augmentation_prob, dtype=tf.int32), tf.bool)

            comb_tensor = tf.cond(cond_crop_image,
                                  lambda: tf.image.random_crop(
                                      value=comb_tensor,
                                      size=[h, w, self.image_channels + self.mask_channels],
                                      seed=self.seed),
                                  lambda: tf.identity(comb_tensor))

            comb_tensor = tf.cond(cond_crop_image,
                                  lambda: tf.image.resize(images=comb_tensor, size=(height, width), method='nearest'),
                                  lambda: tf.identity(comb_tensor))

            image, mask = tf.split(comb_tensor, [self.image_channels, self.mask_channels], axis=-1)
            image, mask = self._set_shape(image, mask)

        return image, mask

    def _corrupt_brightness(self, image, mask):
        """Randomly applies a random brightness change"""
        if self.corrupt_brightness:
            # determine if the image's brightness should be altered.
            cond_brightness = tf.cast(tf.random.uniform([], maxval=self.augmentation_prob, dtype=tf.int32), tf.bool)

            image = tf.cond(cond_brightness,
                            lambda: tf.image.random_brightness(image, 0.2),
                            lambda: tf.identity(image))
        return image, mask

    def _corrupt_contrast(self, image, mask):
        """Randomly applies a random contrast the frame"""
        if self.corrupt_contrast:
            cond_contrast = tf.cast(tf.random.uniform([], maxval=self.augmentation_prob, dtype=tf.int32), tf.bool)
            image = tf.cond(cond_contrast,
                            lambda: tf.image.random_contrast(image, 0.1, 0.8),
                            lambda: tf.identity(image))
        return image, mask

    def _corrupt_saturation(self, image, mask):
        """Randomly adjusts the saturation of an image."""
        if self.corrupt_saturation:
            cond_saturation = tf.cast(tf.random.uniform([], maxval=self.augmentation_prob, dtype=tf.int32), tf.bool)
            image = tf.cond(cond_saturation,
                            lambda: tf.image.random_saturation(image, 0.1, 0.8),
                            lambda: tf.identity(image))
        return image, mask

    def _flip_left_right(self, image, mask):
        """
        Randomly flips image and mask left or fight in accord.
        """
        if self.flip_left_right:
            cond_flip_left_right = tf.cast(tf.random.uniform([], maxval=self.augmentation_prob, dtype=tf.int32),
                                           tf.bool)

            comb_tensor = tf.concat([image, mask], axis=2)
            comb_tensor = tf.cond(cond_flip_left_right,
                                  lambda: tf.image.random_flip_left_right(image=comb_tensor, seed=self.seed),
                                  lambda: tf.identity(comb_tensor))
            image, mask = tf.split(comb_tensor, [self.image_channels, self.mask_channels], axis=2)
        return image, mask

    def _flip_up_down(self, image, mask):
        """
        Randomly flip up side down
        """
        if self.flip_up_down:
            cond_flip_up_down = tf.cast(tf.random.uniform([], maxval=self.augmentation_prob, dtype=tf.int32), tf.bool)

            comb_tensor = tf.concat([image, mask], axis=2)
            comb_tensor = tf.cond(cond_flip_up_down,
                                  lambda: tf.image.random_flip_up_down(comb_tensor, seed=self.seed),
                                  lambda: tf.identity(comb_tensor))
            image, mask = tf.split(comb_tensor, [self.image_channels, self.mask_channels], axis=2)
        return image, mask

    def _augment_image_and_mask(self, image, mask):
        """Augments the image and mask."""
        if self.apply_data_augmentation:
            image, mask = self._random_rotate(image, mask)
            image, mask = self._random_crop(image, mask)
            image, mask = self._corrupt_brightness(image, mask)
            image, mask = self._corrupt_contrast(image, mask)
            image, mask = self._corrupt_saturation(image, mask)
            image, mask = self._flip_left_right(image, mask)
            image, mask = self._flip_up_down(image, mask)
            # image, mask = self._set_shape(image, mask)
        return image, mask

    def _save_data(self, index, image, mask):
        """saves the image and mask."""
        io.imsave(fname=f'{self.image_save_directory}/{self.image_save_prefix}_{index}.{self.image_save_format}',
                  arr=image, check_contrast=False)
        io.imsave(fname=f'{self.mask_save_directory}/{self.mask_save_prefix}_{index}.{self.image_save_format}',
                  arr=mask, check_contrast=False)
        return index

    def _tf_save_data(self, index, image, mask):
        index_shape = index.shape
        [index, ] = tf.py_function(func=self._save_data, inp=[index, image, mask], Tout=[tf.int64])
        index.set_shape(index_shape)
        return index

    # Get training, validation and test sets
    def _process_and_save_training_data(self, image_paths, mask_paths):
        """
        Prepares shuffled batches of the training set.

        :param image_paths: (list) paths to each image file in the training set
        :param mask_paths: (list) paths to each mask in the training set
        :return: tf Dataset containing the preprocessed training set
        """
        training_dataset = tf.data.Dataset.from_tensor_slices((image_paths, mask_paths))
        training_dataset = training_dataset.map(self._step1_read_crop_and_resize, num_parallel_calls=self.tune)
        training_dataset = training_dataset.cache(self.train_cache)
        training_dataset = training_dataset.repeat(count=self.iterations) if \
            self.apply_data_augmentation else training_dataset.repeat(count=1)
        training_dataset = training_dataset.map(self._augment_image_and_mask, num_parallel_calls=self.tune)
        training_dataset = training_dataset.map(self._convert_to_uint8, num_parallel_calls=self.tune)

        counter = tf.data.Dataset.counter(start=self.current_train_index)
        training_dataset = tf.data.Dataset.zip((counter, training_dataset))
        training_dataset = training_dataset.map(lambda x, y: (x, y[0], y[1]))
        self.training_dataset = training_dataset

        self.image_save_directory = self.train_subdirectories['images']
        self.mask_save_directory = self.train_subdirectories['masks']

        training_dataset = training_dataset.map(self._tf_save_data, num_parallel_calls=self.tune)
        training_dataset = training_dataset.prefetch(buffer_size=self.tune)
        list(training_dataset.as_numpy_iterator())
        print('\n\t1. Training images and masks saved')
        del training_dataset

    def _process_and_save_validation_data(self, image_paths, mask_paths):
        """
        Prepares shuffled batches of the training set.

        :param image_paths: (list) paths to each image file in the training set
        :param mask_paths: (list) paths to each mask in the training set
        :return: tf Dataset containing the preprocessed training set
        """
        validation_dataset = tf.data.Dataset.from_tensor_slices((image_paths, mask_paths))
        validation_dataset = validation_dataset.map(self._step1_read_crop_and_resize, num_parallel_calls=self.tune)
        validation_dataset = validation_dataset.cache(self.val_cache)
        validation_dataset = validation_dataset.repeat(count=self.iterations) if \
            self.augment_validation_data else validation_dataset.repeat(count=1)
        validation_dataset = validation_dataset.map(self._augment_image_and_mask, num_parallel_calls=self.tune) if \
            self.augment_validation_data else validation_dataset
        validation_dataset = validation_dataset.map(self._convert_to_uint8, num_parallel_calls=self.tune)

        counter = tf.data.Dataset.counter(start=self.current_val_index)
        validation_dataset = tf.data.Dataset.zip((counter, validation_dataset))
        validation_dataset = validation_dataset.map(lambda x, y: (x, y[0], y[1]))
        self.validation_dataset = validation_dataset

        self.image_save_directory = self.validation_subdirectories['images']
        self.mask_save_directory = self.validation_subdirectories['masks']

        validation_dataset = validation_dataset.map(self._tf_save_data, num_parallel_calls=self.tune)
        validation_dataset = validation_dataset.prefetch(buffer_size=self.tune)
        list(validation_dataset.as_numpy_iterator())
        print('\t2. Validation images and masks saved')
        del validation_dataset

    def _process_and_save_test_data(self, image_paths, mask_paths):
        """
        Prepares shuffled batches of the training set.

        :param image_paths: (list) paths to each image file in the training set
        :param mask_paths: (list) paths to each mask in the training set
        :return: tf Dataset containing the preprocessed training set
        """
        test_dataset = tf.data.Dataset.from_tensor_slices((image_paths, mask_paths))
        test_dataset = test_dataset.map(self._step1_read_crop_and_resize, num_parallel_calls=self.tune)
        test_dataset = test_dataset.cache(self.test_cache)
        test_dataset = test_dataset.repeat(count=self.iterations) if \
            self.augment_validation_data else test_dataset.repeat(count=1)
        test_dataset = test_dataset.map(self._augment_image_and_mask, num_parallel_calls=self.tune) if \
            self.augment_validation_data else test_dataset
        test_dataset = test_dataset.map(self._convert_to_uint8, num_parallel_calls=self.tune)

        counter = tf.data.Dataset.counter(start=self.current_test_index)
        test_dataset = tf.data.Dataset.zip((counter, test_dataset))
        test_dataset = test_dataset.map(lambda x, y: (x, y[0], y[1]))
        self.test_dataset = test_dataset

        self.image_save_directory = self.test_subdirectories['images']
        self.mask_save_directory = self.test_subdirectories['masks']

        test_dataset = test_dataset.map(self._tf_save_data, num_parallel_calls=self.tune)
        test_dataset = test_dataset.prefetch(buffer_size=self.tune)
        list(test_dataset.as_numpy_iterator())
        print('\t3. Test images and masks saved')
        del test_dataset

    def _process_images_and_masks(self):
        self._process_and_save_training_data(image_paths=self.training_image_paths,
                                             mask_paths=self.training_mask_paths)

        if self.val_directory and self.val_size > 0:
            self._process_and_save_validation_data(image_paths=self.validation_image_paths,
                                                   mask_paths=self.validation_mask_paths)

        if self.test_directory and self.test_size > 0:
            self._process_and_save_test_data(image_paths=self.test_image_paths,
                                             mask_paths=self.test_mask_paths)

    def process_data(self):
        print('\nProcess started . . . ', end='\n')
        self._process_images_and_masks()
        print(f'\nProcess completed!!\n')
        gc.collect()


