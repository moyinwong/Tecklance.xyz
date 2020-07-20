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
  await fillInTempInfo(tempInfo);
}

//auto fill in
async function fillInTempInfo(info) {
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

  console.log(tempInfo.google);

  const formData = new FormData();

  for (let i = 0; i < form.length; i++) {
    if (form[i].value) {
      formData.append(form[i].name, form[i].value);
    }
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

document.querySelector("#user-form").addEventListener("submit", signup);
