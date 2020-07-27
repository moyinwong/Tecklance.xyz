//check login function
async function checkLogin() {
  //home logo button
  document.querySelector(".logo-button").onclick = () => {
    location.href = "/";
  };

  let res = await fetch("/current-user");
  let user = await res.json();

  if (res.status == 200 && user) {
    if (user.image_user) {
      document.querySelector(".login-button-container").innerHTML = `
      <div><button onclick="openNav()" class="user-profile-button" type="button"><img class="user-profile-img img-fluid" src="/uploads/${user.image_user}"></button></div>
      <div>${user.username}</div>
      <button class="login-button" type="button" onclick="location.href='/logout'">LOG OUT</button>`;
    } else {
      document.querySelector(".login-button-container").innerHTML = `
        <div><button onclick="openNav()" class="user-profile-button" type="button"><i class="far fa-user"></i></button></div>
        <div>${user.username}</div>
        <button class="login-button" type="button" onclick="location.href='/logout'">LOG OUT</button>`;
    }
    if (document.querySelector("#remain_amt")) {
      document.querySelector("#remain_amt").innerHTML = user.remain_amt;
    }
  }
  //display message bubble
  if (document.getElementById("message-number-bubble")) {
    if (user && user.id) {
      //console.log(user);
      const resMessages = await fetch("/message/unread");
      const messages = await resMessages.json();
      if (messages.length) {
        document.getElementById("message-number-bubble").innerHTML =
          messages.length;
        document.getElementById("message-bubble").style.display = "block";
        document.getElementById("message-bubble").onclick = () => {
          window.location = "/messages";
        };
      }
    }
  }
}

async function main() {
  async function getRemainAmt() {
    const res = await fetch("/getRemainAmt");
    const remainAmt = await res.json();
    document.querySelector("#remain_amount").innerHTML = remainAmt;
  }

  await checkLogin();
  await getRemainAmt();

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

  // Can move to external function
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
}

main();
//sidebar function
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
