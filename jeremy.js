const automatesListItems = document.querySelector('#automatesListItems');
const transactionModes = document.getElementsByName('transactionModes');
const transactionQuantities = document.getElementsByName('transactionQuantities');

let purchasedAutomates = null;
const moneyIncreasingRate = 2.5;
let money = 1000.0;
const numberFormat = Intl.NumberFormat('fr-FR');

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

function addAutomateItem(purchasedAutomate) {
  let currentCost = purchasedAutomate.object.cost * purchasedAutomate.count * moneyIncreasingRate;

  const container = document.createElement('div');
  container.style.userSelect = 'none';
  container.style.cursor = 'pointer';
  container.innerText = `> ${purchasedAutomate.object.name} | Cost: ${
    currentCost === 0
      ? numberFormat.format(purchasedAutomate.object.cost) + ' €'
      : numberFormat.format(currentCost) + ' €'
  } | Count: ${purchasedAutomate.count}`;

  container.addEventListener('click', () => {
    if (getTransactionModeValue() === 'buy') {
      purchasedAutomate.count += parseInt(getTransactionQuantityValue());
    } else {
      let transactionQuantity = parseInt(getTransactionQuantityValue());

      if (purchasedAutomate.count - transactionQuantity <= 0) {
        purchasedAutomate.count = 0;
      } else {
        purchasedAutomate.count -= transactionQuantity;
      }
    }

    currentCost = purchasedAutomate.object.cost * purchasedAutomate.count * moneyIncreasingRate;
    window.localStorage.setItem('purchasedAutomates', JSON.stringify(purchasedAutomates));
    container.innerText = `> ${purchasedAutomate.object.name} | Cost: ${
      currentCost === 0
        ? numberFormat.format(purchasedAutomate.object.cost) + ' €'
        : numberFormat.format(currentCost) + ' €'
    } | Count: ${purchasedAutomate.count}`;

    updateAutomateShopList();
  });

  automatesListItems.appendChild(container);
}

function updateAutomateShopList() {
  // Clear of child inside the shopping list.
  automatesListItems.replaceChildren();

  // Generates the listing of automates in the shop.
  purchasedAutomates.forEach((purchasedAutomate) => {
    if (money >= purchasedAutomate.object.unlockCost) {
      addAutomateItem(purchasedAutomate);
    }
  });
}

fetch('shop.json')
  .then((response) => response.json())
  .then((data) => {
    // Generates local variables
    if (window.localStorage.getItem('purchasedAutomates') === null) {
      window.localStorage.setItem('purchasedAutomates', JSON.stringify([]));
    }

    const automates = data.automates;
    purchasedAutomates = JSON.parse(window.localStorage.getItem('purchasedAutomates'));

    // Adds all automates with a buy amount of 0.
    if (purchasedAutomates.length === 0) {
      automates.forEach((automate) => {
        purchasedAutomates.push({
          object: automate,
          count: 0,
        });
      });

      window.localStorage.setItem('purchasedAutomates', JSON.stringify(purchasedAutomates));
    } else if (purchasedAutomates.length !== automates.length) {
      for (let i = 0; i < automates.length; i++) {
        let automate = automates[i];

        if (purchasedAutomates.includes(automate)) {
          continue;
        }

        purchasedAutomates.push(automate);
      }
    }

    updateAutomateShopList();
  })
  .catch((error) => console.error(error));
