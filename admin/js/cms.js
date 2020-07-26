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
  <div><button onclick="openNav()" class="user-profile-button" type="button"><img class="user-profile-img img-fluid" src="/uploads/${user.image_user}"></button></div>
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

async function loadAppliedTask() {
let userRes = await fetch("/current-user");
let user = await userRes.json();
let res = await fetch(`/usertask/${user.id}`);
let tasks = await res.json();
let taskContainer = document.getElementById("applied");
taskContainer.innerHTML = "";
taskContainer.innerHTML += `
  <div class="carousel-item active">
    <div class="col-md-4">
      <div class="card">
        <div class="image">
          <a href="../task.html?id=${tasks[0].task_id}"><img src="/uploads/${tasks[0].image_task}" class="card-img-top" alt="..."></a>
        </div>
          <div class="card-body">
            <h5 class="card-title">${tasks[0].title}</h5>
            <p class="card-text">${tasks[0].content}</p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">${tasks[0].category}</li>
          </ul>
      </div>
    </div>
  </div>`;

for (let i = 1; i < tasks.length; i++) {
  let task = tasks[i];
  
    taskContainer.innerHTML += `
<<<<<<< HEAD
      <div class="carousel-item">
        <div class="col-md-4">
          <div class="card">
            <div class="image">
              <a href="../task.html?id=${task.task_id}"><img src="/uploads/${task.image_task}" class="card-img-top" alt="..."></a>
            </div>
            <div class="card-body">
              <h5 class="card-title">${task.title}</h5>
              <p class="card-text">${task.content}</p>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">${task.category}</li>
            </ul>
          </div>
        </div>
      </div>`
=======
  <div class="carousel-item">
  <div class="col-md-4">
  <div class="card">
  <div class="image">
    <a href="../task.html?id=${task.task_id}"><img src="/uploads/${task.image_task}" class="card-img-top" alt="..."></a></div>
    <div class="card-body">
      <h5 class="card-title">${task.title}</h5>
      <p class="card-text">${task.content}</p>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">${task.category}</li>
    </ul>
    <div class="card-body">
      <a href="/task.html?id=${task.task_id}" class="card-link task-link">VIEW TASK</a>
    </div>
  </div>
</div>
</div>`
>>>>>>> 1ad257b777af610d0b513bcd66767b371f2665b2
  
}
loadTaskSlider();
}

async function loadPostedTask() {
let userRes = await fetch("/current-user");
let user = await userRes.json();
let res = await fetch(`/create-task/${user.id}`);
let tasks = await res.json();
let taskContainer = document.getElementById("posted");
taskContainer.innerHTML = "";
taskContainer.innerHTML += `
  <div class="carousel-item active">
    <div class="col-md-4">
      <div class="card">
        <div class="image">
          <a href="../task.html?id=${tasks[0].id}"><img src="/uploads/${tasks[0].image_task}" class="card-img-top" alt="..."></a>
        </div>
        <div class="card-body">
          <h5 class="card-title">${tasks[0].title}</h5>
          <p class="card-text">${tasks[0].content}</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">${tasks[0].category}</li>
        </ul>
      </div>
    </div>
  </div>`;

for (let i = 1; i < tasks.length; i++) {
  let task = tasks[i];
  console.log(task.id)
    taskContainer.innerHTML += `
      <div class="carousel-item">
        <div class="col-md-4">
          <div class="card">
            <div class="image">
              <a href="../task.html?id=${task.id}"><img src="/uploads/${task.image_task}" class="card-img-top" alt="..."></a>
            </div>
            <div class="card-body">
              <h5 class="card-title">${task.title}</h5>
              <p class="card-text">${task.content}</p>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">${task.category}</li>
            </ul>
          </div>
        </div>
      </div>`
  
}
loadTaskSlider();
}

function loadTaskSlider() {
$("#recipeCarousel-apply").carousel({
  interval: 20000,
});
$("#recipeCarousel-post").carousel({
  interval: 20000,
});
$(".carousel .carousel-item").each(function () {
  var minPerSlide = 3;
  var next = $(this).next();
  if (!next.length) {
    next = $(this).siblings(":first");
  }
  next.children(":first-child").clone().appendTo($(this));

  for (var i = 0; i < minPerSlide; i++) {
    next = next.next();
    if (!next.length) {
      next = $(this).siblings(":first");
    }

    next.children(":first-child").clone().appendTo($(this));
  }
});
}

loadAppliedTask();
loadPostedTask();
checkLogin();

