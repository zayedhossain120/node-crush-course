import { createServer } from "http";

const PORT = process.env.PORT;
// user data
const users = [
  { id: 1, name: "Zayed " },
  { id: 2, name: "Raihan" },
  { id: 3, name: "Poran" },
  { id: 4, name: "Rimon" },
  { id: 5, name: "Rasel" },
];

const server = createServer((req, res) => {
  if (req.url === "/api/users" && req.method === "GET") {
    // get all user
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(users));
    res.end();
  } else if (req.url.match(/\/api\/users\/([0-9]+)/) && req.method === "GET") {
    // get user by id
    const id = req.url.split("/")[3];
    const user = users.find((user) => user.id === parseInt(id));
    if (user) {
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify(user));
      res.end();
    } else {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 404;
      res.write(JSON.stringify({ message: "User not found!" }));
      res.end();
    }
    // get user by id finish
  } else {
    // user not found
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 404;
    res.write(JSON.stringify({ messase: "Route not found " }));
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
