//login button
document.querySelector('.login-button').onclick = () => {
  location.href = "/login.html"
}

//home logo button
document.querySelector('.logo-button').onclick = () => {
  location.href = "/"
}

//load info of particular task from database
async function main() {
  let urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get("id");
  let res = await fetch(`/task/${id}`, {
    method: "GET",
  });
  let task = await res.json();
  console.log(task);
  document.title = task.title;
  let titleContainer = document.querySelector("#title");
  let contentContainer = document.querySelector("#content");
  let categoryContainer = document.querySelector("#info");

  titleContainer.innerHTML = "";
  contentContainer.innerHTML = "";
  categoryContainer.innerHTML = "";

  titleContainer.innerHTML += task.title;
  contentContainer.innerHTML += task.content;
  categoryContainer.innerHTML += task.category;
}

main();
