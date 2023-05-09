const socket = io();
const $joining = document.getElementById("joining");
const $chatForm = document.getElementById("chatForm");
const $chatInput = $chatForm.querySelector("#chatInput");
const $sendButton = $chatForm.querySelector("button");
const $messages = document.getElementById("messages");
const $messagesTemplate =
  document.getElementById("messages-template").innerHTML;
const $sendLocationButton = document.getElementById("sendLocation");

socket.on("message", (data) => {
  const html = Mustache.render($messagesTemplate, data);
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("messageLocation", (location) => {
  const link = document.createElement("a");
  link.href = `https://www.google.com/maps/@${location.latitude},${location.longitude},7z`;
  link.innerText = "Location";
  link.target = "_blank";

  $messages.insertAdjacentElement("beforeend", link);
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
