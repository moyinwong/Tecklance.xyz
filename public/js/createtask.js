import { checkLogin } from "./functions.mjs";

async function load() {
  await checkLogin();

  //login button
  document.querySelector(".login-button").onclick = () => {
    location.href = "/login.html";
  };

  //home logo button
  document.querySelector(".logo-button").onclick = () => {
    location.href = "/";
  };

  document.querySelector(".user-profile-button").onclick = () => {
    document.getElementById("mySidenav").style.width = "250px";
  };

  document.querySelector(".closebtn").onclick = () => {
    document.getElementById("mySidenav").style.width = "0";
  };

  async function createTask(event) {
    try {
      event.preventDefault();

      const form = event.target;

      //get user information
      let userRes = await fetch("/current-user");
      let user = await userRes.json();

      const formData = new FormData();

      formData.append("title", form.title_input.value);
      formData.append("content", form.content_input.value);
      formData.append("category", form.category.value);
      formData.append("offered_amt", parseInt(form.offered_amt.value));
      formData.append("remain_amt", parseInt(user.remain_amt));

      //append image in the last step
      if (form.image) {
        formData.append("image", form.image.files[0]);
      }

      //check if there is enough money

      if (
        parseInt(form.offered_amt.value) > parseInt(user.remain_amt) ||
        !form.remain_amt
      ) {
        //add class to show alert
        document.querySelector("#offered_amt_alert").classList.add("show");
        setTimeout(() => {
          document.querySelector("#offered_amt_alert").classList.remove("show");
        }, 3000);
        return;
      }

      //app.post
      let res = await fetch(`/create-task/${user.id}`, {
        method: "POST",
        body: formData,
      });

      if (res.status === 201) {
        document.querySelector("#response").innerHTML = await res.json();
        document.querySelector("#response").classList.add("show");

        setTimeout(() => {
          window.location = "/";
        }, 3000);
      } else {
        document.querySelector("#response").innerHTML = await res.json();
        document.querySelector("#response").classList.add("show");
        setTimeout(() => {
          document.querySelector("#response").classList.remove("show");
        }, 3000);
      }
    } catch (err) {
      console.log(err);
    }
  }

  document.querySelector("#task-form").addEventListener("submit", createTask);
}

load();
