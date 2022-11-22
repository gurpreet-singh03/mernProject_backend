const express = require("express");// Express Allows to set up middlewares to respond to HTTP Requests .
// The Path module provides a way of working with directories and file paths.
const path = require("path");
// The path.join() method joins the specified path segments into one path.
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

const app = express();// initializing router
// The express.json() function is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());
//  built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(express.urlencoded({ extended: false }));

// Handlebars provides the power necessary to let you build semantic templates effectively with no frustration.
const hbs = require("hbs");
// registerPartials provides a quick way to load all partials from a specific directory
hbs.registerPartials(partials_path);
// To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
// The app.use() function is used to mount the specified middleware function
// The middleware function is executed when the base of the requested path matches the path.
app.use(express.static(static_path));
// The app.set() function is used to assigns the setting name to value. You may store any value that you want, but certain names can be used to configure the behavior of the server.
app.set("view engine", "hbs");
app.set("views", template_path);
// This is the minimum needed to connect the myapp database running locally on the default port (27017).
require("./db/conn");
const Register = require("./models/register");``
const port = process.env.PORT || 3000;
//console.log(path.join(__dirname, "../public"));
// app.get(): This function tells the server what to do when get requests at a given route.
// The res. render() function is used to render a view and sends the rendered HTML string to the client.
app.get("/", (req, res) => {
    //res.send("welcome to web development training")
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("register");
});

// The app.listen() function is used to bind and listen the connections on the specified host and port
app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})

//app.use(express.static(static_path));
// The app.post() function routes the HTTP POST requests to the specified path with the specified callback functions.
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                // gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            })
            const registered = await registerEmployee.save();
            res.status(201).render("index");
        } else {
            res.send("passwords are not matching")
        }
    } catch (error) {
        res.status(400).send(error);
    }
});
