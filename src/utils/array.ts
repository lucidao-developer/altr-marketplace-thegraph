export function removeFromArray(array: string[], element: string): string[] {
    let index = searchString(array, element);

    if (index != -1) {
        array.splice(index, 1);
    }
    return array;
}

export function searchString(array: string[], element: string): i32 {
    let index = -1;
    for (let i = 0; i < array.length; i++) {
        if (array[i] == element) {
            index = i;
        }
    }
    return index as i32;
}

export function searchNumber(array: number[], element: number): i32 {
    let index = -1;
    for (let i = 0; i < array.length; i++) {
        if (array[i] == element) {
            index = i;
        }
    }
    return index as i32;
}
