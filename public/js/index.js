loadTask();
checkLogin();

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
document.querySelector('.category-all').onclick = async () => {
  let res = await fetch("/tasks");
  let tasks = await res.json();

  let taskHeader = document.querySelector('.task-container h2')
  taskHeader.innerHTML = 'TASKS'

  let taskContainer = document.querySelector(".task-container .container .row");
  let freelanceContainer = document.querySelector('.freelancer-container');
  taskContainer.innerHTML = "";
  freelanceContainer.innerHTML = "";

  for (task of tasks) {
      taskContainer.innerHTML += `
    <div class="col-md-3">
    <div class="card">
      <img src="/uploads/${task.image}" class="card-img-top img-thumbnail" alt="...">
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
  </div>`
    } 
    
  

};

//populate load tasks logic over each link
for (let i = 0; i < inputs.length; i++) {
  inputs[i].onclick = async () => {
    let categoryName = inputs[i].innerHTML.toLowerCase();
    let res = await fetch(`/category?category=${categoryName}`);

    let tasks = await res.json();
    
    let taskHeader = document.querySelector('.task-container h2')
    taskHeader.innerHTML = categoryName;
    
    let taskContainer = document.querySelector(".task-container .container .row");
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
        <img src="/uploads/${tasks[0].image}" class="card-img-top" alt="..."> 
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
    </div>`
    
    

    for (let i = 1; i < tasks.length; i++) {
      let task = tasks[i];

        carouselContainer.innerHTML += `
        <div class="carousel-item">
        <div class="col-md-4">
        <div class="card">
          <img src="/uploads/${task.image}" class="card-img-top" alt="...">
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
      </div>`
      
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
  taskContainer.innerHTML += `<div class="carousel-item active">
  <div class="col-md-4">
  <div class="card">
  <img src="/uploads/${tasks[0].image}" class="card-img-top" alt="...">
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
      <img src="/uploads/${task.image}" class="card-img-top" alt="..."> 
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
  </div>`
    
  }
  loadTaskSlider();
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

async function checkLogin() {
  let res = await fetch("/current-user");
  let user = await res.json();
  // console.log(user);
  console.log(res);
  if (res.status == 200 && user) {
    document.querySelector(".login-button-container").innerHTML = `
    <div><button onclick="openNav()" class="user-profile-button" type="button"><i class="far fa-user"></i></button></div>
    <div>${user}</div>
    <button class="login-button" type="button" onclick="location.href='/logout'">LOG OUT</button>`;
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
