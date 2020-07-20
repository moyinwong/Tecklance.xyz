async function createTask(event) {
  try {
    event.preventDefault();

    const form = event.target;

    const formData = new FormData();

    formData.append("title", form.title_input.value);
    formData.append("content", form.content_input.value);
    formData.append("category", form.category.value);

    //append image in the last step
    if (form.image) {
      formData.append("image", form.image.files[0]);
    }

    //app.post
    let res = await fetch("/create-task", {
      method: "POST",
      body: formData,
    });
    if ((res.status = 401)) {
      console.log(res);
    }
  } catch (err) {
    console.log(err);
  }
}

document.querySelector("#task-form").addEventListener("submit", createTask);
