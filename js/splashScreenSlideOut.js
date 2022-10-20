function splashScreenSlideOut() {
  let splash = document.getElementsByClassName("splashScreen")[0];
  splash.classList.toggle("splashScreen__slideOut");
}

// if the splash screen isn't clicked/tapped, it moves out of the way after 5 seounds
const splashScreenTimedSlideOut = setTimeout(splashScreenSlideOut, 5000);
