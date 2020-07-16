
loadTask();

document.querySelector('.login-button').onclick = () => {
  location.href="/login.html"
}

//load tasks from database and show on homepage
async function loadTask() {
  let res = await fetch('/tasks');
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
</div>`
  
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
  </div>`
  }
  loadTaskSlider();
}

loadTask();

//Main page slider logic
function loadTaskSlider() {
  $('#recipeCarousel').carousel({
    interval: 10000
  })
  
  $('.carousel .carousel-item').each(function(){
      var minPerSlide = 3;
      var next = $(this).next();
      if (!next.length) {
      next = $(this).siblings(':first');
      }
      next.children(':first-child').clone().appendTo($(this));
      
      for (var i=0;i<minPerSlide;i++) {
          next=next.next();
          if (!next.length) {
            next = $(this).siblings(':first');
          }
          
          next.children(':first-child').clone().appendTo($(this));
        }
  });
  
}


