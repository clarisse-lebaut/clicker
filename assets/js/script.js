
const pay = document.querySelector('#addMoney'); // back div for the number of point / money
const image = document.getElementById('getMoney'); // back click evenement on the button to make appear the money aside the big cash
const btn = document.getElementById('getMoney');
const infoLevel = document.getElementById('level');
const automate = document.getElementById('card-automate');
const elemMoney = document.getElementById('money');
const btnGetMoney = document.getElementById('btnGetMoney');
const automatesListItems = document.querySelector('#automatesListItems');
const transactionModes = document.getElementsByName('transactionModes');
const transactionQuantities = document.getElementsByName('transactionQuantities');
const transactionQuantitiesLabel = document.querySelectorAll('.transactionQuantitiesLabel');
// back element to make appeart the log time
const hours = document.querySelector('#hours');
const minutes = document.querySelector('#minutes');
const seconds = document.querySelector('#seconds');

const numberFormat = Intl.NumberFormat('fr-FR');
const pinkCashImagePath = 'assets/img/billetrose.svg';

let money = parseInt(window.localStorage.getItem('money')) || 0; // start the number of point at 0
let purchasedAutomates = null;

let countedSeconds = parseInt(window.localStorage.getItem('countedSeconds')) || 0;

function updatePlayedTime() {
  countedSeconds++;

  let outputHours = Math.floor(countedSeconds / 3600);
  let outputMinutes = Math.floor((countedSeconds - outputHours * 3600) / 60);
  let outputSeconds = Math.floor(countedSeconds - outputHours * 3600 - outputMinutes * 60);

  hours.innerText = outputHours.toString().padStart(2, '0');
  minutes.innerText = outputMinutes.toString().padStart(2, '0');
  seconds.innerText = outputSeconds.toString().padStart(2, '0');
}

updatePlayedTime();

// Calculates the yield money per second.
setInterval(() => {
  updatePlayedTime();

  let yieldPerSecond = 1;
  let purchased =
    purchasedAutomates.filter((purchasedAutomate) => purchasedAutomate.count > 0) || [];

  if (purchased.length > 0) {
    purchased.forEach((item) => {
      yieldPerSecond += item.object.yield * item.count;
    });
  }

  money += yieldPerSecond;

  updateClickText();
  window.localStorage.setItem('money', money);
  window.localStorage.setItem('countedSeconds', countedSeconds);
}, 1000);

function updateClickText() {
  pay.textContent = `${numberFormat.format(money)} €`; // increase value on each click
}

function updateShopList() {
  automatesListItems.replaceChildren();

  purchasedAutomates.forEach((purchasedAutomate) => {
    if (money >= purchasedAutomate.object.unlockCost) {
      let currentCost = purchasedAutomate.object.cost * purchasedAutomate.count;

      const newCard = document.createElement('div');
      newCard.classList.add('card-style');
      // element in the card on the shop
      const bubbleTitle = document.createElement('p');
      bubbleTitle.textContent = purchasedAutomate.object.name; // title of what we can have
      bubbleTitle.classList.add('title-card-style');
      newCard.appendChild(bubbleTitle);

      const price = document.createElement('p');
      price.textContent =
        currentCost === 0
          ? numberFormat.format(purchasedAutomate.object.cost) + ' €'
          : numberFormat.format(currentCost) + ' €'; // pirce of the article
      price.classList.add('price-card-style');
      newCard.appendChild(price);

      const drawing = document.createElement('img');
      drawing.src = purchasedAutomate.object.img; // picture of the automate
      drawing.style.width = '100px';
      drawing.classList.add('image-card-style');
      newCard.appendChild(drawing);

      const countText = document.createElement('p');
      countText.innerText = purchasedAutomate.count; // count how many automate user have
      countText.classList.add('count-card-style');
      newCard.appendChild(countText);

      automatesListItems.appendChild(newCard);

      newCard.addEventListener('click', () => {
        let transactionQuantity = parseInt(getTransactionQuantityValue());

        if (getTransactionModeValue() === 'buy') {
          if (money >= currentCost) {
            purchasedAutomate.count += parseInt(getTransactionQuantityValue());
            money -= currentCost;
          }
        } else {
          if (purchasedAutomate.count - transactionQuantity <= 0) {
            purchasedAutomate.count = 0;
          } else {
            purchasedAutomate.count -= transactionQuantity;
          }

          money += currentCost;
        }

        currentCost = purchasedAutomate.object.cost * purchasedAutomate.count * transactionQuantity;

        window.localStorage.setItem('purchasedAutomates', JSON.stringify(purchasedAutomates));
        updateClickText();
        price.textContent =
          currentCost === 0
            ? numberFormat.format(purchasedAutomate.object.cost) + ' €'
            : numberFormat.format(currentCost) + ' €'; // price of the article
        countText.innerText = purchasedAutomate.count;

        updateShopList();
        updatePurchasedList();
      });
    }
  });
}

