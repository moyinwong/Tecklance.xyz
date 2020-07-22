//auto fill in data
async function getFullInfo() {
  const res = await fetch("/getFullInfo");
  fullInfo = await res.json();
  await fillInFullInfo(fullInfo);
}

//auto fill in
async function fillInFullInfo(info) {
  const keys = Object.keys(info);
  for (let i = 0; i < keys.length; i++) {
    if (info[keys[i]]) {
      //if user has icon
      if (keys[i] == "image_user") {
        const formElement = document.getElementById("user_image");
        formElement.src = `../uploads/${info[keys[i]]}`;
      } else {
        //info other than image
        const formElement = document.getElementById(keys[i]);
        if (formElement) {
          formElement.value = info[keys[i]];
        }
      }
    }
  }
}

getFullInfo();

async function editUserProfile(event) {
  //stop signup action
  event.preventDefault();

  const form = event.target;

  const formData = new FormData();

  for (let i = 0; i < form.length; i++) {
    if (form[i].value) {
      formData.append(form[i].name, form[i].value);
    }
  }

  //append image in the last step
  if (form.image) {
    formData.append("image", form.image.files[0]);
  }

  //send json to backend
  const res = await fetch("/editUserInfo", {
    method: "PUT",
    body: formData,
  });

  if (res.status === 201) {
    alert(await res.json());
    window.location = "/index.html";
  } else if (res.status === 400) {
    alert(await res.json());
  }
}

document
  .querySelector("#user-form")
  .addEventListener("submit", editUserProfile);
