import os
import re
import shutil

import attr

current_dir = os.path.dirname(__file__)
base_dir = os.path.abspath(os.path.join(current_dir, '../..'))

@attr.s
class DirectoryStore:
    asset_dir = attr.ib(type=str, default=os.path.join(base_dir, 'assets'))
    image_dir = attr.ib(type=str, init=False)
    mask_dir = attr.ib(type=str, init=False)

    resized_image_dir = attr.ib(type=str, init=False)
    resized_mask_dir = attr.ib(type=str, init=False)

    augmented = attr.ib(type=str, init=False)
    train_dir = attr.ib(type=str, init=False)
    train_image_dir = attr.ib(type=str, init=False)
    train_mask_dir = attr.ib(type=str, init=False)
    val_dir = attr.ib(type=str, init=False)
    val_image_dir = attr.ib(type=str, init=False)
    val_mask_dir = attr.ib(type=str, init=False)
    test_dir = attr.ib(type=str, init=False)
    test_image_dir = attr.ib(type=str, init=False)
    test_mask_dir = attr.ib(type=str, init=False)

    resized_augmented = attr.ib(type=str, init=False)
    resized_train_image_dir = attr.ib(type=str, init=False)
    resized_train_mask_dir = attr.ib(type=str, init=False)
    resized_val_image_dir = attr.ib(type=str, init=False)
    resized_val_mask_dir = attr.ib(type=str, init=False)
    resized_test_image_dir = attr.ib(type=str, init=False)
    resized_test_mask_dir = attr.ib(type=str, init=False)

    stratification_data_file_dir = attr.ib(type=str, init=False)

    def __attrs_post_init__(self):
        # Set the paths that depend on other attributes
        self.image_dir = os.path.join(self.asset_dir, 'images')
        self.mask_dir = os.path.join(self.asset_dir, 'masks')

        self.resized_image_dir = os.path.join(self.asset_dir, 'resized_images')
        self.resized_mask_dir = os.path.join(self.asset_dir, 'resized_masks')

        self.augmented = os.path.join(self.asset_dir, 'augmented')
        self.train_dir = os.path.join(self.augmented, 'train')
        self.train_image_dir = os.path.join(self.train_dir, 'images')
        self.train_mask_dir = os.path.join(self.train_dir, 'masks')
        self.val_dir = os.path.join(self.augmented, 'val')
        self.val_image_dir = os.path.join(self.val_dir, 'images')
        self.val_mask_dir = os.path.join(self.val_dir, 'masks')
        self.test_dir = os.path.join(self.augmented, 'test')
        self.test_image_dir = os.path.join(self.test_dir, 'images')
        self.test_mask_dir = os.path.join(self.test_dir, 'masks')

        self.resized_augmented = os.path.join(self.asset_dir, 'resized_augmented')
        self.resized_train_image_dir = os.path.join(self.resized_augmented, 'train', 'images')
        self.resized_train_mask_dir = os.path.join(self.resized_augmented, 'train', 'masks')
        self.resized_val_image_dir = os.path.join(self.resized_augmented, 'val', 'images')
        self.resized_val_mask_dir = os.path.join(self.resized_augmented, 'val', 'masks')
        self.resized_test_image_dir = os.path.join(self.resized_augmented, 'test', 'images')
        self.resized_test_mask_dir = os.path.join(self.resized_augmented, 'test', 'masks')

        self.stratification_data_file_dir = os.path.join(self.asset_dir, 'stratification')


# Initialize DirectoryStore instance
directory_store = DirectoryStore()


def create_directory(dir_name, return_dir=False, overwrite_if_existing=False):
    """
    Create a directory. To return the new directory path, input True for the 'return_dir'.

    :param dir_name: name of directory
    :param return_dir: boolean, True to return the name of the directory
    :param overwrite_if_existing: if the folder is existing, and the "overwrite_if_exiting" parameter is set to True, the
        existing directory will be deleted and replaced with a new one.
    :return: name of the directory
    """
    if overwrite_if_existing:
        pathname = dir_name if dir_name[-1] == '/' else dir_name + '/'
        if os.path.exists(os.path.dirname(pathname)):
            shutil.rmtree(os.path.dirname(pathname), ignore_errors=True)

    os.makedirs(dir_name, exist_ok=True)
    if return_dir:
        if dir_name[-1] != '/':
            return dir_name + '/'
        else:
            return dir_name


def delete_directory(dir_name, return_dir=False):
    """
    Deletes a directory. To return the name of the directory path, input True for the 'return_dir'.

    :param dir_name: name of directory
    :param return_dir: boolean, True to return the name of the directory
    :return: name of the directory
    """

    path_name = dir_name if dir_name[-1] == '/' else dir_name + '/'

    # confirm that the path belongs to a directory, then delete it.
    if os.path.isdir(path_name):
        shutil.rmtree(path=path_name, ignore_errors=True)
        if return_dir:
            return path_name
    else:
        print("Directory does not exist!")


