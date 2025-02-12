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
}

let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
const inventory = [];
let stick = new Item("Stick", 1);
let shield = new Item("Shield", 1);
let herb = new Item("Herb", 9);
let shieldIce = new Item("Shield Ice", 1);
let potion = new Item("Potion", 0);
let bomb = new Item("Bomb", "B");
let filler1 = new Item("filler1", 1);
let filler2 = new Item("filler2", 1);
let filler3 = new Item("filler3", 1);
let filler4 = new Item("filler4", 1);
let filler5 = new Item("filler5", 1);
let filler6 = new Item("filler6", 1);
let filler7 = new Item("filler7", 1);


const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const button4 = document.querySelector("#button4");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const inventoryList = document.querySelector("#inventoryList");
const inventoryMenu = document.getElementById("inventoryMenu");
const discardButton = document.getElementById("discardButton");
const equipButton = document.getElementById("equipButton");
const unequipButton = document.getElementById("unequipButton");
const equipWeapon = document.querySelector("#equipWeapon");
const equipShield = document.querySelector("#equipShield");
const equipRing = document.querySelector("#equipRing");

const weapons = [
  { name: 'stick', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 100 }
];
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60
  },
  {
    name: "dragon",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "town square",
    "button text": ["Inventory", "Go to store", "Go to cave", "Fight dragon"],
    "button functions": [inventoryDisplay, goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    "button text": ["Inventory", "Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [inventoryDisplay, buyHealth, buyWeapon, goTown],
    text: "You enter the store."
  },
  {
    name: "cave",
    "button text": ["Inventory", "Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [inventoryDisplay, fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters."
  },
  {
    name: "fight",
    "button text": ["Inventory", "Attack", "Dodge", "Run"],
    "button functions": [inventoryDisplay, attack, dodge, goTown],
    text: "You are fighting a monster."
  },{
    name: "kill monster",
    "button text": ["Inventory", "Go to town square", "Go to town square", "Go to town square"],
    "button functions": [inventoryDisplay, goTown, goTown, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
  }, {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [inventoryDisplay, restart, restart, restart],
    text: "You die. &#x2620;"
  },
  { 
    name: "win", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?", "REPLAY?"], 
    "button functions": [inventoryDisplay, restart, restart, restart], 
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;" 
  },
  {
    name: "easter egg",
    "button text": ["Inventory", "2", "8", "Go to town square?"],
    "button functions": [inventoryDisplay, pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
];

// initialize buttons
button1.onclick = inventoryDisplay;
button2.onclick = goStore;
button3.onclick = goCave;
button4.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button4.innerText = location["button text"][3];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  button4.onclick = location["button functions"][3];
  text.innerHTML = location.text;
}

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
    return;
  }
  if(inventory.length < 10){
    if(!found){
      if (item.quantity > 10){
        item.quantity = 10;
        inventory.push(item);
        return;
      } 
      else if (item.quantity <= 0){
        return;
      }
      else {
        inventory.push(item);
        return;
      }
      
    }
    else {
         if (found.quantity === 10) {
         return 
         }
        else if ((found.quantity + quan) > 10){
        found.quantity = 10;
        return 
        }
        else {
        found.quantity = found.quantity + quan;
        return 
        }
      }
      
    }
  else{
     return;
    }
  }
//Testing Inventory Start:

addToInventory(stick);
addToInventory(stick);
addToInventory(shield);
addToInventory(shieldIce);
addToInventory(herb);
addToInventory(filler1);
addToInventory(filler1);
addToInventory(filler2);
addToInventory(filler3);
addToInventory(filler4);
addToInventory(filler5);

//Testing Inventory End: 

function discardSelection(){
 
  let collection = inventoryList.getElementsByTagName("li")
  
  for (let i = collection.length - 1; i >= 0; i--){
    let index = parseInt(collection[i].dataset.index);
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

function equip(){
  console.log("equip");
}

function unequip(){
  console.log("unequip");
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}

