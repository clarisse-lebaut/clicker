
let money = 0; // define money at 0

// point level up on the click
function add(){
let solde = document.querySelector("#addMoney"); // to make appear the number of points
    const button = document.getElementById("go");
    button.addEventListener("click", () => {
        solde.textContent = `${++money} €`;
        levelUp();
    });
    console.log("check");
}

// function for level up
function levelUp(){
    let info = "LevelUp";
    if(money === 5){
        alert(info);
    }
    if (money === 10){
        alert(info);
    }
    if (money === 15){
        alert(info);
    }
}

add();
levelUp();