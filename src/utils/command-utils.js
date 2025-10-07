export function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}
// function updateItem(items) {
//   return items.map((item) => item.isFavorite === true ? console.log(item.id) : item);
// }
// updateItem(this.points)

export function updateItem (items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}
