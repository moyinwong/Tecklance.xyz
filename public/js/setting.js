//import { checkLogin } from "./functions.mjs";

//home logo button
document.querySelector(".logo-button").onclick = () => {
  location.href = "/";
};

//check login
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

//sidebar function
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

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

//change password
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
    window.location = "/admin/setting.html";
  } else if (res.status === 401) {
    alert(await res.json());
  }
}

document
  .querySelector("#change-password-form")
  .addEventListener("submit", changePassword);

document
  .querySelector("#user-form")
  .addEventListener("submit", editUserProfile);

checkLogin();
