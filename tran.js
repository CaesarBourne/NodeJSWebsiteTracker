// function minimumSwaps(arr) {

//   var counter = 0;
  
//   for (var i = arr.length; i > 0; i--) {
//   var minval = Math.max(...arr);
  
//   var minIndex = arr.indexOf(minval);
//   if (minval !== arr[0]) {
//   var temp = arr[0];
//   arr[0] = arr[minIndex];
//   arr[minIndex] = temp;
  
//   arr.splice(0, 1);
//   counter++;
//   }
//   else {
//   arr.splice(0, 1); 
//   }
  
//   } return counter;
//   }
//   console.log(minimumSwaps([ 4,3,2,1] ));
function minimumSwaps(ratings) {

  var swaps = 0;
  
  for (var i = ratings.length; i > 0; i--) {
  var lowestValue = Math.max(...ratings);
  

  function addItem(itemName, quantity, price){
    itemName = typeof(price) == "number"
//    var tot = new Total();
    this.total += price
    this.items = {
      itemName: "quantity"
    }

  var lowestPosition = ratings.indexOf(lowestValue);
  if (lowestValue !== ratings[0]) {
  let temporaryValue = ratings[0];
  ratings[0] = ratings[lowestPosition];
  ratings[lowestPosition] = temporaryValue;
  
  ratings.splice(0, 1);
  swaps++;
  }
  else {
  ratings.splice(0, 1); 
  }
  
  } return swaps;
  }