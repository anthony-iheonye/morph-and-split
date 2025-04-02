/**
 * Function to perform natural sorting of objects based on a specific key.
 * @param items - Array of objects to be sorted.
 * @param keyExtractor - Function that extracts the string key for sorting.
 * @returns Array of objects sorted in natural order.
 */
const sortByName = <T>(items: T[], keyExtractor: (item: T) => string): T[] => {
  return items.sort((a, b) => {
    const nameA = keyExtractor(a).toLowerCase();
    const nameB = keyExtractor(b).toLowerCase();

    // Extract numeric part ofr natural sorting
    const matchA = nameA.match(/\d+/g);
    const matchB = nameB.match(/\d+/g);

    if (matchA && matchB) {
      // compare numeric parts if both nanes contain numbers
      const numA = parseInt(matchA[0], 10);
      const numB = parseInt(matchB[0], 10);
      if (numA != numB) return numA - numB;
    }

    // Fallback to normal string comparison
    return nameA.localeCompare(nameB);
  });
};

export default sortByName;
