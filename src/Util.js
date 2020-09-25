

export class Util {

    //вроде state of the art id генератор
     static uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

      //https://dev.to/afewminutesofcode/how-to-create-a-custom-sort-order-in-javascript-3j1p
      //буду использовать в журнале
      static customSort = ({data, sortBy, sortField}) => {
       /* const sortByObject = sortBy.reduce(
        (obj, item, index) => ({
            ...obj,
            [item]: index
        }), {})*/
        return data.sort((a, b) => a[sortField] - b[sortField])
      }
  
}