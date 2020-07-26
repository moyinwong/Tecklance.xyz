import { checkLogin } from "./functions.mjs";

async function getRemainAmt() {
  const res = await fetch("/getRemainAmt");
  const remainAmt = await res.json();
  document.querySelector("#remain_amount").innerHTML = remainAmt;
}

checkLogin();
getRemainAmt();

// Create a Stripe client.
const stripe = Stripe(
  "pk_test_51H5XpOHTdw6tu9ehsd9bMptA9hvCutIylWtuAxXDSGfSvWogRdEnWHdWBc8cacItTR8TsfamlvMeUXX3k2lNEtkf00dIJl0dvT"
);

// Create an instance of Elements.
const elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
const style = {
  base: {
    color: "#32325d",
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#aab7c4",
    },
  },
  invalid: {
    color: "#fa755a",
    iconColor: "#fa755a",
  },
};

// Create an instance of the card Element.
const card = elements.create("card", {
  style: style,
  hidePostalCode: true,
});

// Add an instance of the card Element into the `card-element` <div>.
card.mount("#card-element");

// Handle real-time validation errors from the card Element.
card.on("change", function (event) {
  const displayError = document.getElementById("card-errors");
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = "";
  }
});

// Handle form submission.
const form = document.getElementById("payment-form");
form.addEventListener("submit", function (event) {
  event.preventDefault();

  stripe.createToken(card).then(function (result) {
    if (result.error) {
      // Inform the user if there was an error.
      var errorElement = document.getElementById("card-errors");
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server.

      payment(event, result.token.id);
    }
  });
});

async function payment(event, token) {
  //stop signup action
  event.preventDefault();
  document.getElementById("loader-div").style.display = "block";
  const form = event.target;
  const formObj = {};
  formObj.chargeAmount = form.chargeAmount.value;
  formObj.stripeToken = token;

  const res = await fetch("/charge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formObj),
  });

  const resMessage = await res.json();
  document.getElementById("loader-div").style.display = "none";
  if (res.status === 200) {
    //add class to show alert
    document.querySelector("#response").innerHTML = resMessage;
    document.querySelector("#response").classList.add("show");
    setTimeout(() => {
      window.location = "/";
    }, 3000);
  } else {
    document.querySelector("#response").innerHTML = resMessage;
    document.querySelector("#response").classList.add("show");
    setTimeout(() => {
      document.querySelector("#response").classList.remove("show");
    }, 3000);
  }
}
