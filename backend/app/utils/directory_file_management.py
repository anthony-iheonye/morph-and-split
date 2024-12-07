import os
import re
import shutil

import attr


@attr.s
class DirectoryStore:
    image_dir = attr.ib(type=str, default='images/')
    mask_dir = attr.ib(type=str, default='masks/')
    resized_image_dir = attr.ib(type=str, default='resized_images/')
    resized_mask_dir = attr.ib(type=str, default='resized_masks/')
    augmented = attr.ib(type=str, default='augmented/')
    train_dir = attr.ib(type=str, default='augmented/train/')
    val_dir = attr.ib(type=str, default='augmented/val/')
    test_dir = attr.ib(type=str, default='augmented/test/')
    visual_attributes_dir = attr.ib(type=str, default='visual_attributes/')
    resized_augmented = attr.ib(type=str, default='resized_augmented/')
    resized_train_image_dir = attr.ib(type=str, default='resized_augmented/train/image')
    resized_train_mask_dir = attr.ib(type=str, default='resized_augmented/train/mask')
    resized_val_image_dir = attr.ib(type=str, default='resized_augmented/val/image')
    resized_val_mask_dir = attr.ib(type=str, default='resized_augmented/val/mask')
    resized_test_image_dir = attr.ib(type=str, default='resized_augmented/test/image')
    resized_test_mask_dir = attr.ib(type=str, default='resized_augmented/test/mask')


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

    train_dir = create_directory(dir_name=os.path.join(augmented_dir, 'train'),
                                 return_dir=True,
                                 overwrite_if_existing=overwrite_if_existing)

    val_dir = create_directory(dir_name=os.path.join(augmented_dir, 'val'),
                               return_dir=True,
                               overwrite_if_existing=overwrite_if_existing)

    test_dir = create_directory(dir_name=os.path.join(augmented_dir, 'test'),
                                return_dir=True,
                                overwrite_if_existing=overwrite_if_existing)

    visual_attribute_dir = create_directory(dir_name='visual_attributes', return_dir=True,
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

    resized_augmented_dir = create_directory(dir_name=directory_store.augmented,
                                     return_dir=True,
                                     overwrite_if_existing=overwrite_if_existing)

    resized_train_image_dir = create_directory(dir_name=os.path.join(resized_augmented_dir, 'train', 'images'),
                                 return_dir=True,
                                 overwrite_if_existing=overwrite_if_existing)

    resized_train_mask_dir = create_directory(dir_name=os.path.join(resized_augmented_dir, 'train', 'masks'),
                                 return_dir=True,
                                 overwrite_if_existing=overwrite_if_existing)

    resized_val_image_dir = create_directory(dir_name=os.path.join(resized_augmented_dir, 'val', 'images'),
                               return_dir=True,
                               overwrite_if_existing=overwrite_if_existing)

    resized_val_mask_dir = create_directory(dir_name=os.path.join(resized_augmented_dir, 'val', 'masks'),
                               return_dir=True,
                               overwrite_if_existing=overwrite_if_existing)

    resized_test_image_dir = create_directory(dir_name=os.path.join(resized_augmented_dir, 'test', 'images'),
                                return_dir=True,
                                overwrite_if_existing=overwrite_if_existing)

    resized_test_mask_dir = create_directory(dir_name=os.path.join(resized_augmented_dir, 'test', 'masks'),
                                return_dir=True,
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


def get_sorted_filenames(images_dir):
    """
    Generates the sorted list of path for images within a specified directory.

    :param images_dir: a directory containing images
    :return: Returns a list containing the file path for the images
    """
    image_file_list = os.listdir(path=images_dir)

    # sort the file paths in ascending order
    return sort_filenames(image_file_list)





