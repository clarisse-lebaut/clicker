const automatesListItems = document.querySelector('#automatesListItems');
const transactionModes = document.getElementsByName('transactionModes');
const transactionQuantities = document.getElementsByName('transactionQuantities');

/**
 * Gets the value of the checked radio button for the transaction mode.
 * @returns {string} Can return "buy" or "sell".
 */
function getTransactionMode() {
  let output = '';

  transactionModes.forEach((transactionMode) => {
    if (transactionMode.checked) {
      output = transactionMode.value;
    }
  });

  return output;
}

/**
 * Gets the value of the checked radio button for the transaction quantity.
 * @returns {number} Can return 1, 10 or 100.
 */
function getTransactionQuantity() {
  let value = 0;

  transactionQuantities.forEach((transactionQuantity) => {
    if (transactionQuantity.checked) {
      value = parseInt(transactionQuantity.value);
    }
  });

  return value;
}

// Gets initialy the default transaction mode and transaction quantity.
let currentTransactionMode = getTransactionMode();
let currentTransactionQuantity = getTransactionQuantity();

// Shows each automate inside the JSON database.
fetch('shop.json')
  .then((response) => response.json())
  .then((data) => {
    let automates = data.automates;

    automates.forEach((automate) => {
      const item = document.createElement('div');

      const countText = document.createElement('p');
      countText.innerText = '0';
      item.appendChild(countText);

      const titleText = document.createElement('p');
      titleText.innerText = automate.name;
      item.appendChild(titleText);

      const costText = document.createElement('p');
      costText.innerText = automate.cost;
      item.appendChild(costText);

      // Perfoms the transaction depending on the transaction mode and the transaction quantity.
      // And modifies the count of automate.
      item.addEventListener('click', () => {
        let currentCount = parseInt(countText.innerText);

        if (currentTransactionMode === 'buy') {
          currentCount += currentTransactionQuantity;
        } else {
          currentCount -= currentTransactionQuantity;
        }

        countText.innerText = currentCount;
      });

      automatesListItems.appendChild(item);
    });

    // Performs a modification of the transaction mode when clicking on each radio button.
    modes.forEach((mode) => {
      mode.addEventListener('click', () => {
        currentTransactionMode = getTransactionMode();
      });
    });

    // Performs a modification of the transaction quantity when clicking on each radio button.
    quantities.forEach((quantity) => {
      quantity.addEventListener('click', () => {
        currentTransactionQuantity = getTransactionQuantity();
      });
    });
  })
  .catch((error) => console.error(error));
