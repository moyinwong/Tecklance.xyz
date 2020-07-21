//login button
document.querySelector(".login-button").onclick = () => {
  location.href = "/login.html";
};

//home logo button
document.querySelector(".logo-button").onclick = () => {
  location.href = "/";
};

//load info of particular task from database
async function main() {
  let urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get("id");
  let res = await fetch(`/task/${id}`, {
    method: "GET",
  });
  let task = await res.json();
  //console.log(task);
  document.title = task.title;
  let titleContainer = document.querySelector("#title");
  let imageContainer = document.querySelector("#image");
  let contentContainer = document.querySelector("#content");
  let categoryContainer = document.querySelector("#info");

  titleContainer.innerHTML = "";
  imageContainer.innerHTML = "";
  contentContainer.innerHTML = "";
  categoryContainer.innerHTML = "";

  titleContainer.innerHTML += task.title;
  imageContainer.innerHTML += `<img class="img-fluid" src="/uploads/${task.image_task}">`
  contentContainer.innerHTML += task.content;
  categoryContainer.innerHTML += task.category;
}

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
    } 
    
    else {
      document.querySelector(".login-button-container").innerHTML = `
      <div><button onclick="openNav()" class="user-profile-button" type="button"><i class="far fa-user"></i></button></div>
      <div>${user.username}</div>
      <button class="login-button" type="button" onclick="location.href='/logout'">LOG OUT</button>`;
    }
  }
}

//user apply task
document.querySelector("#apply-button").onclick = async () => {
  const getUserRes = await fetch("/getUserId");
  if (getUserRes.status === 401) {
    const resObj = await getUserRes.json();
    alert(resObj.message);
    return;
  }
  const userId = await getUserRes.json();

  console.log(userId);

  let urlParams = new URLSearchParams(window.location.search);
  let taskId = urlParams.get("id");

  console.log(taskId);

  const res = await fetch(`/apply/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      applied_user_id: userId,
    }),
  });
};

main();
checkLogin();
