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

//populate load tasks logic over each link
for (let i = 0; i < inputs.length; i++) {
  inputs[i].onclick = async () => {
    let categoryName = inputs[i].innerHTML.toLowerCase();
    let res = await fetch(`/category?category=${categoryName}`);

    let tasks = await res.json();

    let taskHeader = document.querySelector(".task-container h2");
    taskHeader.innerHTML = categoryName;

    let taskContainer = document.querySelector(
      ".task-container .container .row"
    );
    taskContainer.innerHTML = "";
    taskContainer.innerHTML += `
    <div id="recipeCarousel" class="carousel slide w-100" data-ride="carousel">
          <div class="carousel-inner w-100" role="listbox">
        </div>
        <a class="carousel-control-prev w-auto" href="#recipeCarousel" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon bg-dark border border-dark rounded-circle"
              aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a class="carousel-control-next w-auto" href="#recipeCarousel" role="button" data-slide="next">
            <span class="carousel-control-next-icon bg-dark border border-dark rounded-circle"
              aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </a>
      </div>`;

    let carouselContainer = document.querySelector(".carousel-inner");
    carouselContainer.innerHTML = "";

    carouselContainer.innerHTML += `
    <div class="carousel-item active">
      <div class="col-md-4">
      <div class="card">
      <div class="image">
      <a href="/task.html?id=${tasks[0].id}"><img src="/uploads/${tasks[0].image_task}" class="card-img-top" alt="..."></div>
        <div class="card-body">
          <h5 class="card-title">${tasks[0].title}</h5>
          <p class="card-text">${tasks[0].content}</p>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">${tasks[0].category}</li>
      </ul>
    </div>
    </div>
      </div>
    </div>`;

    for (let i = 1; i < tasks.length; i++) {
      let task = tasks[i];

      carouselContainer.innerHTML += `
        <div class="carousel-item">
        <div class="col-md-4">
        <div class="card">
        <div class="image">
        <a href="/task.html?id=${task.id}"><img src="/uploads/${task.image_task}" class="card-img-top" alt="..."></div>
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
  };
}

//load tasks from database and show on homepage
async function loadTask() {
  let res = await fetch("/tasks");
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
  async function checkAdmin() {
    let res = await fetch("/checkAdmin");
    if (res.status === 200) {
      document.querySelector("#admin-link").style.display = "block";
    }
  }

  await checkAdmin();

  let res = await fetch("/current-user");
  let user = await res.json();

  if (res.status == 200 && user) {
    if (user.image_user) {
      document.querySelector(".login-button-container").innerHTML = `
    <div><button onclick="openNav()" class="user-profile-button" type="button"><img class="user-profile-img img-fluid" src="/uploads/${user.image_user}"></button></div>
    <div>${user.username}</div>
    <button class="login-button" type="button" onclick="location.href='/logout'">LOG OUT</button>`;
    } else {
      document.querySelector(".login-button-container").innerHTML = `
      <div><button onclick="openNav()" class="user-profile-button" type="button"><i class="far fa-user"></i></button></div>
      <div>${user.username}</div>
      <button class="login-button" type="button" onclick="location.href='/logout'">LOG OUT</button>`;
    }

    //display message bubble
    if (user && user.id) {
      //console.log(user);
      const resMessages = await fetch("/message/unread");
      const messages = await resMessages.json();
      if (messages.length) {
        document.getElementById("message-number-bubble").innerHTML =
          messages.length;
        document.getElementById("message-bubble").style.display = "block";
        document.getElementById("message-bubble").onclick = () => {
          window.location = "admin/message.html";
        };
      }
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
