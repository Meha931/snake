# snake
A classic game of snake with customisable maps

## Files
- index.html - page itself, is mostly just an interface
- snake.ts - source code that has to be compiled into snake.js
- maps.js - maps

## Custom maps
You can make custom maps by creating matrices with strings that contain spaces as free cells and `@` as borders.
Each row (except for the last one) requires an immediate line break.
Append an array that contains the map's name and the map string to the `maps` array.

Example:
```js
let maps = [
    // ...some maps here...
    [
        "Classic S",
        
        "@@@@@@@@\n" +
        "@      @\n" +
        "@      @\n" +
        "@      @\n" +
        "@      @\n" +
        "@      @\n" +
        "@      @\n" +
        "@@@@@@@@"
    ],
    // ...some other maps here...
];
```