def create_project_directories(return_dir=True, overwrite_if_existing=False):
    """
    Create directory for the uploaded images and masks, for the augmented training, validation and testing datasets.
    :returns: dictionary with keys 'image_dir', 'mask_dir', 'train_dir', 'val_dir' and 'test_dir'.
    """
    # Directory setup
    image_dir = create_directory(dir_name=directory_store.image_dir,
                                 return_dir=True,
                                 overwrite_if_existing=overwrite_if_existing)

    mask_dir = create_directory(dir_name=directory_store.mask_dir,
                                return_dir=True,
                                overwrite_if_existing=overwrite_if_existing)

    resized_image_dir = create_directory(dir_name=directory_store.resized_image_dir,
                                         return_dir=True,
                                         overwrite_if_existing=overwrite_if_existing)

    resized_mask_dir = create_directory(dir_name=directory_store.resized_mask_dir,
                                        return_dir=True,
                                        overwrite_if_existing=overwrite_if_existing)

    augmented_dir = create_directory(dir_name=directory_store.augmented,
                                     return_dir=True,
                                     overwrite_if_existing=overwrite_if_existing)

    train_dir = create_directory(dir_name=directory_store.train_dir,
                                 return_dir=True,
                                 overwrite_if_existing=overwrite_if_existing)

    val_dir = create_directory(dir_name=directory_store.val_dir,
                               return_dir=True,
                               overwrite_if_existing=overwrite_if_existing)

    test_dir = create_directory(dir_name=directory_store.test_dir,
                                return_dir=True,
                                overwrite_if_existing=overwrite_if_existing)

    visual_attribute_dir = create_directory(dir_name=directory_store.stratification_data_file_dir,
                                            return_dir=True,
                                            overwrite_if_existing=overwrite_if_existing)

    if return_dir:
        return {'image_dir': image_dir,
                'mask_dir': mask_dir,
                'resized_image_dir': resized_image_dir,
                'resized_mask_dir': resized_mask_dir,
                'augmented_dir': augmented_dir,
                'train_dir': train_dir,
                'val_dir': val_dir,
                'test_dir': test_dir,
                'visual_attribute_dir': visual_attribute_dir}


def create_resized_augmentation_directories(return_dir=True, overwrite_if_existing=False):
    """
    Create directory for resized augmented training, validation and testing datasets.
    :returns: dictionary with keys 'image_dir', 'mask_dir', 'train_dir', 'val_dir' and 'test_dir'.
    """
    # Directory setup

    resized_augmented_dir = create_directory(dir_name=directory_store.augmented, return_dir=True,
                                             overwrite_if_existing=overwrite_if_existing)

    resized_train_image_dir = create_directory(dir_name=directory_store.resized_train_image_dir, return_dir=True,
                                               overwrite_if_existing=overwrite_if_existing)

    resized_train_mask_dir = create_directory(dir_name=directory_store.resized_train_mask_dir, return_dir=True,
                                              overwrite_if_existing=overwrite_if_existing)

    resized_val_image_dir = create_directory(dir_name=directory_store.resized_val_image_dir, return_dir=True,
                                             overwrite_if_existing=overwrite_if_existing)

    resized_val_mask_dir = create_directory(dir_name=directory_store.resized_val_mask_dir, return_dir=True,
                                            overwrite_if_existing=overwrite_if_existing)

    resized_test_image_dir = create_directory(dir_name=directory_store.resized_test_image_dir, return_dir=True,
                                              overwrite_if_existing=overwrite_if_existing)

    resized_test_mask_dir = create_directory(dir_name=directory_store.resized_test_mask_dir, return_dir=True,
                                             overwrite_if_existing=overwrite_if_existing)

    if return_dir:
        return {'resized_augmented_dir': resized_augmented_dir,
                'resized_train_image_dir': resized_train_image_dir,
                'resized_train_mask_dir': resized_train_mask_dir,
                'resized_val_image_dir': resized_val_image_dir,
                'resized_val_mask_dir': resized_val_mask_dir,
                'resized_test_image_dir': resized_test_image_dir,
                'resized_test_mask_dir': resized_test_mask_dir}


def current_directory(file_path=None):
    """Returns a files current directory."""
    if file_path:
        return os.path.dirname(os.path.abspath(file_path))
    else:
        return os.getcwd()


def sort_filenames(file_paths):
        return sorted(file_paths, key=lambda var: [
            int(x) if x.isdigit() else x.lower() for x in re.findall(r'\D+|\d+', var)
        ])


def list_filenames(directory_path):
    """Returns a list containing the names of all files in the directory."""
    return os.listdir(directory_path)


def get_sorted_filepaths(images_dir):
    """
    Generates the sorted list of path for images within a specified directory.

    :param images_dir: a directory containing images
    :return: Returns a list containing the file path for the images
    """
    image_file_list = os.listdir(path=images_dir)
    image_paths = [os.path.join(images_dir, filename) for filename in image_file_list]

    # sort the file paths in ascending order
    image_paths = sort_filenames(image_paths)

    return image_paths


def get_sorted_filenames(directory_path):
    """
    Generates the sorted list of names of files within a specified directory.

    :param directory_path: a directory containing images
    :return: Returns a list containing the file path for the images
    """
    image_file_list = os.listdir(path=directory_path)

    # sort the file paths in ascending order
    return sort_filenames(image_file_list)


def directory_exit(dir_path):
    """
    Checks if a direct exists
    :param dir_path: Path to the directory.
    :return: True, if directory exists, else False.
    """
    return os.path.exists(dir_path)


def delete_file(filepath):
    if os.path.exists(filepath):
        os.remove(filepath)

