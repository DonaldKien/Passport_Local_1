let express		= require("express");
let mongoose	= require("mongoose");
let bodyParser	= require("body-parser");
let User 		= require("./models/user");
let passport	= require("passport");
let LocalStrategy = require("passport-local");

mongoose.connect("mongodb+srv://project_1:abc123!@cluster0.mibfu.mongodb.net/passport-local-1?retryWrites=true&w=majority");
let app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(require("express-session")({
	secret: "this sentence use to encode and decode data",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// =================================================
// SCREEN
// =================================================

app.get("/", (request, response) => {
	response.render("home")	
});

app.get("/register", (request, response) => {
	response.render("register")
});

app.get("/secret", isLoggedIn, (request, response) => {
	response.render("secret")
});

// =================================================
// SIGN UP
// =================================================

app.post("/register", (request, response) => {
	User.register(
		new User({username:request.body.username}),
		request.body.password,
		(err, user) => {
			if (err) {
				console.log(err);
				response.render("register");
			}
			passport.authenticate("local")(request, response, () => {
				response.redirect("secret");
			})
		}
	)
});

// =================================================
// LOG IN
// =================================================

// SHOW LOG IN FORM
app.get('/login', (request, response) => {
	response.render('login');
})

app.post(
	'/login', 
	passport.authenticate(
		"local",
		{successRedirect:"/secret", failureRedirect:"/login"}
	),
	(request, response) => {}
);

// =================================================
// CHECK IS LOG IN
// =================================================

function isLoggedIn (request, response, next) {
	if (request.isAuthenticated()) {
		return next();
	} else {
		response.redirect("/login");
	}
}

// =================================================
// LOG OUT
// =================================================

app.get('/logout', (request, response) => {
	request.logout();
	response.redirect("/");
})

// =================================================
// PORT CONNECT
// =================================================

app.listen( 3000, () => {
	console.log("auth_demo_app_2 had connected")
});




