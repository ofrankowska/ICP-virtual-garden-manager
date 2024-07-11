# Internet Computer garden manager application 🌺🪻🌼🌷

[TypeScript Smart Contract 101 Challenge](https://dacade.org/communities/icp/challenges/256f0a1c-5f4f-495f-a1b3-90559ab3c51f)

Do you often find yourself asking, “Why did my once-thriving plant suddenly turn into a sad pile of leaves?” If so, you’re not alone! Many of us have been there — overwatering, underwatering, or simply forgetting to check on our leafy companions. But don’t worry, Plant Manager is here to save the day (and your plants)! 🌱🌷 It's your personal plant assistant, designed to help you keep your plants healthy and happy.

## Features
- **Add a New Plant** 🌻: Got a new plant? Add it to your garden and keep track of its needs.
- **Retrieve Plants** 🌱: See all your green friends in one place.
- **Update Plant Details** ✨: Changed the plant’s name or want to add extra notes? No problem.
- **Delete a Plant** 🪴: Time to say goodbye? Remove plants from your collection when needed.
- **Check Plants Needing Watering** 🌧️: Find out which plants are giving you the sad eye and need a drink.
- **Water a Specific Plant** 💦: Update the watering status for your plants and keep them hydrated!

## Installation

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Run the project using `dfx start --host 127.0.0.1:8000 --clean --background` then `dfx deploy`.

## Usage

Once the project is running, you can make HTTP requests to the exposed endpoints to interact with your garden.

- **`POST /plants`**: Add a new plant to your garden.
    - **Request Body:**
      ```json
      {
        "name": "Rose",
        "species": "Rosa",
        "waterFrequencyDays": 7,
        "notes": "Needs a lot of sunlight."
      }
      ```
    - **Example Request:**
      ```bash
      curl -X POST http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:8000/plants -H "Content-Type: application/json" -d '{"name": "Rose", "species": "Rosa","waterFrequencyDays": 7, "notes": "Needs a lot of sunlight."}'
      ```

- **`GET /plants`**: Retrieve a list of all plants in your garden.
    - **Example Request:**
      ```bash
      curl -X GET http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:8000/plants
      ```

- **`GET /plants/:id`**: Retrieve details of a specific plant by ID.
    - **Example Request:**
      ```bash
      curl -X GET http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:8000/plants/{plantId}
      ```

- **`PUT /plants/:id`**: Update details of a specific plant by ID.
    - **Request Body:**
      ```json
      {
        "name": "Rose 🥀"
      }
      ```
    - **Example Request:**
      ```bash
      curl -X PUT http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:8000/plants/{plantId} -H "Content-Type: application/json" -d '{"name": "Rose 🥀"}'
      ```

- **`DELETE /plants/:id`**: Delete a specific plant from your garden by ID.
    - **Example Request:**
      ```bash
      curl -X DELETE http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:8000/plants/{plantId}
      ```

- **`GET /plants/need-watering`**: Check which plants need watering.
    - **Example Request:**
      ```bash
      curl -X GET http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:8000/plants/need-watering
      ```

- **`PUT /plants/:id/water`**: Update the last watered date for a specific plant by ID.
    - **Example Request:**
      ```bash
      curl -X PUT http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:8000/plants/{plantId}/water
      ```
