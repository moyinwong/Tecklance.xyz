//check login function
export async function checkLogin() {
  let res = await fetch("/current-user");
  let user = await res.json();

  if (res.status == 200 && user) {
    if (user.image_user) {
      //document.querySelector(".login-button-container").innerHTML = `
      //<div><button onclick="openNav()" class="user-profile-button" type="button"><img class="img-fluid" src="/uploads/${user.image_user}"></button></div>
      //<div>${user.username}</div>
      //<button class="login-button" type="button" onclick="location.href='/logout'">LOG OUT</button>`;

      const profileDiv = document.createElement("div");

      const profileButton = document.createElement("button");
      profileButton.setAttribute("onclick", "openNav()");
      profileButton.setAttribute("type", "button");
      profileButton.classList.add("user-profile-button");

      const img = document.createElement("img");
      img.setAttribute("src", `/uploads/${user.image_user}`);

      profileButton.append(img);
      profileDiv.append(profileButton);

      const usernameDiv = document.createElement("div");
      usernameDiv.innerHTML = user.username;

      const button = document.createElement("button");
      button.setAttribute("type", "button");
      button.setAttribute("onclick", "location.href='logout'");
      button.classList.add("login-button");

      document
        .getElementsByClassName(".login-button-container")
        .append(profileDiv);
      document
        .getElementsByClassName(".login-button-container")
        .append(usernameDiv);
      document.getElementsByClassName(".login-button-container").append(button);
    } else {
      document.querySelector(".login-button-container").innerHTML = `
        <div><button onclick="openNav()" class="user-profile-button" type="button"><i class="far fa-user"></i></button></div>
        <div>${user.username}</div>
        <button class="login-button" type="button" onclick="location.href='/logout'">LOG OUT</button>`;
      document.querySelector("#remain_amt").innerHTML = user.remain_amt;
    }
  }
}
