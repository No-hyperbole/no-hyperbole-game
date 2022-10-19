// game constants
let elapsedTime = 0;
let howManySecoundsToAddFlowers = 3;
let howManyMetersToAddFlowers = 15;
let calledTimeTemp = false; // this variable allows me to get into the "elapsedtime if" in the animate function (gameloop) only once, not on every screen refresh that matches the modulo operand
let calledDistanceTemp = false; // same as above, only we consider the traveled distance, not the elapsed time
let elapsedTimeDelta = 0;
let howManyPlanesExistOnStart = 20;
let maxPlanesAmount = 100;
let planeArray = []; // here we will store all the planes with floral textures on them
let planeShadowArray = [];
let islandArray = [];
let howManyPlanesAreAddedAndRemoved = 4;
