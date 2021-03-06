//check login
async function checkLogin() {
  //home logo button
  document.querySelector(".logo-button").onclick = () => {
    location.href = "/";
  };

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
    if (document.querySelector("#remain_amt")) {
      document.querySelector("#remain_amt").innerHTML = user.remain_amt;
    }
  }
  //display message bubble
  if (document.getElementById("message-number-bubble")) {
    if (user && user.id) {
      //console.log(user);
      const resMessages = await fetch("/message/unread");
      const messages = await resMessages.json();
      if (messages.length) {
        document.getElementById("message-number-bubble").innerHTML =
          messages.length;
        document.getElementById("message-bubble").style.display = "block";
        document.getElementById("message-bubble").onclick = () => {
          window.location = "/messages";
        };
      }
    }
  }
}

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

//accept files event
async function acceptFiles() {
  const res = await fetch("/acceptFiles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resMessage = await res.json();
  if (res.status === 201) {
    //add class to show alert
    document.querySelector("#response").innerHTML = resMessage;
    document.querySelector("#response").classList.add("show");
    setTimeout(() => {
      document.querySelector("#response").classList.remove("show");
    }, 3000);
    setTimeout(() => {
      location.reload();
    }, 3000);
  }
}

//reject files event
async function rejectFiles() {
  const res = await fetch("/rejectFiles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resMessage = await res.json();
  if (res.status === 201) {
    //add class to show alert
    document.querySelector("#response").innerHTML = resMessage;
    document.querySelector("#response").classList.add("show");
    setTimeout(() => {
      document.querySelector("#response").classList.remove("show");
    }, 3000);
  }
}

//display uploaded files
async function getUploadFiles() {
  const res = await fetch("/getUploadFiles");
  if (res.status !== 200) {
    return;
  }

  const uploadedFiles = await res.json();

  for (let i = 0; i < uploadedFiles.length; i++) {
    document.getElementById("uploaded_container").style.display = "block";
    document.getElementById("uploaded_table").innerHTML += `
    <li class="list-group-item">
      <a href="http://localhost:8080/admin/task_submission/${uploadedFiles[i].filename}"
      download="${uploadedFiles[i].filename}">${uploadedFiles[i].filename}</a>
    </li>
  `;
  }
}

//check task status
async function checkTaskStatus() {
  let res = await fetch("/taskstatus");
  if (res.status !== 200) {
    return;
  }

  let taskStatus = await res.json();
  return taskStatus;
}

//check login function
async function checkLoginAndFillIn() {
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
  }

  let urlParams = new URLSearchParams(window.location.search);
  let taskId = urlParams.get("id");
  let taskRes = await fetch(`/task/${taskId}`, {
    method: "GET",
  });
  let task = await taskRes.json();

  //disable apply button if not open
  if (task.status !== "open") {
    document.getElementById("apply-button").style.display = "none";
  }

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
        content.setAttribute("contenteditable", "true");
        // console.log("set");
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
    if (task.accepted_user_id === user.id) {
      // accepted user display
      document.getElementById("bottom-container").style.display = "none";
      document.getElementById("submit-form").style.display = "block";
      getUploadFiles();
    } else if (task.creator_id == user.id) {
      //creator display
      let applyButton = document.getElementById("apply-button");
      let bottomContainer = document.getElementById("bottom-middle");
      let applicantListContainer = document.getElementById(
        "applicant-list-container"
      );
      let applicantList = document.getElementById("applicant-list");

      applyButton.style.display = "none";

      const aa = task;
      console.log(aa);
      if (task.status === "open") {
        bottomContainer.innerHTML = `
        <div class="edit" data-id="${task.id}">EDIT TASK</div>
        <div class="delete" data-id="${task.id}">DELETE TASK</div>
        `;
      }

      let acceptedRes = await fetch(
        `/task/accepted-applicant/${task.accepted_user_id}`
      );
      let acceptedUser = await acceptedRes.json();

      await getUploadFiles();
      let taskStatus = await checkTaskStatus();
      if (taskStatus.status === "completed" || taskStatus.status === "paid") {
        let acceptanceButton = document.getElementById(
          "files-acceptance-button-container"
        );
        acceptanceButton.style.display = "block";
        acceptanceButton.innerHTML = `
        <div id="fulfilled-message">TASK FULFILLED</div>`;
      } else {
        document.getElementById(
          "files-acceptance-button-container"
        ).style.display = "flex";
      }

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
  }
  //fill in offered amt & status
  document.querySelector("#offered_amt").innerHTML = task.offered_amt;
  document.querySelector("#status").innerHTML = task.status;
  setupTrashButtons();
  setupEditButtons();
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

function setupEditButtons() {
  const editButton = document.querySelector(".edit");
  editButton.onclick = async function () {
    const id = editButton.getAttribute("data-id");
    const editContent = document.querySelector("#content").innerHTML.trim();
    const res = await fetch(`/task/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ editContent }),
    });

    if (res.status == 200) {
      alert("Successfully Updated");
      window.location = `/task.html?id=${id}`;
    }
    if (res.status === 401) {
      alert("Please login!");
      window.location = "/login.html";
      return;
    }
    const result = await res.json();
  };
}

//user apply task
document.querySelector("#apply-button").onclick = async () => {
  const getUserRes = await fetch("/getUserId");

  //if user is not logged in
  if (getUserRes.status === 401) {
    const resObj = await getUserRes.json();

    document.querySelector("#response").innerHTML = resObj.message;
    document.querySelector("#response").classList.add("show");
    setTimeout(() => {
      document.querySelector("#response").classList.remove("show");
    }, 3000);

    return;
  }
  const userId = await getUserRes.json();

  //console.log(userId);

  let urlParams = new URLSearchParams(window.location.search);
  let taskId = urlParams.get("id");

  //console.log(taskId);

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
checkLoginAndFillIn();

//for submit completed task
//restrict the upload file size
const uploadField = document.getElementById("uploaded_files");

uploadField.onchange = function () {
  for (let i = 0; i < this.files.length; i++) {
    if (this.files[i].size > 2097152) {
      alert("Over 2MB size is not allowed");
      this.value = "";
    }
  }
};

//upload task files
async function uploadTaskFiles(event) {
  //stop signup action
  event.preventDefault();

  const form = event.target;

  const formData = new FormData();

  // console.log(form.uploaded_files.files);

  if (form.uploaded_files.files.length) {
    for (let i = 0; i < form.uploaded_files.files.length; i++) {
      formData.append("uploaded_files", form.uploaded_files.files[i]);
    }
  } else {
    // **need to adjust css
    alert("no file is selected");
    return;
  }

  //send json to backend
  const res = await fetch("submit-completed-task", {
    method: "POST",
    body: formData,
  });

  const message = await res.json();
  alert(message);

  //clear the file
  document.getElementById("uploaded_files").value = "";
}

document
  .querySelector("#submit-completed-task")
  .addEventListener("submit", uploadTaskFiles);

//add onclick event to accept button
document
  .getElementById("accept-file-button")
  .addEventListener("click", acceptFiles);

//add onclick event to reject button
document
  .getElementById("reject-file-button")
  .addEventListener("click", rejectFiles);
