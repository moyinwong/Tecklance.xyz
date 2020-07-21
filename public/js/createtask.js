//login button
document.querySelector(".login-button").onclick = () => {
  location.href = "/login.html";
};

//home logo button
document.querySelector(".logo-button").onclick = () => {
  location.href = "/";
};

//sidebar function
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

//check login function
async function checkLogin() {
  let res = await fetch("/current-user");
  let user = await res.json();

  if (res.status == 200 && user) {
    if (user.image_user) {
      document.querySelector(".login-button-container").innerHTML = `
    <div><button onclick="openNav()" class="user-profile-button" type="button"><img class="img-fluid" src="/uploads/${user.image_user}"></button></div>
    <div>${user.username}</div>
    <button class="login-button" type="button" onclick="location.href='/logout'">LOG OUT</button>`;
    } else {
      document.querySelector(".login-button-container").innerHTML = `
      <div><button onclick="openNav()" class="user-profile-button" type="button"><i class="far fa-user"></i></button></div>
      <div>${user.username}</div>
      <button class="login-button" type="button" onclick="location.href='/logout'">LOG OUT</button>`;
      document.querySelector("#remain_amt").innerHTML = user.remain_amt;
    }
  }
}

async function createTask(event) {
  try {
    event.preventDefault();

    const form = event.target;

    //get user information
    let userRes = await fetch("/current-user");
    let user = await userRes.json();

    const formData = new FormData();

    formData.append("title", form.title_input.value);
    formData.append("content", form.content_input.value);
    formData.append("category", form.category.value);
    formData.append("offered_amt", parseInt(form.offered_amt.value));
    formData.append("remain_amt", parseInt(user.remain_amt));

    //append image in the last step
    if (form.image) {
      formData.append("image", form.image.files[0]);
    }

    //check if there is enough money

    if (parseInt(form.offered_amt.value) > parseInt(user.remain_amt)) {
      //add class to show alert
      document.querySelector("#offered_amt_alert").classList.add("show");
      setTimeout(() => {
        document.querySelector("#offered_amt_alert").classList.remove("show");
      }, 3000);
      return;
    }

    //app.post
    let res = await fetch(`/create-task/${user.id}`, {
      method: "POST",
      body: formData,
    });

    if (res.status === 201) {
      document.querySelector("#response").innerHTML = await res.json();
      document.querySelector("#response").classList.add("show");

      setTimeout(() => {
        window.location = "/";
      }, 3000);
    } else {
      document.querySelector("#response").innerHTML = await res.json();
      document.querySelector("#response").classList.add("show");
      setTimeout(() => {
        document.querySelector("#response").classList.remove("show");
      }, 3000);
    }
  } catch (err) {
    console.log(err);
  }
}

document.querySelector("#task-form").addEventListener("submit", createTask);

checkLogin();
