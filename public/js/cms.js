loadTask();
checkLogin();

//home logo button
document.querySelector(".logo-button").onclick = () => {
  location.href = "/";
};

//load tasks from database and show on homepage
async function loadTask() {
  let res = await fetch('/getUserId');
  let userId = await res.json();
    
  let userTaskRes = await fetch(`/usertask/${userId}`)
  let userTasks = await userTaskRes.json();

  let taskContainer = document.querySelector(".carousel-inner");
  taskContainer.innerHTML = "";
  taskContainer.innerHTML += `<div class="carousel-item active">
  <div class="col-md-4">
  <div class="card">
  <!-- <img src="..." class="card-img-top" alt="..."> -->
  <div class="card-body">
    <h5 class="card-title">${userTasks[0].title}</h5>
    <p class="card-text">${userTasks[0].content}</p>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">${userTasks[0].category}</li>
  </ul>
  <div class="card-body">
    <a href="/task.html?id=${userTasks[0].task_id}" class="card-link task-link">VIEW TASK</a>
  </div>
</div>
</div>
  </div>
</div>`;

  for (let i = 1; i < userTasks.length; i++) {
    let userTask = userTasks[i];
    taskContainer.innerHTML += `
    <div class="carousel-item">
    <div class="col-md-4">
    <div class="card">
      <!-- <img src="..." class="card-img-top" alt="..."> -->
      <div class="card-body">
        <h5 class="card-title">${userTask.title}</h5>
        <p class="card-text">${userTask.content}</p>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">${userTask.category}</li>
      </ul>
      <div class="card-body">
        <a href="/task.html?id=${userTask.task_id}" class="card-link task-link">VIEW TASK</a>
      </div>
    </div>
  </div>
  </div>`;
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
//   console.log(user);
//   console.log(res);
  if (res.status == 200 && user) {
    document.querySelector(".login-button-container").innerHTML = `
    <div><button onclick="openNav()" class="user-profile-button" type="button"><i class="far fa-user"></i></button></div>
    <div>${user}</div>
    <button class="login-button" type="button" onclick="location.href='/logout'">LOG OUT</button>`;
  }
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }
  

loadTask();
checkLogin();
