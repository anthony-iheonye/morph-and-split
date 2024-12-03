import os
import re
from typing import Union, Tuple

import numpy as np
import tensorflow as tf
from skimage import io

from app.utils import create_directory


class ImageOrMaskDatasetCreator:
    def __init__(self,
                 image_directory: str = None,
                 image_format: str = 'png',
                 no_of_image_channels: int = 3,
                 final_image_shape: Tuple[int, int] = None,
                 resize_method: str = 'bilinear',
                 crop_dimension: Tuple[int, int, int, int] = None,
                 batch_size: int = None,
                 normalize_output: bool = False,
                 normalize_using_255: bool = True,
                 shuffle: bool = False,
                 buffer_size: int = 500,
                 prefetch_data: bool = False,
                 add_label_channels_to_mask: bool = False,
                 return_type: tf.DType = tf.uint8,
                 cache_directory: Union[str, None] = '',
                 crop_multiple_images_from_parent_image: bool = False,
                 crop_grid: Tuple[int, int] = (2, 2),
                 child_image_dimension: Union[Tuple[int, int], None] = (512, 512),
                 start_save_index: int = 1,
                 save_directory: str = None,
                 image_save_prefix: str = 'img',
                 image_save_format: str = 'png'):

        """
        Class for creating a Tensorflow dataset that is made up of either images or masks. The dataset could be batched
        or not. It could be produced as a 3-channel dataset or 1-channel (grayscale) dataset. All the input images/mask
        must be of the same shape.

        :param resize_method: (str, Callable) An image.ResizeMethod, or string equivalent. Defaults to bilinear.
            The other resize_methods in string form are:

                - bilinear: Bilinear interpolation. If antialias is true, becomes a hat/tent filter function
                with radius 1 when downsampling.
                - lanczos3: Lanczos kernel with radius 3. High-quality practical filter but may have
                some ringing, especially on synthetic images.
                - lanczos5: Lanczos kernel with radius 5. Very-high-quality filter but may have stronger ringing.
                - bicubic: Cubic interpolant of Keys. Equivalent to Catmull-Rom kernel. Reasonably
                good quality and faster than Lanczos3Kernel, particularly when upsampling.
                - gaussian: Gaussian kernel with radius 3, sigma = 1.5 / 3.0.
                - nearest: Nearest neighbor interpolation. antialias has no effect when used with
                nearest neighbor interpolation.
                - area: Anti-aliased resampling with area interpolation. antialias has no effect
                when used with area interpolation; it always anti-aliases.
                - mitchellcubic: Mitchell-Netravali Cubic non-interpolating filter. For synthetic
                images (especially those lacking proper prefiltering), less ringing than Keys cubic kernel but less sharp.

        :param crop_multiple_images_from_parent_image: (bool) If True, new images would be cropped from the input image.
            If final_image_shape is set, the new images would be cropped from the original image after it has been resized to
            the final_image_shape.
        :param crop_grid: (tuple) The [number_of_images_per_column, number_of_images_per_row] that would be generated
            from the input image
        :param image_save_prefix: (str) prefix for saving the images
        :param image_save_format: (str) the format for saving the images
        :param add_label_channels_to_mask: (bool) This functionality is only used if the image_directory contains masks.
            If add_label_channels_to_mask is set to True, the output mask is made up of n-channels. Where n is the
            number of classes in the mask. The assumption here is that each mask must contain all the classes.
        :param image_directory: (str) Directory containing the rgb or grayscale images
        :param image_format: (str) The format of the rgb images. Formats allowed are BMP, JPEG, or PNG.
        :param batch_size: Batch shape for creating the dataset. If None, the output dataset is not batched.
        :param no_of_image_channels: (int) Number of color channels that make the rgb image. If the original
            is an rgb image made up of 3-channels, to produce a 3-channel dataset, no_of_image_channels must be
            set to 3. On the other hand, for the same 3-channel input image, to produce a 1-channel (grayscale) dataset
            set no_of_image_channels to 1.
        :param normalize_output: (bool) If True, the output image/mask would be normalized.
        :param normalize_using_255: (bool) if True, the images are normalized to [0, 1] by dividing them by 255.0, else
            they are normalized to [-1, 1] using 127.5.
        :param crop_dimension: (Tuple): A tuple (offset_height, offset_width, target_height, target_width) containing
            the region to be for cropped. The value for my initial image set from the 1st - 4th experiment was
            (0, 450, 2000, 2000), while the value for the 5th experiment was (0, 400, 2000, 2000).
        :param final_image_shape: (Tuple) The final shape of the image after reshaping.

        """
        self.image_save_format = image_save_format
        self.image_save_prefix = image_save_prefix
        self.start_save_index = start_save_index
        self.crop_multiple_images_from_parent_image = crop_multiple_images_from_parent_image
        self.child_image_dimension = child_image_dimension
        self.crop_grid = crop_grid
        self.resize_method = resize_method

        if cache_directory == "":
            self.cache_directory = cache_directory
        elif cache_directory is None:
            self.cache_directory = None

        else:
            self.cache_directory = create_directory(dir_name=cache_directory, return_dir=True,
                                                    overwrite_if_existing=True)

        self.prefetch_data = prefetch_data
        self.buffer_size = buffer_size
        self.shuffle = shuffle

        if crop_dimension is not None:
            self.crop_image = True
            self.crop_dimension = crop_dimension
            self.offset_height = crop_dimension[0]
            self.offset_width = crop_dimension[1]
            self.target_height = crop_dimension[2]
            self.target_width = crop_dimension[3]

        else:
            self.crop_image = False
            self.crop_dimension = 'None'

        self.return_type = return_type
        self.image_directory = image_directory

        self.image_format = image_format
        # select the appropriate function for decoding the image
        if self.image_format.lower() in ['jpeg', 'jpg']:
            self.decode_image = tf.image.decode_jpeg
        elif self.image_format.lower() == 'png':
            self.decode_image = tf.image.decode_png
        elif self.image_format.lower() == 'bmp':
            self.decode_image = tf.image.decode_bmp
        else:
            self.decode_image = tf.image.decode_png

        self.images_paths = []
        self.number_of_images = None
        self.tune = tf.data.experimental.AUTOTUNE
        self.image_channels = no_of_image_channels

        self.normalize_output = normalize_output
        self.normalize_using_255 = normalize_using_255

        if normalize_output and not add_label_channels_to_mask:
            self.apply_normalization = True
        else:
            self.apply_normalization = False

        self.image_dataset = None
        self.batch_size = batch_size
        self.add_label_channels = add_label_channels_to_mask
        self.unique_intensities = None

        self.image_shape = None

        # " if image_directory is not None:" is introduced for class inheritance purpose, when we want to use
        # other method but on supply image_directory.
        if image_directory is not None:
            self._get_filepath_to_images()

            if final_image_shape is not None:
                self.final_image_shape = final_image_shape + (self.image_channels,)
                self.height = tuple(self.final_image_shape)[0]
                self.width = tuple(self.final_image_shape)[1]

                if tuple(self.image_shape) != self.final_image_shape:
                    self.reshape_image = True
                else:
                    self.reshape_image = False
            else:
                self.reshape_image = False
                self.final_image_shape = self.image_shape
                self.height = tuple(self.final_image_shape)[0]
                self.width = tuple(self.final_image_shape)[1]

        if crop_multiple_images_from_parent_image:
            self.child_image_shape = child_image_dimension
            self.cropped_dataset = None
            self.save_directory = create_directory(dir_name=save_directory, return_dir=True)

            self.crop_dimension_list = produce_multiple_crop_dimensions(
                parent_image_shape=self.final_image_shape[:2], new_image_shape=child_image_dimension,
                resulting_image_grid=crop_grid)
            self.images_per_grids = crop_grid[0] * crop_grid[1]

        self.process_data()

    @staticmethod
    def sort_filenames(file_paths):
        return sorted(file_paths, key=lambda var: [
            int(x) if x.isdigit() else x.lower() for x in re.findall(r'\D+|\d+', var)
        ])

    def _get_and_sort_filepaths_to_images(self, images_dir):
        """
        Generates the list of path for images within a specified directory.

        :param images_dir: a directory containing images
        :return: Returns a list containing the file path for the images
        """
        image_file_list = os.listdir(path=images_dir)
        image_paths = [os.path.join(images_dir, filename) for filename in image_file_list]

        # sort the file paths in ascending order
        image_paths = self.sort_filenames(image_paths)

        return image_paths

    def get_image_unique_intensities(self, image_path):
        """Return the unique pixel intensity for an image."""
        image = self._read_and_decode_image(image_path=image_path)
        return np.unique(image).tolist()

    @property
    def class_labels(self):
        if self.unique_intensities is None:
            self.get_dataset_class_labels()
        return self.unique_intensities

    def get_dataset_class_labels(self):
        """
        Compute the unique pixel intensities on all the images in the dataset.

         For the operation, instead of using all images in the dataset,
         we either the first 20 images, or 10% of the images, whichever is smaller.
        """
        # check the unique intensities of the first fifty or 10% of the image (the larger number)
        num = max(50, (self.number_of_images // 10) + 1)
        img_paths = self.images_paths[:num]

        unique_intensities = set()

        for path in img_paths:
            unique_intensities.update(self.get_image_unique_intensities(path))
        self.unique_intensities = unique_intensities

    def _get_filepath_to_images(self):
        """
        Get the list of filepaths for the images
        """
        # create lists of file paths for the images.
        self.images_paths = self._get_and_sort_filepaths_to_images(images_dir=self.image_directory)

        self.number_of_images = len(self.images_paths)

        # compute the image shape
        image = self._read_and_decode_image(image_path=self.images_paths[0])
        self.image_shape = image.shape
        self.image_channels = tuple(self.image_shape)[2]

        # To assign separate channels for each class, get the unique pixel
        # intensity for each class in the mask.
        if self.add_label_channels:
            self.get_dataset_class_labels()

    def _read_and_decode_image(self, image_path: str):
        """
        Reads and decodes an image.

        :param image_path: (str) The image's filepath
        :return: (tensors) RGB or grayscale Image
        """
        # Read image and mask
        image = tf.io.read_file(image_path)
        rgb_image = self.decode_image(image, channels=self.image_channels)
        rgb_image.set_shape(shape=self.image_shape)
        return rgb_image

    def _crop_image(self, image):
        """Crops out a portion of the image and mask."""
        # crop image
        if self.crop_image:
            image = tf.image.crop_to_bounding_box(image, self.offset_height, self.offset_width,
                                                  self.target_height, self.target_width)
        return image

    @staticmethod
    def crop_sub_image(image, crop_dimension: Tuple[int, int, int, int]):
        """Crops out a portion of the image and mask."""

        offset_height, offset_width, target_height, target_width = crop_dimension
        # crop image
        image = tf.image.crop_to_bounding_box(image, offset_height, offset_width,
                                              target_height, target_width)

        return image

    def crop_multiple_images_from_image(self, image):

        new_images_list = []

        for crop_dimension in self.crop_dimension_list:
            new_image = self.crop_sub_image(image, crop_dimension=crop_dimension)
            new_images_list.append(new_image)

        return new_images_list

    def _reshape_image(self, image):
        """Reshape the image and mask to the predefined dimension."""
        if self.reshape_image:
            if len(image.shape) == 2:
                image = tf.expand_dims(image, axis=-1) if image.ndim == 2 else image
                image = tf.image.resize(images=image, size=(self.height, self.width), method=self.resize_method)
                image = tf.reshape(tensor=image, shape=(self.height, self.width))
            else:
                image = tf.image.resize(images=image, size=(self.height, self.width), method=self.resize_method)
                image = tf.reshape(tensor=image, shape=(self.height, self.width, self.image_channels))

            image = tf.cast(image, dtype=self.return_type)
        return image

    def _add_label_channels_to_mask(self, mask):
        """Adds label channels to the mask."""

        mask = tf.cast(mask, dtype=tf.uint8)
        stack_list = []

        # Create individual tensor array for each class. Each tensor would display the area on the original
        # mask that is occupied by individual classes. if we have three class - background, pea, and outline,
        # we would have three tensor arrays.
        # for class_index in range(self.number_of_classes):
        for intensity in self.unique_intensities:
            # Produce a temporary mask depicting all the pixel locations on the original tensor named 'mask'
            # that have the same pixel intensity as  the integer 'class_index'. we want to
            temp_mask = tf.equal(mask[..., 0], tf.constant(intensity, dtype=tf.uint8))
            # add each temporary mask to the stack_list.
            stack_list.append(tf.cast(temp_mask, dtype=self.return_type))

        # stack all the temporary masks within the stack_list, so together they form the third axis of the
        # overall mask. Hence, the overall mask would be of dimension [height, width, number_of_classes]
        mask = tf.stack(stack_list, axis=-1)  # Axis starts from 0, so axis of 2 represents the third axis
        return mask

    def _normalize_image(self, image):
        """Normalizes the pixel values of image to lie between [0, 1] or [-1, 1]."""
        if self.normalize_using_255:
            image = tf.cast(image, dtype=tf.float32) / 255.0
        else:
            image = tf.cast(image, dtype=tf.float32) / 127.5
            image -= 1
        return image

    def _prepare_initial_dataset(self, image_path: str):
        """
        Prepares the dataset
        """
        image = self._read_and_decode_image(image_path=image_path)
        image = self._crop_image(image=image)
        image = self._reshape_image(image=image)
        image = self._add_label_channels_to_mask(mask=image) if self.add_label_channels else image
        image = self._normalize_image(image=image) if self.apply_normalization else image
        return image

    @tf.function
    def _step1_read_detect_crop_and_reshape(self, image_path: str):
        """
        The function does the following:
            -   Reads the location of the image and grayscale mask
            -   Labels the edges on the mask as '2', and the body of the peas as '1'.
            -   crops the image and mask, if stipulated, and
            -   Reshapes the image and mask to the stipulated shape

        :param image_path: (str) - path to the image
        :return: (Tensors) Image and processed mask
        """
        image = self._prepare_initial_dataset(image_path)
        return image

    def _save_image(self, index, images):
        # saves image

        n = index
        for image in images:
            if image.shape[-1] == 1:
                image = np.squeeze(image)

            io.imsave(fname=f'{self.save_directory}/{self.image_save_prefix}_{n}.{self.image_save_format}',
                      arr=image, check_contrast=False)
            n += 1
        return index

    def _tf_save_image(self, index, images):
        index_shape = index.shape
        [index_ans, ] = tf.py_function(func=self._save_image, inp=[index, images], Tout=[tf.int64])
        index_ans.set_shape(index_shape)
        return index_ans

    def _get_dataset(self, image_paths):
        """
        Prepares batches of the validation set.

        :param image_paths: (list) paths to each image file in the validation set
        :param mask_paths: (list) paths to each mask in the validation set
        :return: tf Dataset containing the preprocessed validation set
        """
        dataset = tf.data.Dataset.from_tensor_slices(image_paths)
        dataset = dataset.map(self._step1_read_detect_crop_and_reshape,
                              num_parallel_calls=self.tune)

        if self.crop_multiple_images_from_parent_image:
            self.cropped_dataset = dataset.map(self.crop_multiple_images_from_image, num_parallel_calls=self.tune)

        dataset = dataset.take(count=-1)
        dataset = dataset.cache(filename=self.cache_directory) if self.cache_directory is not None else dataset
        dataset = dataset.shuffle(buffer_size=self.buffer_size) if self.shuffle else dataset
        dataset = dataset.batch(batch_size=self.batch_size, drop_remainder=True) if self.batch_size is not None \
            else dataset
        dataset = dataset.prefetch(self.tune) if self.prefetch_data else dataset
        dataset = dataset.repeat() if self.prefetch_data else dataset
        return dataset


    def _produce_dataset(self):
        """
        Produces the images-masks datasets.
        """
        self.image_dataset = self._get_dataset(image_paths=self.images_paths)

    def _save_multiple_cropped_image_dataset(self):
        """
        Prepares shuffled batches of the training set.

        :param image_paths: (list) paths to each image file in the training set
        :param mask_paths: (list) paths to each mask in the training set
        :return: tf Dataset containing the preprocessed training set
        """
        # create counter for the image and mask name
        # counter = tf.data.experimental.Counter(start=self.start_save_index, step=self.images_per_grids)
        counter = tf.data.Dataset.counter(start=self.start_save_index, step=self.images_per_grids)
        dataset = tf.data.Dataset.zip((counter, self.cropped_dataset))
        dataset = dataset.map(self._tf_save_image, num_parallel_calls=self.tune)
        dataset = dataset.prefetch(buffer_size=self.tune)
        return dataset

    def process_data(self):
        """Read and stack the images/marks into a dataset."""
        self._produce_dataset()

        if self.crop_multiple_images_from_parent_image:
            dataset = self._save_multiple_cropped_image_dataset()
            list(dataset.as_numpy_iterator())


class ImageCropperResizerAndSaver:
    def __init__(self, images_directory: str, save_directory: str, initial_save_id: int,
                 no_of_image_channels: int = 3, crop_dimension: Tuple[int, int, int, int] = None,
                 final_image_size: Tuple[int, int] = None, image_original_format: str = 'jpg',
                 image_save_prefix: str = 'img', image_save_format: str = 'png', cache_dir=None):
        """
        This Class contains methods that are used to crop, resize and re-save a collection of images.
        If the image is cropped, after cropping the result is automatically resized to the
        'final_image_size', if its given. Else, the image would be saved using the new size, after cropping.
        if final_image_size is given, the output image would be resized to match the final_image_size .

        :param image_original_format: (str) The original format of the input images. The image formats allowed are BMP, JPEG, JPG or PNG.
        :param images_directory: (str): Path to directory containing the original images.
        :param save_directory: (str) path to the directory where the output images would be saved.
        :param no_of_image_channels: The number of image channels.
        :param image_save_prefix: (str): Prefix for saving the images. By default, it is left blank.
        :param image_save_format: (str): File format for saving the processed images. By default, it is set to 'jpg'
        :param crop_dimension: (Tuple): A tuple (offset_height, offset_width, target_height, target_width) containing
            the region to be for cropped. The value for my pea experiment is (0, 450, 2000, 2000). if values for crop_dimension is supplied,
            the images would be cropped, else, they wouldn't be.
        :param cache_dir: (str) directory where the images would be cached. if its set to None, the image dataset would be cached in the ram.

        """
        self.final_image_size = final_image_size
        self.auto_tune = tf.data.AUTOTUNE
        self.images_directory = images_directory
        self.save_directory = create_directory(dir_name=save_directory, return_dir=True,
                                               overwrite_if_existing=False)
        self.original_image_paths = None
        self.original_mask_paths = None

        self.no_of_image_channels = no_of_image_channels
        self.image_channels = self.no_of_image_channels
        self.image_save_prefix = image_save_prefix
        self.image_save_format = image_save_format

        self.image_original_format = image_original_format

        # select the appropriate function for decoding the image
        if self.image_original_format.lower() in ['jpeg', 'jpg']:
            self.decode_image = tf.image.decode_jpeg
        elif self.image_original_format.lower() == 'png':
            self.decode_image = tf.image.decode_png
        else:
            self.decode_image = tf.image.decode_bmp

        self.crop_dimension = crop_dimension

        # Create an object of the ImageOrMaskDatasetCreator
        dataset_creator = ImageOrMaskDatasetCreator(image_directory=images_directory,
                                                    image_format=image_original_format,
                                                    no_of_channels_in_rgb_image=no_of_image_channels,
                                                    final_image_size=final_image_size, crop_dimension=crop_dimension)
        dataset_creator.process_data()
        self.image_dataset = dataset_creator.image_dataset
        self.counter_image_dataset = None

        self.current_image_index = initial_save_id

        if cache_dir is not None:
            self.cache_directory = create_directory(dir_name=cache_dir, return_dir=True, overwrite_if_existing=True)
        else:
            self.cache_directory = ''

    def _save_image(self, index, image):
        # saves image
        io.imsave(fname=f'{self.save_directory}/{self.image_save_prefix}_{index}.{self.image_save_format}',
                  arr=image, check_contrast=False)
        return index

    def _tf_save_image(self, index, image):
        index_shape = index.shape
        [index_ans, ] = tf.py_function(func=self._save_image, inp=[index, image], Tout=[tf.int64])
        index_ans.set_shape(index_shape)
        return index_ans

    def _process_and_save_image_mask_dataset(self):
        """
        Prepares shuffled batches of the training set.

        :return: tf Dataset containing the preprocessed training set
        """
        # create counter for the image and mask name
        counter = tf.data.experimental.Counter(start=self.current_image_index)

        dataset = tf.data.Dataset.zip((counter, self.image_dataset))
        dataset = dataset.cache(filename=self.cache_directory)
        dataset = dataset.map(self._tf_save_image, num_parallel_calls=self.auto_tune)
        dataset = dataset.prefetch(buffer_size=self.auto_tune)
        return dataset

    def process_data(self):
        dataset = self._process_and_save_image_mask_dataset()
        # saves the images and masks
        list(dataset.as_numpy_iterator())


def produce_multiple_crop_dimensions(parent_image_shape: tuple[int, int], new_image_shape: tuple[int, int],
                                     resulting_image_grid: tuple[int, int] = (2, 2)):
    """produces a list containing list of crop dimension to the crop the child images from the parent image.

    :param parent_image_shape: (tuple) The [height, width] of the parent image
    :param new_image_shape: (tuple) The [height, width] of the new images
    :param resulting_image_grid: (tuple) The [number_of_images_per_column, number_of_images_per_row] that would be generated from the input image
    """

    parent_image_height = parent_image_shape[0]
    parent_image_width = parent_image_shape[1]

    new_image_height = new_image_shape[0]
    new_image_width = new_image_shape[1]

    images_per_row = resulting_image_grid[1]
    images_per_column = resulting_image_grid[0]

    horizontal_delta = (parent_image_width - (new_image_width * images_per_row)) // (images_per_row - 1)
    vertical_delta = (parent_image_height - (new_image_height * images_per_column)) // (images_per_column - 1)

    horizontal_interval = new_image_width + horizontal_delta
    vertical_interval = new_image_height + vertical_delta

    horizontal_points = [horizontal_interval * idx for idx in range(0, images_per_row)]
    vertical_points = [vertical_interval * idx for idx in range(0, images_per_column)]

    crop_dimension_list = []
    for h_point in horizontal_points:
        for v_point in vertical_points:
            crop_dimension_list.append([v_point, h_point, new_image_height, new_image_width])

    return crop_dimension_list



