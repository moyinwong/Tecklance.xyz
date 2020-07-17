//to check if the password is match
function checkPassword() {
  if (
    document.getElementById("password").value ==
    document.getElementById("confirm_password").value
  ) {
    document.getElementById("message").style.color = "green";
    document.getElementById("message").innerHTML = "matching";
    document.getElementById("submit").disabled = false;
  } else {
    document.getElementById("message").style.color = "red";
    document.getElementById("message").innerHTML = "not matching";
    document.getElementById("submit").disabled = true;
  }
}

//if there is tempInfo, auto fill in data
async function checkIfTempInfo() {
  const res = await fetch("/getTempInfo");
  tempInfo = await res.json();
  await fillInInfo(tempInfo);
}

//auto fill in
async function fillInInfo(info) {
  if (info.email) {
    document.getElementById("email").value = info.email;
  }
  if (info.first_name) {
    document.getElementById("first_name").value = info.first_name;
  }
  if (info.last_name) {
    document.getElementById("last_name").value = info.last_name;
  }
}

checkIfTempInfo();

async function signup(event) {
  //stop signup action
  event.preventDefault();

  const form = event.target;

  const formData = new FormData();
  formData.append("username", form.username.value);
  formData.append("password", form.password.value);
  if (form.email.value) {
    formData.append("email", form.email.value);
  } else {
    formData.append("email", null);
  }
  if (form.first_name.value) {
    formData.append("first_name", form.first_name.value);
  } else {
    formData.append("first_name", null);
  }
  if (form.last_name.value) {
    formData.append("last_name", form.last_name.value);
  } else {
    formData.append("last_name", null);
  }
  formData.append("google", tempInfo.google);
  formData.append("github", tempInfo.github);
  formData.append("gitlab", tempInfo.gitlab);

  //append image in the last step
  if (form.image) {
    formData.append("image", form.image.files[0]);
  }

  //send json to backend
  const res = await fetch("/signup", {
    method: "POST",
    body: formData,
  });

  if (res.status === 201) {
    alert(await res.json());
    window.location = "/index.html";
  } else if (res.status === 400) {
    alert(await res.json());
  }
}

document.querySelector("#signup-form").addEventListener("submit", signup);
