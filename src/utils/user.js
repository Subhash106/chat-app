const users = [];

function addUser({ id, username, room }) {
  //Sanitise user data
  const usernameTrimed = username.trim().toLowerCase();
  const roomTrimed = room.trim().toLowerCase();

  const user = { id, username: usernameTrimed, room: roomTrimed };

  //check if username and room exits
  if (!username || !room) {
    return {
      error: "username and room are required",
    };
  }

  // check if user already exist
  for (let user of users) {
    if (user.username === usernameTrimed && user.room === roomTrimed) {
      return {
        error: "user exists",
      };
    }
  }

  users.push(user);

  return { user };
}

function removeUser(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    const retunedUserArr = users.splice(index, 1);
    return retunedUserArr[0];
  }
}

function getUser(id) {
  return users.find((user) => user.id === id);
}

function getUsersInRoom(room) {
  return users.filter((user) => user.room === room.toLowerCase());
}

module.exports = { users, getUsersInRoom, addUser, removeUser, getUser };
