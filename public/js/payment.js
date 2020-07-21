async function getRemainAmt() {
  const res = await fetch("/getRemainAmt");
  const remainAmt = await res.json();
  document.querySelector("#remain_amount").innerHTML = remainAmt;
}

getRemainAmt();
