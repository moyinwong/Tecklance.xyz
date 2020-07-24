//add a href tag for a message
function addaHrefTag(str) {
  const index = str.indexOf("*url*");
  if (index === -1) {
    return str;
  }
  const result = `${str.substring(0, index)}<a href="${str.substring(
    index + 5,
    str.length
  )}">${str.substring(index + 5, str.length)}</a>`;

  return result;
}

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
  for (let message of messages) {
    if (message.sender_id == null) {
      document.querySelector(".message-container").innerHTML += `
      <div class="message-body card bg-primary">
        <button data-message-id="${
          message.id
        }" class="btn btn-primary message-content" type="button" data-toggle="collapse" data-target="#a${
        message.id
      }" 
        aria-expanded="false" aria-controls="a${
          message.id
        }">From Tecklance</button>
        <div class="collapse" id="a${message.id}">
          <div class="message-box card card-body">
            ${addaHrefTag(message.content)}
          </div>
        </div>
      </div>
      `;
    } else {
      //
      //need to change?
      //
      document.querySelector(".message-container").innerHTML += `
        <div class="message-body card bg-primary">
          <button data-message-id="${
            message.id
          }" class="btn btn-primary message-content" type="button" data-toggle="collapse" data-target="#a${
            message.id
          }" 
            aria-expanded="false" aria-controls="a${
              message.id
            }">From ${message.username}</button>
            <div class="collapse" id="a${message.id}">
              <div class="message-box card card-body">
              ${addaHrefTag(message.content)}
              </div>
            </div>
        </div>`;
    }
  }

  let messageBoxes = Array.from(document.querySelectorAll(".message-content"));

  messageBoxes.forEach((messageBox) => {
    messageBox.onclick = async () => {
      let messageId = messageBox.dataset.messageId;

      messageBox.style.background = "#262666";

      await fetch("/message/read", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message_id: messageId,
        }),
      });
    };
  });
}

checkLogin();
getMessage();
