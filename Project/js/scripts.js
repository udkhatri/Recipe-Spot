import Firebase from "../firebase.js";
console.log("logging ");
const firebase = new Firebase();
const myNavigator = document.getElementById('my-navigator');
var userName = "Guest user"
// Service Worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./service-worker.js')
    .catch(function (error) {
      console.log('Service Worker failed to register:', error);
    });
}
else {
  console.log('Service Worker is not supported by this browser.');
}
setTimeout(() => {
  // Timeout required for onsenUI
  document.getElementById('loginButton').addEventListener('click', onSignInClick);
  document.getElementById('signupButton').addEventListener('click', onSignUpClick);
  document.getElementById('guestButton').addEventListener('click', anonymousLogin);

} , 1000);

document.addEventListener('init', function(event) {
  if (event.target.matches('#signup')) {
    document.getElementById('onSignup').addEventListener('click', signup);
  }
  if (event.target.matches('#login')) {
    document.getElementById('onSignin').addEventListener('click', signin);
  }
  if (event.target.matches('#profile')) {
    document.getElementById('logout').addEventListener('click', logout);
    document.getElementById('switch').addEventListener('click', switchChange);
    document.getElementById('username').innerHTML = userName != null ? userName : "Guest user";
    console.log("user name is: ",userName);
  }
  // don't need this we can use addEventListener to listen when save or view is clicked and then get the id that way for that particular button
  // work in progress
  // if (event.target.matches('#recipes')) {
  //   setTimeout(() => {

  //     let myID = document.getElementById('recipeID').innerText;
  //     console.log("Test " + myID);
  //     getRecipeId(myID);
  //   }, 2000);
  // }
  // has to be a better way
  // ok you can only save the one you actually view as that would then have static info that you can easily send to firestore and target using documentById
  
}, false);
const signin = () => {
  const email = document.getElementById('siemail').value;
  const password = document.getElementById('sipassword').value;
  console.log(email, password);
  firebase
    .signin(email, password)
    .then(user => {
      console.log(user);
      checkUser();
    })
    .catch(error => {
      ons.notification.alert(error.code);
    }
    );
}
const anonymousLogin = () => {
  firebase.anonymousLogin().then(() => {
    checkUser();
  }).catch(error => {
    ons.notification.alert(error);
  }
  );
}
const signup = () =>{
  console.log('signup');
  const email = document.getElementById('suemail').value;
  const password = document.getElementById('supassword').value;
  const name = document.getElementById('suname').value;
  console.log(email, password, name);
  firebase
    .signup(email, password)
    .then(user => {
      console.log(user);
      firebase.storeUserName(name);
      firebase.createUser(user.uid, name, email);
      checkUser();
    })
    .catch(error => {
      ons.notification.alert(error);
    })
}
const checkUser = () =>{
  firebase.onAuthStateChanged(user => {
    if(user){
      console.log(user);
      userName = user.displayName;
      myNavigator.resetToPage('pages/home.html');
    }
    else{
      console.log('not logged in');
      myNavigator.resetToPage('pages/welcome.html');
    }
  }
  );
}
checkUser();

function getRecipeId(valueID){
  
  console.log("This is the ID" + valueID);
}

const login = () => {
    myNavigator.resetToPage('pages/home.html');
}

document.addEventListener('prechange', function(event) {
  document.querySelector('ons-toolbar .center')
    .innerHTML = event.tabItem.getAttribute('label');
});
function onSignInClick(){
  myNavigator.pushPage('pages/login.html');
}

function onSignUpClick(){
  myNavigator.pushPage('pages/signup.html');
}

function onGuestClick(){
  myNavigator.pushPage('pages/home.html')
}



const logout = () => {
  firebase.logout().then(() => {
    checkUser();
  });
  myNavigator.resetToPage('pages/welcome.html');
}
const switchChange = () =>{
  const switchh = document.querySelector('#switch');
  if(switchh.checked){
    document.querySelector('#theme').setAttribute('href', 'css/css/dark-onsen-css-components.css');
    document.querySelector('#themeMeta').setAttribute('content', '#000')
  }
  else{
    document.querySelector('#theme').setAttribute('href', 'css/css/onsen-css-components.css');
    document.querySelector('#themeMeta').setAttribute('content', '#fff')
  }
}