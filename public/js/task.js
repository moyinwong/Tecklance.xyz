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
  imageContainer.innerHTML += `<img class="img-fluid" src="/uploads/${task.image_task}">`;
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
    } else {
      document.querySelector(".login-button-container").innerHTML = `
      <div><button onclick="openNav()" class="user-profile-button" type="button"><i class="far fa-user"></i></button></div>
      <div>${user.username}</div>
      <button class="login-button" type="button" onclick="location.href='/logout'">LOG OUT</button>`;
    }
  }

  let urlParams = new URLSearchParams(window.location.search);
  let taskId = urlParams.get("id");
  let taskRes = await fetch(`/task/${taskId}`, {
    method: "GET",
  });
  let task = await taskRes.json();

  if (task.accepted_user_id == null) {
    if (taskRes.status == 200 && task && res.status == 200) {
      if (task.creator_id == user.id) {
        let applyButton = document.getElementById("apply-button");
        let bottomContainer = document.getElementById("bottom-middle");
        let applicantListContainer = document.getElementById(
          "applicant-list-container"
        );
        let applicantList = document.getElementById("applicant-list");

        applyButton.style.display = "none";
        bottomContainer.innerHTML = `
          <div class="edit" data-id="${task.id}">EDIT TASK</div>
          <div class="delete" data-id="${task.id}">DELETE TASK</div>
        `;
        const content = document.getElementById("content");
        content.setAttribute("contenteditable", "true")
        console.log("set")
        let applicantRes = await fetch(`/task/applicants/${taskId}`);
        let applicants = await applicantRes.json();
        let today = new Date();

        applicantListContainer.style.display = "block";
        applicantList.innerHTML = "";
        for (let applicant of applicants) {
          //get the Millisecond of today date & applied date
          let todayMillisecond = Date.parse(today);
          let applyDayMillisecond = Date.parse(applicant.applied_date);
          let differenceInTime = todayMillisecond - applyDayMillisecond;

          //get difference in day by dividing by (1000 * 60 * 60 *24)
          let differenceInDay = differenceInTime / (1000 * 3600 * 24);

          if (differenceInDay < 1) {
            differenceInDay = 1;
            applicantList.innerHTML += `
              <a class="list-group-item list-group-item-action" data-toggle="collapse" 
              href="#a${applicant.id}" aria-expanded="false" aria-controls="a${
              applicant.id
            }">
                  <div class="d-flex w-100 justify-content-between applicant-detail">
                    <h5 class="mb-1">${
                      applicant.first_name + " " + applicant.last_name
                    }</h5>
                    <small>Applied Today</small>
                  </div>
                  <small>${applicant.email}</small>
              </a>
              <div class="collapse" id="a${applicant.id}">
                <div class="card card-body">
                  <p class="mb-1">${applicant.freelancer_intro}</p>
                  <button onclick="acceptApplicant(${
                    applicant.id
                  }, ${taskId})" type="button" class="btn btn-success accept-button">CHOOSE THIS APPLICANT</button>
                </div>       
              </div>
            `;
          } else {
            applicantList.innerHTML += `
              <a class="list-group-item list-group-item-action" data-toggle="collapse" 
              href="#a${applicant.id}" aria-expanded="false" aria-controls="a${
              applicant.id
            }">
                  <div class="d-flex w-100 justify-content-between applicant-detail">
                    <h5 class="mb-1">${
                      applicant.first_name + " " + applicant.last_name
                    }</h5>
                    <small>Applied ${Math.round(
                      differenceInDay
                    )} days ago</small>
                  </div>
                  <small>${applicant.email}</small>
              </a>
              <div class="collapse" id="a${applicant.id}">
                <div class="card card-body">
                  <p class="mb-1">${applicant.freelancer_intro}</p>
                  <button onclick="acceptApplicant(${
                    applicant.id
                  }, ${taskId})" type="button" class="btn btn-success accept-button">CHOOSE THIS APPLICANT</button>
                </div>       
              </div>
            `;
          }
        }
      }
    }
  } else if (taskRes.status == 200 && task && res.status == 200) {
    let applyButton = document.getElementById("apply-button");
    let bottomContainer = document.getElementById("bottom-middle");
    let applicantListContainer = document.getElementById(
      "applicant-list-container"
    );
    const applicantList = document.getElementById("applicant-list");

    applyButton.style.display = "none";
    bottomContainer.innerHTML = `
      <div class="edit" data-id="${task.id}">EDIT TASK</div>
      <div class="delete" data-id="${task.id}">DELETE TASK</div>
      `;

    let acceptedRes = await fetch(
      `/task/accepted-applicant/${task.accepted_user_id}`
    );
    let acceptedUser = await acceptedRes.json();

    applicantListContainer.style.display = "block";
    applicantList.innerHTML = `
    <a class="list-group-item list-group-item-action" data-toggle="collapse" 
    href="#a${acceptedUser.id}" aria-expanded="false" aria-controls="a${
      acceptedUser.id
    }">
        <div class="d-flex w-100 justify-content-between applicant-detail">
          <h5 class="mb-1">${
            acceptedUser.first_name + " " + acceptedUser.last_name
          }</h5>
          <small style="color: green;">CHOSEN APPLICANT</small>
        </div>
        <small>${acceptedUser.email}</small>
    </a>
    <div class="collapse show" id="a${acceptedUser.id}">
      <div class="card card-body">
        <p class="mb-1">${acceptedUser.freelancer_intro}</p>
        <div class="alert alert-warning" role="alert">
          You have chosen this applicant
        </div>
      </div>       
    </div>
    `;
  }

  //fill in offered amt & status
  document.querySelector("#offered_amt").innerHTML = task.offered_amt;
  document.querySelector("#status").innerHTML = task.status;
  setupTrashButtons();
}

//set up accept applicant button function
async function acceptApplicant(userId, taskId) {
  let res = await fetch(`/task/accept`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_Id: userId, task_Id: taskId }),
  });

  if (res.status == 200) {
    alert("Applicant chosen!");
    window.location.href = "/admin/cms.html";
  }
}

//set up delete button
function setupTrashButtons() {
  const deleteButton = document.querySelector(".delete");
  deleteButton.onclick = async function () {
    const id = deleteButton.getAttribute("data-id");
    const res = await fetch(`/task/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    if (res.status == 200) {
      alert("Successfully Deleted");
      window.location = "/";
    } else if (res.status == 400) {
      alert(await res.json);
    } else if (res.status === 401) {
      alert("Please login!");
      window.location = "/login.html";
      return;
    }
  };
}

function setupEditButtons(){
  const editButton = document.querySelector(".edit");
  editButton.onclick = async function (){
    const id = editButton.getAttribute("data-id");
    const res = await fetch(`/task/${id}`, {
      method: "PUT",
      headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({editContent:editContent})
    });
    if (res.status == 200) {
      alert("Successfully Deleted");
      window.location = `/task/${id}`;
    }
    if(res.status === 401){
      alert("Please login\!");
      window.location = "/login.html";
      return;
  }
  const result = await res.json();
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

  if (res.status == 200) {
    alert("Successfully applied");
    window.location = "/";
  } else if (res.status == 201) {
    let resObj = await res.json();
    alert(resObj.message);
  } else {
    alert(await res.json().message);
  }
};

main();
checkLogin();
