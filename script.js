class Item {
  constructor(name, quantity, category, tier, element){
    this._name = name;
    this._quantity= quantity;
    this._category = category;
    this._tier= tier;
    this._element= element;
  }

  get quantity(){
    return this._quantity;
  }

  set quantity(x){
    if (x >= 0){
      return this._quantity = x;
    }
    else {
      console.log(`Your ${Item.name} quantity cannot be negative`);
      return;
    }
  }

  get name(){
    return this._name;
  }

  set name(x){
    this._name = x;
  }

  get category(){
    return this._category;
  }

  set category(x){
    this._category = x;
  }
}

class Character {
  constructor(name){
    this.name = name;
    this.equipment = {};
  }
}

let player = new Character("dayid");
let stick = new Item("Stick", 1, "weapon");
let herb = new Item("Herb", 9, "ring");
let shieldRock = new Item("Rock Shield", 1, "shield");
let shieldIce = new Item("Ice Shield", 1, "shield");
let shieldFire = new Item("Fire Shield", 1, "shield");

const inventory = [];
const button1 = document.querySelector('#button1');
const text = document.querySelector("#text");
const inventoryList = document.querySelector("#inventoryList");
const equipmentList = document.querySelector("#equipmentList");
const inventoryMenu = document.getElementById("inventoryMenu");
const discardButton = document.getElementById("discardButton");
const equipButton = document.getElementById("equipButton");
const unequipButton = document.getElementById("unequipButton");
const equipWeapon = document.querySelector("#equipWeapon");
const equipShield = document.querySelector("#equipShield");
const equipRing = document.querySelector("#equipRing");

let img = document.createElement("img");
img.src = "yeti.png";
img.alt = "A yeti eating spaghetti";
document.getElementById("image-container").appendChild(img);

// initialize buttons
button1.onclick = inventoryDisplay;

// Makes the Inventory Menu pop up once it's clicked and disappear once clicked again
// While also updating the inventory
function inventoryDisplay() {
  if (inventoryMenu.style.display === "none"){
    inventoryMenu.style.display = "block";
    refreshInventory();
  }
  else {
    inventoryMenu.style.display = "none";
  }
}

function changeColor(e){
if(e.target.style.color==="red"){
  e.target.style.color = "white"
}
else{
  e.target.style.color = "red"
};
}

function refreshInventory(){
  while (inventoryList.lastChild){
    inventoryList.removeChild(inventoryList.lastChild)
  }
  for (let i = 0; i < inventory.length; i++){
    let newItem = document.createElement("li");
    newItem.addEventListener("click", changeColor);
    newItem.setAttribute("data-index", i);
    newItem.style.color = "white"
    newItem.innerHTML = inventory[i].name + " x " + inventory[i].quantity;
    inventoryList.appendChild(newItem)
  }
}

function addToInventory(item){

  let found = inventory.find((a) => a._name === item._name);

  let quan = item.quantity;
  
  if (typeof(quan) != "number"){
    return "item quantity is not a number";
  }
  if(inventory.length < 10){
    if(!found){
      if (item.quantity > 10){
        item.quantity = 10;
        inventory.push(item);
        //Inventory length is less than 10, no dupe item, but the item being added has a quantity of more than 10, set it to 10 and add to inventory
        return "added to inventory";
      } 
      else if (item.quantity <= 0){
        //item not found, but it's quantity being added is less than or equal to 0 so it doesn't affect the inventory
        return;
      }
      else {
        inventory.push(item);
        //item not found, quantity is in range, added to inventory
        return "added to inventory";
      }
      
    }
    else {
         if (found.quantity === 10) {
          //dupe item found, item quantity in inventory is full though and item should not be unequipped
         return "max";
         }
        else if ((found.quantity + quan) > 10){
        found.quantity = 10;
        //the dupe item found plus the incoming quantity is more than 10, set it to 10 but the quantity is still full and shouldn't be unequipped if so
        return "max";
        }
        else {
        found.quantity = found.quantity + quan;
        //the dupe item found plus incoming item quantity is sufficient, it can be unequipped in this case 
        return "enough room";
        }
      }
      
    }
  else{
     return;
    }
  }
//Testing Inventory Start:

