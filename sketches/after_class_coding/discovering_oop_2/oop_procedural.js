// this (obj.xyz()) vs xyz()
// function.call

console.log("Hi");

// object oriented
class Enemy {
  constructor(name, health) {
    this.name = name;
    this.health = health;
  }

  log(arg) {
    console.log(this);
    console.log(`${this.name} has ${this.health} health`);
  }
}

const enemy1 = new Enemy("Goblin", 100);
const enemy2 = new Enemy("Troll", 200);

enemy1.log();
enemy2.log();

// procedurally orientated
const enemyData = {
  name: "Orc",
  health: 150,
};

function logEnemy(enemy) {
  console.log(`${enemy.name} has ${enemy.health} health`);
}

logEnemy(enemyData);
