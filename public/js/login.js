//login form
document
  .querySelector("#login-form")
  .addEventListener("submit", async function (event) {
    //stop /login action and redirect
    event.preventDefault();

    //use "this" in function, do not use arrow function
    const form = this;
    const formObject = {};
    formObject["email"] = form.email.value;
    formObject["password"] = form.password.value;

    //send json to backend
    const res = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject),
    });

    console.log(res.status);

    if (res.status === 200) {
      //do something if login success
      //
      //
    } else if (res.status === 401) {
      //do something if login fail
      //
      //
    }
  });
