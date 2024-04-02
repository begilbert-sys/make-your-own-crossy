export function shuffleArray(array: any[]) {
    /* randomly shuffle an array. return a copy of the shuffled array */
    const copyList = [...array];
    for (let max = copyList.length - 1; max >= 0; max--) {
        const randomIndex = Math.floor(Math.random() * (max + 1));
        const val = copyList[randomIndex];
        copyList[randomIndex] = copyList[max];
        copyList[max] = val;
    }
    return copyList;
}