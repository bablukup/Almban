# Almban (Āḷmban)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**An AI-powered emotional support friend who truly listens.**

Almban is not just another chatbot; it's a safe and empathetic space designed to make people feel heard, supported, and understood. Our mission is to blend empathy with human-like responses powered by AI.

**(Add a screenshot or GIF of your project here)**
`![Almban Demo](./demo.gif)`

---

## 🌟 Key Features

* **💬 Empathetic AI Chat:** Share your feelings in a safe and non-judgmental environment.
* **📱 Mobile-First Design:** An app-like experience that works beautifully on any device.
* **🛡️ Privacy & Safety:** Your conversations are private and secure. We prioritize user safety above all.
* **🚨 Emergency Support:** Redirects to trusted contacts or professional helplines in moments of severe distress.

---

## 🛠️ Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **AI Integration:** OpenAI API (for MVP), Hugging Face
* **Deployment:** Vercel (Frontend), Render/Railway (Backend)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following software installed on your system:
* [Node.js](https://nodejs.org/) (v16 or newer)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [Git](https://git-scm.com/)
* [MongoDB](https://www.mongodb.com/try/download/community) (for local installation)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/almban.git](https://github.com/your-username/almban.git)
    cd almban
    ```

2.  **Set up the Backend:**
    ```bash
    # Navigate to the backend directory
    cd backend

    # Install dependencies
    npm install

    # Create a .env file from the example
    cp .env.example .env
    ```
    Now, open the `backend/.env` file and add your configuration variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    OPENAI_API_KEY=your_openai_api_key
    PORT=5000
    ```

3.  **Set up the Frontend:**
    ```bash
    # Navigate to the frontend directory from the root
    cd ../frontend

    # Install dependencies
    npm install
    ```

---

## 🏃‍♂️ Running the Application

1.  **Start the Backend Server:**
    ```bash
    # From the /backend directory
    npm run dev
    ```
    The server will start running on `http://localhost:8080`.

2.  **Start the Frontend Application:**
    ```bash
    # From the /frontend directory
    npm start
    ```
    The React app will open on `http://localhost:3000` and will be connected to the backend.

---

## 📅 Roadmap

-   [x] **Phase 1:** Build the MVP (basic emotional support chat).
-   [ ] **Phase 2:** Add personalization + mood detection.
-   [ ] **Phase 3:** Expand into a mobile app + global reach.
-   [ ] **Phase 4:** Train our own custom emotional AI model.

---

## 🤝 How to Contribute

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  **Fork** the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a **Pull Request**.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
