require("dotenv").config();
const debug = require("debug")("file:root:index");
const chalk = require("chalk");

const connectDB = require("./database/index");
const {initializeServer} =  require("./server/index");
const User = require("./database/models/User");
const bcrypt = require("bcrypt");


const port = process.env.PORT ?? 5000;

(async () => {
  try { 
    await connectDB(process.env.MONGODB_STRING);
    await initializeServer(port);
  } catch (error) {
    debug(chalk.red("PROCESS EXIT"));
    process.exit(1);
  }
})();

// (async () => {
//   debug(chalk.yellow("That's me."));
//   User.create({
//     name: "Rodi",
//     username: "Rodipet",
//     password: await bcrypt.hash("holalapa", 10),
//     photo:
//       "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/mulan-1543323141.jpg?crop=0.502xw:1.00xh;0.250xw,0&resize=640:*",
//     enemies: [],
//     friends: [],
//     bio: "I have a mission",
//   });
// })();

