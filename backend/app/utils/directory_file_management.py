import os
import shutil


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


def create_project_directories():
    """
    Create directory for the uploaded images and masks, for the augmented training, validation and testing datasets.
    :returns: dictionary with keys 'image_dir', 'mask_dir', 'train_dir', 'val_dir' and 'test_dir'.
    """
    # Directory setup
    image_dir = create_directory(dir_name='images', return_dir=True, overwrite_if_existing=True)
    mask_dir = create_directory(dir_name='masks', return_dir=True, overwrite_if_existing=True)
    augmented_dir = create_directory(dir_name='augmented', return_dir=True, overwrite_if_existing=True)

    train_dir = create_directory(dir_name=os.path.join(augmented_dir, 'train'),
                                 return_dir=True, overwrite_if_existing=False)

    val_dir = create_directory(dir_name=os.path.join(augmented_dir, 'val'),
                                 return_dir=True, overwrite_if_existing=False)

    test_dir = create_directory(dir_name=os.path.join(augmented_dir, 'test'),
                                 return_dir=True, overwrite_if_existing=False)

    visual_attribute_dir = create_directory(dir_name='visual_attributes',
                                 return_dir=True, overwrite_if_existing=False)

    return {'image_dir': image_dir,
            'mask_dir': mask_dir,
            'augmented_dir': augmented_dir,
            'train_dir': train_dir,
            'val_dir': val_dir,
            'test_dir': test_dir,
            'visual_attribute_dir': visual_attribute_dir}

def current_directory(file_path=None):
    """Returns a files current directory."""
    if file_path:
        return os.path.dirname(os.path.abspath(file_path))
    else:
        return os.getcwd()