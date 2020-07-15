async function createTask(event) {
  try {
    //get values from HTML
    const titleInput = document.querySelector("#title-input").value;
    const contentInput = document.querySelector("#content-input").value;
    const categorySelected = document.querySelector("#category").value;

    //app.post
    let res = await fetch("/create-task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        title: titleInput,
        content: contentInput,
        category: categorySelected,
      }),
    });
    if ((res.status = 401)) {
      console.log(res);
    }
  } catch (err) {
    console.log(err);
  }
}

document.querySelector("#submit").addEventListener("click", createTask);
