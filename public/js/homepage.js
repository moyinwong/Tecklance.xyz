loadTask();

//load tasks from database and show on homepage
async function loadTask() {
    let res = await fetch('/tasks');
    let tasks = await res.json();

    let taskContainer = document.querySelector(".task-container .row");
    taskContainer.innerHTML = "";


    for (task of tasks) {
        taskContainer.innerHTML +=
            `<div class="col-sm-4">
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
            <a href='/task.html?id=${task.id}' class="card-link task-link" data-id='${task.id}'>VIEW TASK</a>
          </div>
        </div>
      </div>`
    }
    setUpViewTaskLink();
}

loadTask();