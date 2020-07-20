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
  // console.log(user);
  if (res.status == 200 && user) {
    document.querySelector(".login-button-container").innerHTML = `
    <div><button onclick="openNav()" class="user-profile-button" type="button"><i class="far fa-user"></i></button></div>
    <div>${user}</div>
    <button class="login-button" type="button" onclick="location.href='/logout'">LOG OUT</button>`;
  }
}

async function loadTask() {
  let res = await fetch("/tasks");
  let tasks = await res.json();
  let taskContainer = document.querySelector(".carousel-inner");
  taskContainer.innerHTML = "";
  taskContainer.innerHTML += `<div class="carousel-item active">
  <div class="col-md-4">
  <div class="card">
  <!-- <img src="..." class="card-img-top" alt="..."> -->
  <div class="card-body">
    <h5 class="card-title">${tasks[0].title}</h5>
    <p class="card-text">${tasks[0].content}</p>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">${tasks[0].category}</li>
  </ul>
  <div class="card-body">
    <a href="/task.html?id=${tasks[0].id}" class="card-link task-link">VIEW TASK</a>
  </div>
</div>
</div>
  </div>
</div>`;

  for (let i = 1; i < tasks.length; i++) {
    let task = tasks[i];
    taskContainer.innerHTML += `
    <div class="carousel-item">
    <div class="col-md-4">
    <div class="card">
      <!-- <img src="..." class="card-img-top" alt="..."> -->
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.content}</p>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">${task.category}</li>
      </ul>
      <div class="card-body">
        <a href="/task.html?id=${task.id}" class="card-link task-link">VIEW TASK</a>
      </div>
    </div>
  </div>
  </div>`;
  }
  loadTaskSlider();
}

function loadTaskSlider() {
  $("#recipeCarousel").carousel({
    interval: 10000,
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

  loadTask();
  checkLogin();

