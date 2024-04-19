
// ---------------------------------------------------------------------------
let money = 0; // on définit le nombre de point à 0

// ---------------------------------------------------------------------------
// fonction qui permet de de faire augmenter au clic le nombre de points
function add(){
let solde = document.querySelector("#addMoney"); // ici on récupère la div dans laquelle on va faire appaitre le nombre grandissant
    const image = document.getElementById("getMoney"); // ici on récupère les évènement sur le bouton (en gros le clic)
    image.addEventListener("click", () => {
        solde.textContent = `${++money} €`; //on augmente la valeur a chaque click, c'est une incrémentation de +1 par rapport ) la variable money, et elle apparait dans le corps de la page web
        levelUp(); // on appel une fonction qui en dehors de cette fonction (on stock un élément)
    });
    console.log("pour être sur qu'elle est bien appeler") // bon là 'est juste pour voir ce qui se passe dans la console, être sur que la fonction est appele
}
add();

// ---------------------------------------------------------------------------
function rainMoney(){
    const btn = document.getElementById('getMoney');
    btn.addEventListener("click", () => {
            let rainM = document.getElementById('sold'); //récupère la div dans laquelle on fait apparaitre l'élément
            const evenement = document.createElement("img");
            evenement.src = './img/svg/billetrose.svg';
            evenement.style.width = "50px";
            evenement.style.height = "70px";
            evenement.classList.add("rain-money");

            //générer des positions alétaoire de l'élément dans la div
            const randomX = Math.floor(Math.random() * (rainM.offsetWidth - 50));
            const randomY = Math.floor(Math.random() * (rainM.offsetHeight -70));

            evenement.style.position = "absolute";
            evenement.style.top = randomY + 'px';
            evenement.style.left = randomX + 'px';

            rainM.appendChild(evenement);
            
        setTimeout(function(){
        rainM.removeChild(evenement);
    }, 1000);
    })

}
rainMoney();

// ---------------------------------------------------------------------------
// fonction qui permet de de faire apparaitre éléments quand on click / doit disparaitre au bout de quelque seconde
function billets(){
    let img = document.getElementById('getMoney');
    img.addEventListener('click', function (e) {
        let image = document.createElement('img');
        image.src = './img/svg/billetrose.svg';
        image.style.width = "100px";
        image.style.height = "80px";
        image.style.position = 'absolute';
        image.style.left = e.clientX + 'px';
        image.style.top = e.clientY + 'px';
        image.style.margin = "20px"
        image.classList.add("img-style");

    document.body.appendChild(image);
        setTimeout(function(){
        document.body.removeChild(image);
    }, 1000);
    });
}
billets();

// ---------------------------------------------------------------------------
// fonction pour crée un bonus sauvage qui apparaite de manière aléatoire 
function randomElement(){
    //crée la carte dans laquelle il y a les informations 
    const randomBonusCard = document.getElementById("randomBonusCard")
    randomBonusCard.innerHTML = "";
    // permet de crée le contenue du bonus
    const bonus = document.createElement("img");
    bonus.src = './img/png/bonus.png';

    randomBonusCard.appendChild(bonus);
    randomBonusCard.classList.add('savage-bonus-style');

     const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const randomX = Math.floor(Math.random() * (windowWidth - bonus.offsetWidth));
    const randomY = Math.floor(Math.random() * (windowHeight - bonus.offsetHeight));

    randomBonusCard.style.position = "absolute";
    randomBonusCard.style.top = randomY + 'px';
    randomBonusCard.style.left = randomX + 'px';

    let ajout = document.getElementById('addMoney');
    randomBonusCard.addEventListener("click", () => {

        ajout.textContent = money + 100000;
        console.log("+ 100 000")
     }
    )

    let randomNumber = Math.random();
    if (randomNumber < 0.5) {
        randomBonusCard.style.display = 'block';
    } else {
        randomBonusCard.style.display = 'none';
    }
    console.log("est apppelé")
    }

setInterval(randomElement, 5000);

// ---------------------------------------------------------------------------
// -------- CETTE PARTIE PERMET DE FAIRE APPARAITRE DES ELEMENTS DANS LA LISTE DE SCHOPPING

// fonction qui permet de faire augementer de niveau
function levelUp(){
    //condition pour implanter des paliers
    if(money === 5){
        card(); // on appel une autre fonction qui démarre quand celle-ci est atteinte
    }
    if(money === 10){
        card(); // on appel une autre fonction qui démarre quand celle-ci est atteinte
    }
    if(money === 15){
        card(); // on appel une autre fonction qui démarre quand celle-ci est atteinte
    }
}

// ----------------------------------------------------
// fonction qui crée les cartes avec les differentes informations sur les automates
let cardId = 1;

function card(){
    const infoLevel = document.getElementById("level");

    const newCard = document.createElement('div');
    newCard.classList.add("card-style");
    newCard.setAttribute("id", `bonus-${cardId}`);
        // tout les éléments qui apparaissent dans la carte
        const illustration = document.createElement("p");
        illustration.textContent = 'Image'; // illustration de l'automate
        illustration.classList.add("image-card-style");
        newCard.appendChild(illustration);
        
        const bubbleTitle = document.createElement("p")
        bubbleTitle.textContent = "Empocher l'argent" // description de ce qu'on peut obtenir
        bubbleTitle.classList.add("title-card-style");
        newCard.appendChild(bubbleTitle);
        
        const price = document.createElement("p");
        price.textContent = "10€00"; // prix de l'article
        price.classList.add("price-card-style");
        newCard.appendChild(price);

        const bubble = document.createElement("p");
        bubble.textContent = "Ajoute +1 pour chaque clique réaliser"; // description de ce qu'on peut obtenir
        bubble.classList.add("context-card-style");
        newCard.appendChild(bubble);

        infoLevel.appendChild(newCard)
}

// ----------------------------------------------------
// -------- CETTE PARTIE PERMET DE FAIRE APPARAITRE LA LISTE DES AUTOMATES
// fonction qui crée les cartes des automates

function automateCard(){
    const listen = document.getElementById('level')
    const automate = document.getElementById("card-automate");
    automate.classList.add("disposition-card")

    listen.addEventListener("click", () => {
        console.log("test click sur bonus")
        
        const newCard = document.createElement('div');
        newCard.classList.add("automate-card-style");

        const icon = document.createElement('img');
        icon.src = "./img/jpg/boursier.jpg"
        icon.classList.add("automate-icon");

        newCard.appendChild(icon)
        automate.appendChild(newCard);

    });

}

automateCard();

// il faut ensuite crée un fonction qui permet de simplement ajouter une icone supplémentaire à chaque illustration des automates