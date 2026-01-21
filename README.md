# Zetamac Arithmetic Game - ouzo edition

This is a web-based arithmetic game inspired by the [original Zetamac Arithmetic Game](https://arithmetic.zetamac.com/). It's designed to help users practice their mental math skills with a variety of options and specific techniques. True to the original, I've kept this simple, clean and fast with a few extra bells and whistles.

## Features

- **Customisation Options**
    - Addition, subtraction, multiplication, and division.
    - Customizable number ranges for Addition and Multiplication.
    - Subtraction is presented as addition problems in reverse.
    - Division is presented as multiplication problems in reverse.
    - Choose from 30, 60, 120, 300, 600 seconds, or untimed.
- **Specific Techniques Practice:**
    - **The 11 Trick:** Practice multiplying or dividing by 11.
    - **Middle Number Trick:** Practice squaring the middle number and subtracting the square of the distance for two close even or odd numbers.
    - **Squares (up to 30):** Practice squaring numbers up to 30.
    - **Square roots (up to 30):** Practice the inverse of squares.
    - **Powers of 2:** Practice calculating powers of 2 up to 2^30.
    - **Primes Times:** Practice multiplication tables of only prime numbers.
    - **The "Ending in 5" Square:** Practice squaring numbers ending in 5.
    - **The "Ghost 100" (Base 100):** Practice multiplying two numbers close to 100.
    - **The "Double and Halve":** Practice multiplying an even number by a number ending in 5.
    - **The "Quarters" Strategy:** Practice multiplying by 25, 50, 75, or 125.
    - **Multiplying by 12 (Distribution):** Practice multiplying any number by 12.
- **Streamlined Gameplay:**
    - No need to press Enter; answers are submitted as you type.
    - Clean, minimalist, monospace interface
- **Mobile Mode:**
    - When playing on mobile instead of having to input numbers you can select out of four options.
    - Points will be +1 for correct answers and -1 for incorrect.
- **Weakness Mode:**
    - App now tracks which pairs of numbers user finds difficulty with (set to be defined as taking >1.5 seconds to answer correctly).
    - Weakness mode selected from the dropdown will result in the user playing a game with _only_ the questions they have found hard in the past.
    - Results can be exported and imported if moving between browsers or computers.

## Running Locally

This project consists of a single HTML file with accompanying CSS and JavaScript. No special setup is required.

1.  Clone this repository or download the files with the following snippet.

```bash
git clone https://github.com/ouzo-zip/zetamac-ouzo-edition.git
```

2.  Open `index.html` in your web browser.

## How to Play
1.  [Go here](https://ouzo-zip.github.io/zetamac-ouzo-edition/).
2.  Select your desired game options (operations, ranges, time limit).
3.  Optionally, select a specific technique to practice from the dropdown menu.
4.  Click the "Start Game" button.
5.  The game will start, and you can type in your answers. The game will automatically proceed to the next question when you enter the correct answer.
6.  When the time is up, your score will be displayed.

This project is built with plain HTML, CSS, and JavaScript, keeping it simple and lightweight.

## Credits & License

- **Credits:** To the original [Zetamac Arithmetic Game creator, Sophie](https://arithmetic.zetamac.com).
- **License:** AGPL3
