# Vanilla Node.js REST API

A zero-dependency REST API for managing products, built with pure Node.js and the built-in `http` module (no Express or external frameworks).

## Features

* **CRUD operations** on products (`GET`, `POST`, `PUT`, `DELETE`)
* **10-character alphanumeric ID** generator
* **Defaults** for new products (fills in name, description, price if no body provided)
* **Palindrome checker** endpoint
* **Random product name** generator endpoint
* **In-memory storage** (data resets on restart)

## Prerequisites

* [Node.js](https://nodejs.org/) (v14+)
* npm (comes with Node.js)

## Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/beejz/vanilla_node_api.git
   cd vanilla_node_api
   ```

2. **Install dev dependencies** (only depends on `nodemon` for development)

   ```bash
   npm install
   ```

3. **Start the server**

   ```bash
   npm run dev        # uses nodemon to watch for changes
   # or
   npm run watch      # uses `node --watch` built-in watcher
   ```

The server will listen on **[http://localhost:5001](http://localhost:5001)**.

## API Endpoints

### Products

| Method | Path            | Description                      |
| ------ | --------------- | -------------------------------- |
| GET    | `/products`     | List all products                |
| GET    | `/products/:id` | Get a single product by its ID   |
| POST   | `/products`     | Create a new product             |
| PUT    | `/products/:id` | Update an existing product by ID |
| DELETE | `/products/:id` | Delete a product by ID           |

#### Create a Product

* **URL:** `POST http://localhost:5001/products`
* **Body (optional):**

  ```json
  {
    "name": "Your Name",
    "description": "Your description",
    "price": 1234
  }
  ```
* **Defaults:** If you send an empty `{}`, the server will use:

  * `name`: "Bee Jay "
  * `description`: "2025 BSCS Second Year Inspired"
  * `price`: current time in `HHMM` format
* **Response (201 Created):**

  ```json
  {
    "id": "Ab3XyZ9QrT",
    "name": "Bee Jay ",
    "description": "2025 BSCS Second Year Inspired",
    "price": 1423
  }
  ```

### Extras

| Method | Path                | Description                     |
| ------ | ------------------- | ------------------------------- |
| GET    | `/palindrome/:word` | Check if a word is a palindrome |
| GET    | `/random-name`      | Generate a random product name  |

#### Palindrome Checker

* **URL:** `GET http://localhost:5001/palindrome/radar`
* **Response:**

  ```json
  { "word": "radar", "palindrome": true }
  ```

#### Random Name Generator

* **URL:** `GET http://localhost:5001/random-name`
* **Response:**

  ```json
  { "name": "Mega Gadget" }
  ```

## Usage Examples (cURL)

```bash
# List products
gor curl http://localhost:5001/products

# Create product
 curl -X POST http://localhost:5001/products \
      -H "Content-Type: application/json" \
      -d '{}'

# Get by ID
 curl http://localhost:5001/products/<YOUR_ID>

# Update product
 curl -X PUT http://localhost:5001/products/<YOUR_ID> \
      -H "Content-Type: application/json" \
      -d '{"name":"Shrek 3","description":"I like it because…","price":93}'

# Delete product
 curl -X DELETE http://localhost:5001/products/<YOUR_ID>

# Palindrome check
 curl http://localhost:5001/palindrome/level

# Random product name
 curl http://localhost:5001/random-name
```

## License

This project is licensed under the [MIT License](LICENSE).
