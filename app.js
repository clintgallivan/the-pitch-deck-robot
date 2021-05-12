// Telegram Voice Chat Bot
const TelegramBot = require("node-telegram-bot-api");

// replace the value below with the Telegram token you receive from @BotFather
const token = "1893311516:AAFLrf9wc85Kzdj_C4uWhRbvYweISUh2bt4";
var express = require("express");
var app = express();

app.set("port", process.env.PORT || 5000);

//For avoidong Heroku $PORT error
app
  .get("/", function (request, response) {
    var result = "App is running";
    response.send(result);
  })
  .listen(app.get("port"), function () {
    console.log(
      "App is running, server is listening on port ",
      app.get("port")
    );
  });
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const today = new Date();
const UTCTime = today.getUTCHours();
// const UTCTime = 12;

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const userName = msg.from.first_name;
  // const userId = msg.from.id;
  if (msg.text === "@PitchDeckRobot enable voice chat") {
    if (UTCTime === 0 || UTCTime === 6 || UTCTime === 12 || UTCTime === 18) {
      bot.sendMessage(
        chatId,
        `${userName}, you can now admin a voice call during the 0, 6, 12 and 18 UTC hour blocks! Please limit the call to 1 hour max!`
      );
      bot.promoteChatMember(chatId, userId, {
        is_anonymous: false,
        can_manage_voice_chats: true,
        can_pin_messages: false,
      });
      setTimeout(() => {
        bot.setChatAdministratorCustomTitle(chatId, userId, "Voice Admin");
      }, 1000);
      console.log("promoted");
    } else {
      bot.sendMessage(
        chatId,
        `Voice chat can only be enabled during hours 0, 6, 12, and 18 UTC. it is currently ${UTCTime} UTC.`
      );
    }
  }
});

bot.on("message", (msg) => {
  // const UTCTime = 0;
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  console.log("hi");

  // console.log(UTCTime);
  if (!(UTCTime == 0 || UTCTime == 6 || UTCTime == 12 || UTCTime == 18) {
    console.log(UTCTime);
    bot.getChatAdministrators(chatId).then((response) => {
      // console.log(response.length);
      for (let i = 0; i < response.length; i++) {
        if (response[i].custom_title === "Voice Admin") {
          // console.log(response[i]);
          console.log("demoted");
          bot.promoteChatMember(chatId, response[i].user.id, {
            is_anonymous: false,
            can_manage_voice_chats: false,
            can_pin_messages: false,
          });
        }
      }
    });
  } else {
    console.log("current time is 0");
  }
});
