import { createServer } from "http";

const PORT = process.env.PORT || 3000; // Set a default port if not provided

// User data
const users = [
  { id: 1, name: "Zayed" },
  { id: 2, name: "Raihan" },
  { id: 3, name: "Poran" },
  { id: 4, name: "Rimon" },
  { id: 5, name: "Rasel" },
];

// Logger middleware
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

// JSON middleware
const jsonMiddleware = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
};

// Route handler for GET /api/users
const getUserHandler = (req, res) => {
  res.write(JSON.stringify(users));
  res.end();
};

// Get user by ID /api/users/:id
const getUserByIdHandler = (req, res) => {
  const id = req.url.split("/")[3];
  const user = users.find((user) => user.id === parseInt(id));
  if (user) {
    res.write(JSON.stringify(user));
  } else {
    res.statusCode = 404;
    res.write(JSON.stringify({ message: "User not found" }));
  }
  res.end();
};

// Not found handler
const notFoundHandler = (req, res) => {
  res.statusCode = 404;
  res.write(JSON.stringify({ message: "Route not found" }));
  res.end();
};

// route handler to POSR request  /api/users
const createUserHandler = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  console.log(body);
  req.on("end", () => {
    const newUser = JSON.parse(body);
    users.push(newUser);
    res.statusCode = 201;
    res.write(JSON.stringify(newUser));
    res.end();
  });
};

//delete handler
const deleteUserHandler = (req, res) => {
  const id = req.url.split("/")[3];
  const user = users.filter((user) => user.id !== parseInt(id));
  if (user) {
    res.write(JSON.stringify(user));
  } else {
    res.statusCode = 400;
    res.write(
      JSON.stringify({
        message: "User not found",
      })
    );
  }
  res.end();
};

// Create the server
const server = createServer((req, res) => {
  // Use the logger middleware first
  logger(req, res, () => {
    // Then use the JSON middleware
    jsonMiddleware(req, res, () => {
      // Check the routes
      if (req.url === "/api/users" && req.method === "GET") {
        getUserHandler(req, res);
      } else if (
        req.url.match(/\/api\/users\/([0-9]+)/) &&
        req.method === "GET"
      ) {
        getUserByIdHandler(req, res);
      } else if (req.url === "/api/users" && req.method === "POST") {
        createUserHandler(req, res);
      } else if (
        req.url.match(/\/api\/users\/([0-9]+)/) &&
        req.method === "DELETE"
      ) {
        deleteUserHandler(req, res);
      } else {
        notFoundHandler(req, res);
      }
    });
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
