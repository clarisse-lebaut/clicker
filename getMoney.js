
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
add();