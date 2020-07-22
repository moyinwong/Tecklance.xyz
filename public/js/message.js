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
    }
  }
}

//sidenav control
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

async function getMessage() {
  const res = await fetch("/getMessage");
  const messages = await res.json();
  for (let i = 0; i < messages.length; i++) {
    document.querySelector(".message-container").innerHTML += `
    <div class="card text-white bg-primary mb-3" style="max-width: 18rem;">
        <div class="card-header">${messages[i].username}</div>
        <div class="card-body">
            <p class="card-text">${messages[i].content}</p>
        </div>
    </div>`;
  }
}

checkLogin();
getMessage();