function updatePurchasedList() {
  //drawing index for the automate present in the end of the page
  const imagesList = [
    'assets/img/empocher.jpeg',
    'assets/img/arnaqueur.jpeg',
    'assets/img/boursier.jpeg',
    'assets/img/banque.jpeg',
    'assets/img/fond.jpeg',
    'assets/img/président.jpeg',
    'assets/img/actionnaire.jpeg',
    'assets/img/fournisseur.jpeg',
    'assets/img/entreprise.jpeg',
  ];
  automate.replaceChildren();

  purchasedAutomates.forEach((purchasedAutomate, i) => {
    if (purchasedAutomate.count > 0) {
      automate.classList.add('disposition-card');

      const newCard = document.createElement('div');
      newCard.style.backgroundImage = `url("${imagesList[i]}")`;
      newCard.classList.add('automate-card-style');

      const icon = document.createElement('img');
      icon.src = purchasedAutomate.object.sprite;
      icon.classList.add('automate-icon');

      const countText = document.createElement('p');
      countText.innerText = purchasedAutomate.count;
      countText.classList.add('count-card-style-automate');
      newCard.appendChild(countText);

      newCard.appendChild(icon);
      automate.appendChild(newCard);
    }
  });
}

function getTransactionModeValue() {
  let output = '';

  transactionModes.forEach((transactionMode) => {
    if (transactionMode.checked) {
      output = transactionMode.value;
    }
  });

  return output;
}

function getTransactionQuantityValue() {
  let output = '';

  transactionQuantities.forEach((transactionQuantity) => {
    if (transactionQuantity.checked) {
      output = transactionQuantity.value;
    }
  });

  return output;
}

function updateQuantitiesText() {
  for (let i = 0; i < transactionQuantitiesLabel.length; i++) {
    const transactionQuantityLabel = transactionQuantitiesLabel[i];
    const transactionQuantity = transactionQuantities[i];

    if (getTransactionModeValue() === 'buy') {
      transactionQuantityLabel.innerText = '+ ' + transactionQuantity.value;
    } else {
      transactionQuantityLabel.innerText = '- ' + transactionQuantity.value;
    }
  }
}

fetch('shop.json')
  .then((response) => response.json())
  .then((data) => {
    updateClickText();

    // Adds +1 to the money
    image.addEventListener('click', () => {
      money++;
      updateClickText();
      updateShopList();
      window.localStorage.setItem('money', money);
    });

    // Shows random money raindrops
    btn.addEventListener('click', () => {
      let rainM = document.getElementById('sold');
      const evenement = document.createElement('img');
      evenement.src = pinkCashImagePath;
      evenement.style.width = '50px';
      evenement.style.height = '70px';
      evenement.classList.add('rain-money');

      const randomX = Math.floor(Math.random() * (rainM.offsetWidth - 50));
      const randomY = Math.floor(Math.random() * (rainM.offsetHeight - 70));

      evenement.style.position = 'absolute';
      evenement.style.top = randomY + 'px';
      evenement.style.left = randomX + 'px';

      rainM.appendChild(evenement);

      setTimeout(function () {
        rainM.removeChild(evenement);
      }, 1000);
    });

    // Shows a money at the cursor location on click
    image.addEventListener('click', function (e) {
      let image = document.createElement('img');
      image.src = pinkCashImagePath;
      image.style.width = '100px';
      image.style.height = '80px';
      image.style.position = 'absolute';
      image.style.left = e.clientX + 'px';
      image.style.top = e.clientY + 'px';
      image.style.margin = '20px';
      image.classList.add('img-style');

      document.body.appendChild(image);
      setTimeout(function () {
        document.body.removeChild(image);
      }, 1000);
    });

    // Creates the local storage if that doesn't exist
    if (window.localStorage.getItem('purchasedAutomates') === null) {
      window.localStorage.setItem('purchasedAutomates', JSON.stringify([]));
    }

    // Gets all purchased automates
    purchasedAutomates = JSON.parse(window.localStorage.getItem('purchasedAutomates'));

    // Adds all automates with a buy amount of 0.
    if (purchasedAutomates.length === 0) {
      data.automates.forEach((automate) => {
        purchasedAutomates.push({
          object: automate,
          count: 0,
        });
      });

      window.localStorage.setItem('purchasedAutomates', JSON.stringify(purchasedAutomates));
    } else if (purchasedAutomates.length !== data.automates.length) {
      for (let i = 0; i < data.automates.length; i++) {
        let automate = data.automates[i];

        if (purchasedAutomates.includes(automate)) {
          continue;
        }

        purchasedAutomates.push(automate);
      }
    }

    updateQuantitiesText();

    transactionModes.forEach((transactionMode) => {
      transactionMode.addEventListener('click', () => {
        updateQuantitiesText();
      });
    });

    // Updates the shop list
    updateShopList();
  })
  .catch((error) => console.error(error));

function randomElement() {
  //create the card where we have the random bonus
  const randomBonusCard = document.getElementById('randomBonusCard');
  randomBonusCard.innerHTML = '';
  //create the drawing of the random bonus
  const bonus = document.createElement('img');
  bonus.src = 'assets/img/bonus.png';

  randomBonusCard.appendChild(bonus);
  randomBonusCard.classList.add('savage-bonus-style');
  //make appear the random bonus anywhere on the docuement body
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const randomX = Math.floor(Math.random() * (windowWidth - bonus.offsetWidth));
  const randomY = Math.floor(Math.random() * (windowHeight - bonus.offsetHeight));

  randomBonusCard.style.position = 'absolute';
  randomBonusCard.style.top = randomY + 'px';
  randomBonusCard.style.left = randomX + 'px';

  let ajout = document.getElementById('addMoney');
  randomBonusCard.addEventListener('click', () => {
    money += 1000;
    ajout.textContent = numberFormat.format(money) + ' €';
    window.localStorage.setItem('money', money);
  });

  let randomNumber = Math.random();
  if (randomNumber < 0.5) {
    randomBonusCard.style.display = 'block';
  } else {
    randomBonusCard.style.display = 'none';
  }
}

setInterval(randomElement, 5000);
