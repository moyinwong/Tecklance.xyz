loadTask();
checkLogin();
loadFreelancer();

//login button
document.querySelector(".login-button").onclick = () => {
  location.href = "/login.html";
};

//home logo button
document.querySelector(".logo-button").onclick = () => {
  location.href = "/";
};

//select all navbar links
let inputs = document.querySelectorAll(".category-link");

//navbar show all button
document.querySelector(".category-all").onclick = async () => {
  let res = await fetch("/tasks");
  let tasks = await res.json();

  let taskHeader = document.querySelector(".task-container h2");
  taskHeader.innerHTML = "TASKS";

  let taskContainer = document.querySelector(".task-container .container .row");
  let freelanceContainer = document.querySelector(".freelancer-container");
  taskContainer.innerHTML = "";
  freelanceContainer.innerHTML = "";

  for (task of tasks) {
    taskContainer.innerHTML += `
    <div class="col-md-3">
    <div class="card">
    <div class="image">
    <a href="/task.html?id=${task.id}"><img src="/uploads/${task.image_task}" class="card-img-top img-thumbnail" alt="..."></div>
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.content}</p>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">${task.category}</li>
    </ul>
  </div>`;
  }
};

//load tasks from database and show on homepage
async function loadTask() {
    let urlParams = new URLSearchParams(window.location.search);
    let category = urlParams.get("category");

    if (category === 'all') {
        let res = await fetch("/tasks");
        let tasks = await res.json();

        let taskContainer = document.querySelector(".task-container .container .row");
        let freelanceContainer = document.querySelector(".freelancer-container");
        taskContainer.innerHTML = "";
        freelanceContainer.innerHTML = "";

        for (task of tasks) {
            taskContainer.innerHTML += `
            <div class="col-md-3">
            <div class="card">
            <div class="image">
            <a href="/task.html?id=${task.id}"><img src="/uploads/${task.image_task}" class="card-img-top img-thumbnail" alt="..."></div>
            <div class="card-body">
                <h5 class="card-title">${task.title}</h5>
                <p class="card-text">${task.content}</p>
            </div>
            <ul class="list-group list-group-flush">
            <li class="list-group-item">${task.category}</li>
            </ul>
        </div>`;
        }
    } else {
        let res = await fetch(`/category?category=${category}`);
        let tasks = await res.json();

        let taskContainer = document.querySelector(".carousel-inner");
        taskContainer.innerHTML = "";
        taskContainer.innerHTML += `
        <div class="carousel-item active">
            <div class="col-md-4">
            <div class="card">
                <div class="image">
                <a href="/task.html?id=${tasks[0].id}"><img src="/uploads/${tasks[0].image_task}" class="card-img-top" alt="...">
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
            <div class="carousel-item">
            <div class="col-md-4">
                <div class="card">
                <div class="image">
                    <a href="/task.html?id=${task.id}"><img src="/uploads/${task.image_task}" class="card-img-top" alt="...">
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
            </div>`;
        }
        loadTaskSlider();
    }
}

async function loadFreelancer() {
  let res = await fetch("/freelancers");
  let freelancers = await res.json();

  let freelancerContainer = document.querySelector(".freelancer-carousel");
  freelancerContainer.innerHTML = "";
  freelancerContainer.innerHTML += `
  <div class="carousel-item active">
    <div class="col-md-4">
      <div class="card">
      <div class="image">
        <img src="/uploads/${
          freelancers[0].image_user
        }" class="card-img-top" alt="..."></div>
        <div class="card-body">
          <h5 class="card-title">${
            freelancers[0].first_name + " " + freelancers[0].last_name
          }</h5>
          <p class="card-text">${freelancers[0].freelancer_intro}</p>
         </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">${freelancers[0].email}</li>
        </ul>
      </div>
    </div>
  </div>`;

  for (let i = 1; i < freelancers.length; i++) {
    let freelancer = freelancers[i];

    freelancerContainer.innerHTML += `
      <div class="carousel-item">
      <div class="col-md-4">
        <div class="card">
        <div class="image">
          <img src="/uploads/${
            freelancer.image_user
          }" class="card-img-top" alt="..."></div>
          <div class="card-body">
            <h5 class="card-title">${
              freelancer.first_name + " " + freelancer.last_name
            }</h5>
            <p class="card-text">${freelancer.freelancer_intro}</p>
           </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">${freelancer.email}</li>
          </ul>
        </div>
      </div>
    </div>`;
  }
  loadFreelancerSlider();
}

// Main page slider logic
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

// Main page freelancer slider logic
function loadFreelancerSlider() {
  $("#recipeCarousel-freelancer").carousel({
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

loadTask();
checkLogin();
loadFreelancer();
