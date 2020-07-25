//check login function
export async function checkLogin() {
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
    document.querySelector("#remain_amt").innerHTML = user.remain_amt;
  }
}
