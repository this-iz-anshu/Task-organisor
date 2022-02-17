const express = require('express');

require("../db/mongoose.js");

const UserRouter = require("../routers/userRouter");
const taskRouter = require("../routers/taskRouter");

const app = express();
app.use(express.json());
app.use(UserRouter);
app.use(taskRouter);

console.log(process.env.PORT);

app.listen(process.env.PORT, () => {
	console.log("server is up on port" + process.env.PORT);
});


