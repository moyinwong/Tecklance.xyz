//login button
document.querySelector('.login-button').onclick = () => {
  location.href = "/login.html"
}

//home logo button
document.querySelector('.logo-button').onclick = () => {
  location.href = "/"
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

async function createTask(event) {
  try {
    event.preventDefault();

    const form = event.target;

    const formData = new FormData();

    formData.append("title", form.title_input.value);
    formData.append("content", form.content_input.value);
    formData.append("category", form.category.value);
    
    //append image in the last step
    if (form.image) {
      formData.append("image", form.image.files[0]);
    }

    let userRes = await fetch("/current-user");
    let user = await userRes.json();

    //app.post
    let res = await fetch(`/create-task/${user.email}`, {
      method: "POST",
      body: formData,
    });
    if (res.success && res.status == 200) {
      console.log('task created')
    }
    if ((res.status = 401)) {
      console.log(res);
    }
  } catch (err) {
    console.log(err);
  }
}

document.querySelector("#task-form").addEventListener("submit", createTask);


checkLogin();
