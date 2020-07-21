//to check if the password is match
function checkPassword() {
  if (
    document.getElementById("password").value ==
    document.getElementById("confirm_password").value
  ) {
    if (!document.getElementById("password").value) {
      document.getElementById("message").style.display = "none";
      document.getElementById("submit").disabled = false;
    } else {
      document.getElementById("message").style.display = "inline-block";
      document.getElementById("message").style.color = "green";
      document.getElementById("message").innerHTML = "matching";
      document.getElementById("submit").disabled = false;
    }
  } else {
    document.getElementById("message").style.display = "inline-block";
    document.getElementById("message").style.color = "red";
    document.getElementById("message").innerHTML = "not matching";
    document.getElementById("submit").disabled = true;
  }
}

async function changePassword(event) {
  //stop signup action
  event.preventDefault();
  const currentPassword = document.querySelector("#current_password").value;

  const password = document.querySelector("#password").value;

  //send json to backend
  const res = await fetch("/change-password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      current_password: currentPassword,
      password: password,
    }),
  });

  if (res.status === 200) {
    alert(await res.json());
    window.location = "/index.html";
  } else if (res.status === 401) {
    alert(await res.json());
  }
}

document
  .querySelector("#change-password-form")
  .addEventListener("submit", changePassword);
