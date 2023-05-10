const socket = io();
const $joining = document.getElementById("joining");
const $chatForm = document.getElementById("chatForm");
const $chatInput = $chatForm.querySelector("#chatInput");
const $sendButton = $chatForm.querySelector("button");
const $messages = document.getElementById("messages");
const $messagesTemplate =
  document.getElementById("messages-template").innerHTML;
const $messagesLocationTemplate = document.getElementById(
  "messages-location-template"
).innerHTML;
const $sendLocationButton = document.getElementById("sendLocation");
const params = new URLSearchParams(location.search);
const username = params.get("username");
const room = params.get("room");

console.log("room", room, username);

socket.on("message", (data) => {
  const { createdAt } = data;
  const updatedCreatedAt = moment(createdAt).format("h:mm a");
  const html = Mustache.render($messagesTemplate, {
    ...data,
    createdAt: updatedCreatedAt,
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("messageLocation", (data) => {
  const {
    createdAt,
    text: { latitude, longitude },
  } = data;

  const updatedCreatedAt = moment(createdAt).format("h:mm a");

  const html = Mustache.render($messagesLocationTemplate, {
    url: `https://www.google.com/maps/@${latitude},${longitude},7z`,
    createdAt: updatedCreatedAt,
  });

  $messages.insertAdjacentHTML("beforeend", html);
});

$chatForm.addEventListener("submit", function (e) {
  e.preventDefault();
  $sendButton.setAttribute("disabled", "disabled");
  const message = $chatInput.value;

  socket.emit("sendMessage", message, (error) => {
    $sendButton.removeAttribute("disabled");
    $chatInput.value = "";
    $chatInput.focus();

    if (error) {
      return console.log(error);
    }
  });
});

$sendLocationButton.addEventListener("click", function () {
  if (!navigator.geolocation) {
    return alert("Your browser does not support geolocation!");
  }

  $sendLocationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      socket.emit("sendLocation", { latitude, longitude }, () => {
        $sendLocationButton.removeAttribute("disabled");

        console.log("location shared successfully");
      });
    },
    (error) => {
      $sendLocationButton.removeAttribute("disabled");

      console.log(error);
    }
  );
});
