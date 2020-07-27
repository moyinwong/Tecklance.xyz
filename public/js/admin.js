async function main() {
  const res = await fetch("/getUnpaidTasks");
  const resObjs = await res.json();

  //get all unpaid task fee
  async function fillInTable() {
    let tableElement = document.getElementById("task-table");
    tableElement.innerHTML = "";
    let str = "";
    for (let i = 0; i < resObjs.length; i++) {
      str += `<tr>`;
      let keys = Object.keys(resObjs[i]);

      for (let j = 0; j < keys.length; j++) {
        str += `<th>${resObjs[i][keys[j]]}</th>`;
      }
      str += `<th>
      <button type="button" class="btn btn-success paid-button" data-id="${resObjs[i].id}">Paid</button>
    </th></tr>`;
    }
    tableElement.innerHTML += str;
  }

  await fillInTable();

  //update data base
  async function switchStatus(event) {
    const button = event.target;
    console.log(button.dataset.id);

    const res = await fetch("/payTask", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId: button.dataset.id }),
    });
    if (res.status == 200) {
      alert("Successfully Updated");
      fillInTable();
    }
  }

  //add event listener to payment button
  let paidButtons = document.querySelectorAll(".paid-button");

  for (let button of paidButtons) {
    button.addEventListener("click", switchStatus);
  }

  //add event listener to back button
  function backToHomepage(event) {
    window.location = "/";
  }

  document.querySelector("#back").addEventListener("click", backToHomepage);
}

main();
