async function getRemainAmt() {
  const res = await fetch("/getRemainAmt");
  const remainAmt = await res.json();
  document.querySelector("#remain_amount").innerHTML = remainAmt;
}

getRemainAmt();

//document.getElementById("stripe-button-div").classList.add("show");

function checkAmount() {
  if (document.getElementById("chargeAmount").value < 4) {
    document.getElementById("stripe-button-div").classList.remove("show");
  } else {
    document.getElementById("stripe-button-div").classList.add("show");
  }
}
