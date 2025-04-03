/**
 * Performs natural sorting of an array of objects based on a specific string key.
 * This is useful when filenames or labels contain numbers (e.g. image1, image10, image2).
 *
 * @param items - Array of objects to be sorted.
 * @param keyExtractor - Function that extracts the string key from each object.
 * @returns Array of objects sorted in natural (human-friendly) order.
 */
const sortByName = <T>(items: T[], keyExtractor: (item: T) => string): T[] => {
  return items.sort((a, b) => {
    const nameA = keyExtractor(a).toLowerCase();
    const nameB = keyExtractor(b).toLowerCase();

    // Extract numeric parts for natural sorting
    const matchA = nameA.match(/\d+/g);
    const matchB = nameB.match(/\d+/g);

    if (matchA && matchB) {
      // Compare numeric parts if both names contain numbers
      const numA = parseInt(matchA[0], 10);
      const numB = parseInt(matchB[0], 10);
      if (numA !== numB) return numA - numB;
    }

    // Fallback to standard alphabetical comparison
    return nameA.localeCompare(nameB);
  });
};

export default sortByName;