addToInventory(stick);
addToInventory(shieldRock);
addToInventory(shieldIce);
addToInventory(herb);
addToInventory(shieldFire);


//Testing Inventory End: 

function discardSelection(){
 
  let collection = inventoryList.getElementsByTagName("li")
  
  for (let i = collection.length - 1; i >= 0; i--){
    // let index = parseInt(collection[i].dataset.index);
    let color = collection[i].style.color;
    if (color === "red"){
      inventory.splice(i, 1);
      
    }  
  }
  refreshInventory();
}

discardButton.addEventListener("click", discardSelection);
equipButton.addEventListener("click", equip);
unequipButton.addEventListener("click", unequip);
equipWeapon.addEventListener("click", changeColor);
equipShield.addEventListener("click", changeColor);
equipRing.addEventListener("click", changeColor);

function equip(){
  const hold = [];
  let collection = inventoryList.getElementsByTagName("li")
  for (let i = collection.length - 1; i >= 0; i--){
   
    let color = collection[i].style.color;
    if (color === "red"){
      //add all of the selected red items in the inventory to the hold variable
      hold.push(inventory[i]);
    }
  }
    if (hold.length <= 0 || hold.length > 1){
      //there was either no items selected, or more than 1 items selected
      console.log("Please select only one item to equip");
      return;
    }
    if (hold[0].category != "weapon" && hold[0].category != "shield" && hold[0].category != "ring"){
      //the one item that was selected is not a weapon, shield or a ring and cannot be equipped. 
      console.log("Please select an item that you can equip");
      return;
    }
    else {
      if(!player.equipment[hold[0].category]){
        //the player is not already holding this type of equipment
        let copyCat= deepCopy(hold[0]);
        
        player.equipment[hold[0].category] = copyCat; //add it to the equipment
        copyCat.quantity = 1;
        hold[0].quantity --; 
        if (hold[0].quantity === 0){
            discardSelection();
        }
        updateEquipmentHTML(); //update the html to show new equipment
        refreshInventory();
      }
      else {
        //the player is holding this type of equipment,
        // We need to check, if addToInventory returns "max item quantity" > we cannot swap the incoming item for the item already equipped, bust out
        // if addToInventory returns "enough room" > then we can swap the incoming item for the item already equipped
        addToInventory(player.equipment[hold[0].category]);
        player.equipment[hold[0].category] = hold[0]; 
        updateEquipmentHTML();
        refreshInventory();
      }
     //taking the selected item out of the inventory... but we should alter this to checking the item quantity
     revertColor(equipmentList, "white"); //this changes the selected items back to white... no need to stay selected after the func fires. 
     revertColor(inventoryList, "white");
    }
}

function deepCopy(arg){
  return JSON.parse(JSON.stringify(arg), (key, value) => {
    if(value && value._category === 'shield' || value._category === 'ring' || value._category === 'weapon'){return new Item (value._name, value._quantity, value._category, value._tier, value._element)}
    return value;
  });
}

function revertColor(parent, color){
  let collection = parent.getElementsByTagName("li")
  
  for (let i = 0; i < collection.length; i++){
    collection[i].style.color = color;
  }
}


function updateEquipmentHTML(){
    equipWeapon.textContent = "Weapon: " + (player.equipment.weapon ? player.equipment.weapon._name : "");
    equipShield.textContent = "Shield: " + (player.equipment.shield ? player.equipment.shield._name : "");
    equipRing.textContent = "Ring: " + (player.equipment.ring ? player.equipment.ring._name : "");
}

function unequipItem(category){
  if(player.equipment[category]){
      if(addToInventory(player.equipment[category])=== "max"){
    console.log("too many held");
    return;
  }
  else{
    player.equipment[category] = "";
   }
 }
else {
  return "nothing equipped";
}
}

function unequip(){
  let collection = equipmentList.getElementsByTagName("li")
  for (let i = collection.length - 1; i >= 0; i--){
   
    let color = collection[i].style.color;
    if (color === "red"){
      let cat = collection[i].dataset.category;
      unequipItem(cat);
    }
  }
refreshInventory();
updateEquipmentHTML();
revertColor(equipmentList, "white");
}

