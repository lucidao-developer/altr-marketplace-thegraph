export function removeFromArray<T>(array: T[] | null, element: T): T[] {
  if (array === null) {
    array = [];
  }

  let index = search(array, element);

  if (index != -1) {
    array.splice(index, 1);
  }
  return array;
}

export function removeFromArrayByIndex<T>(array: T[] | null, index: i32): T[] {
  if (array === null) {
    array = [];
  }
  array.splice(index, 1);
  return array;
}

export function search<T>(array: T[] | null, element: T): i32 {
  let index = -1;
  if (array === null) {
    array = [];
  }
  for (let i = 0; i < array.length; i++) {
    if (array[i] == element) {
      index = i;
    }
  }
  return index as i32;
}

export function pushToArray<T>(array: T[] | null, element: T): T[] {
  if (array === null) {
    array = [];
  }
  array.push(element);
  return array;
}
