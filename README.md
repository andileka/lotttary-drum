
# Lottery Drum App

## Description
Lottery Drum is an interactive application designed to simulate a lottery drawing experience. Users can engage with a virtual lottery drum, view animated drawings of lottery numbers, and enjoy a visually appealing and responsive design.

## How It Works
- **Start the Application**: Once the app is running, users are greeted with the main interface featuring the lottery drum and buttons to initiate the draw.
- **Drawing Numbers**: Users can click on the "Draw" button to start the lottery drum animation. The drum will spin and randomly select a number, displayed as a billiard ball.
- **User Feedback**: If the user has insufficient balance, a message in red will appear above the buttons indicating "insufficient balance."
- **Responsive Design**: The app is fully responsive, ensuring a seamless experience on various devices and screen sizes.

## Features
- **Interactive Lottery Drum**: Users can interact with a virtual lottery drum that animates the drawing of lottery numbers.
- **Responsive Design**: The app is designed to be fully responsive and work seamlessly on different screen sizes.
- **Billiard Balls Animation**: Animated billiard balls numbered 1 to 10, each with unique colors.
- **User Feedback**: Displays messages such as "insufficient balance" above the buttons in red when applicable.

## Installation
Clone the repository:
```sh
git clone https://github.com/yourusername/lottery-drum.git
cd lottery-drum
```

Install dependencies using npm:
```sh
npm install
```

Or, if you prefer using Yarn:
```sh
yarn install
```

Start the development server:
```sh
npm run dev
```

Or with Yarn:
```sh
yarn dev
```

## Usage
- Open the application in your web browser by navigating to http://localhost:3000 (or the port specified in your development server).
- Interact with the lottery drum and enjoy the animated drawings.
- The app will display an "insufficient balance" message in red above the buttons if the balance is insufficient.

## Testing
To run tests, use the following command:

With npm:
```sh
npm test
```

Or with Yarn:
```sh
yarn test
```

## Project Structure
- **App.vue**: The main entry point for the application.
- **PixiAnimation.vue**: Handles the PixiJS animations for the lottery drum and billiard balls.
- **LotteryGame.vue**: Contains the logic and UI for the lottery game experience.

## Simulating a Win
To simulate a win by selecting a specific number, change the random function in your code from:
```javascript
drawnNumber.value = Math.floor(Math.random() * 10) + 1;
```
to:
```javascript
drawnNumber.value = "number that you want to win";
```
Replace "number that you want to win" with the desired winning number.

## Vue 3 + TypeScript + Vite
This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 <script setup> SFCs. Check out the script setup docs to learn more.

## Recommended Setup
- **VS Code**: It is recommended to use VS Code with the Vue - Official extension (previously Volar) and disable Vetur.
- **Type Checking**: Use vue-tsc for performing type checking from the command line or for generating .d.ts files for SFCs.

## Requirements
- Node.js (version 14.x, 16.x, or 18.x)
- npm or Yarn

## Development
To contribute to the development of the Lottery Drum app, follow these steps:

1. Fork the repository.
2. Create a new branch:
```sh
git checkout -b feature/your-feature-name
```
3. Make your changes and commit them:
```sh
git commit -m 'Add some feature'
```
4. Push to the branch:
```sh
git push origin feature/your-feature-name
```
5. Open a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
For any inquiries or feedback, please contact [your email].
