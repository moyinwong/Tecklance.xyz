import express from "express";
import expressSession from "express-session";
import path from "path";

const app = express();

//use session
app.use(
  expressSession({
    secret: "Tecky Academy teaches typescript",
    resave: true,
    saveUninitialized: true,
  })
);

// get public/index.html
app.use(express.static("public"));

//redirect to 404 page
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "404.html"));
});

app.listen(8080, () => {
  console.log(`Listening at http://localhost:8080/`);
});
