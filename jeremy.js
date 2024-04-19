const elemMoney = document.getElementById("money");
const btnGetMoney = document.getElementById("btnGetMoney");
const upgradesListItems = document.querySelector("#upgradesListItems");
const automatesListItems = document.querySelector("#automatesListItems");
const transactionModes = document.getElementsByName("transactionModes");
const transactionQuantities = document.getElementsByName(
  "transactionQuantities"
);
const transactionQuantitiesLabel = document.querySelectorAll(
  ".transactionQuantitiesLabel"
);

let purchasedAutomates = null;
let money = 0;
const numberFormat = Intl.NumberFormat("fr-FR");

setInterval(() => {
  money += 10000;
  elemMoney.innerText = `Money: ${numberFormat.format(money)} €`;
  updateAutomateShopList();
}, 1000);

function getTransactionModeValue() {
  let output = "";

  transactionModes.forEach((transactionMode) => {
    if (transactionMode.checked) {
      output = transactionMode.value;
    }
  });

  return output;
}

function getTransactionQuantityValue() {
  let output = "";

  transactionQuantities.forEach((transactionQuantity) => {
    if (transactionQuantity.checked) {
      output = transactionQuantity.value;
    }
  });

  return output;
}

function addAutomateItem(purchasedAutomate) {
  let currentCost = purchasedAutomate.object.cost * purchasedAutomate.count;

  const container = document.createElement("div");
  container.style.userSelect = "none";
  container.style.cursor = "pointer";
  container.innerText = `> ${purchasedAutomate.object.name} | Cost: ${
    currentCost === 0
      ? numberFormat.format(purchasedAutomate.object.cost) + " €"
      : numberFormat.format(currentCost) + " €"
  } | Count: ${purchasedAutomate.count}`;

  container.addEventListener("click", () => {
    let transactionQuantity = parseInt(getTransactionQuantityValue());

    if (getTransactionModeValue() === "buy") {
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

    currentCost =
      purchasedAutomate.object.cost *
      purchasedAutomate.count *
      transactionQuantity;
    window.localStorage.setItem(
      "purchasedAutomates",
      JSON.stringify(purchasedAutomates)
    );
    elemMoney.innerText = `Money: ${numberFormat.format(money)} €`;
    container.innerText = `> ${purchasedAutomate.object.name} | Cost: ${
      currentCost === 0
        ? numberFormat.format(purchasedAutomate.object.cost) + " €"
        : numberFormat.format(currentCost) + " €"
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

function updateQuantitiesText() {
  for (let i = 0; i < transactionQuantitiesLabel.length; i++) {
    const transactionQuantityLabel = transactionQuantitiesLabel[i];
    const transactionQuantity = transactionQuantities[i];

    if (getTransactionModeValue() === "buy") {
      transactionQuantityLabel.innerText = "+ " + transactionQuantity.value;
    } else {
      transactionQuantityLabel.innerText = "- " + transactionQuantity.value;
    }
  }
}

fetch("shop.json")
  .then((response) => response.json())
  .then((data) => {
    // Generates local variables
    if (window.localStorage.getItem("purchasedUpgrades") === null) {
      window.localStorage.setItem("purchasedUpgrades", JSON.stringify([]));
    }

    if (window.localStorage.getItem("purchasedAutomates") === null) {
      window.localStorage.setItem("purchasedAutomates", JSON.stringify([]));
    }

    elemMoney.innerText = `Money: ${numberFormat.format(money)} €`;
    btnGetMoney.addEventListener("click", () => {
      money++;
      elemMoney.innerText = `Money: ${numberFormat.format(money)} €`;
      updateAutomateShopList();
    });

    const automates = data.automates;
    const upgrades = data.upgrades;
    purchasedAutomates = JSON.parse(
      window.localStorage.getItem("purchasedAutomates")
    );

    // Adds all automates with a buy amount of 0.
    if (purchasedAutomates.length === 0) {
      automates.forEach((automate) => {
        purchasedAutomates.push({
          object: automate,
          count: 0,
        });
      });

      window.localStorage.setItem(
        "purchasedAutomates",
        JSON.stringify(purchasedAutomates)
      );
    } else if (purchasedAutomates.length !== automates.length) {
      for (let i = 0; i < automates.length; i++) {
        let automate = automates[i];

        if (purchasedAutomates.includes(automate)) {
          continue;
        }

        purchasedAutomates.push(automate);
      }
    }

    updateQuantitiesText();

    transactionModes.forEach((transactionMode) => {
      transactionMode.addEventListener("click", () => {
        updateQuantitiesText();
      });
    });

    upgradesListItems.forEach((item) => {
      const li = document.createElement("li");
    });

    updateAutomateShopList();
  })
  .catch((error) => console.error(error));
