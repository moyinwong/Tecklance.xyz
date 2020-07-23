//login button
document.querySelector(".login-button").onclick = () => {
  location.href = "/login.html";
};

//home logo button
document.querySelector(".logo-button").onclick = () => {
  location.href = "/";
};

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
    //restrict content displayed length
    let messageContent;
    if (messages[i].content.length > 40) {
      messageContent = messages[i].content.substring(0, 40) + "...";
    } else {
      messageContent = messages[i].content;
    }

    //please continuous.......
    document.querySelector(".message-container").innerHTML += `
    <div class="card text-white bg-primary mb-3" style="max-width: 18rem;">
        <div class="card-header">${messages[i].username}</div>
        <div class="card-body">
            <p class="card-text">${messageContent}</p>
        </div>
    </div>`;
    // if (messages[i].sender_id ==  null) {
    //   document.querySelector(".message-container").innerHTML += `
    //   <div class="card text-white bg-primary mb-3" style="max-width: 18rem;">
    //       <div class="card-header">From Tecklance</div>
    //       <div class="card-body">
    //           <p class="card-text">${messages[i].content}</p>
    //       </div>
    //   </div>`
    // } else {
    //   document.querySelector(".message-container").innerHTML += `
    //   <div class="card text-white bg-primary mb-3" style="max-width: 18rem;">
    //       <div class="card-header">${messages[i].username}</div>
    //       <div class="card-body">
    //           <p class="card-text">${messages[i].content}</p>
    //       </div>
    //   </div>`
    // };
  }
}

checkLogin();
getMessage();

function getMessageId(event) {
  console.log(event.target.parent);
}

document
  .querySelector(".message-container")
  .addEventListener("click", getMessageId);
