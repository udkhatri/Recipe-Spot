import Firebase from "../firebase.js";
console.log("logging ");
const firebase = new Firebase();
const myNavigator = document.getElementById('my-navigator');
var userName = "Guest user"
var userEmail = "";
var userData = {};
var userID;
const baseURL =
"https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?query=";
const endURL =
"&instructionsRequired=true&fillIngredients=false&addRecipeInformation=true&ignorePantry=true&number=10&limitLicense=false";

const baseID_URL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/";
const endID_URL = "/information?includeNutrition=true"
var user;
function viewRecipe(recipeID) {
  let number = 22;
  const myNavigator = document.getElementById('my-navigator');
      //id = parseInt(recipeID);
      console.log("This is from recipes page what I have for iD "+ recipeID);
     // document.querySelector('#my-navigator').bringPageTop('pages/view-recipe.html', { data: id });
      myNavigator.pushPage("pages/view-recipe.html",{ data: {recipeID}});
    }
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
 

} , 1000);
document.addEventListener('show', ({ target }) => {
  if (target.matches('#view-recipe')) {
    //has to be curly brackets 
    let {recipeID} = document.querySelector('#my-navigator').topPage.data;
    var id = recipeID;
    console.log("This is the id from other page " + id); // Get id from the other page"   
    document.getElementById('saveRecipeButton').addEventListener('click', () =>saveRecipe(id));
    if(userData.favorites.includes(id)){
      document.getElementById("saveRecipeButton").style.backgroundColor = "#f84141";
    }else{
      document.getElementById("saveRecipeButton").style.backgroundColor = "white";
    }
    
    const get = async () => {
      // do the API call and get JSON response
     
      let recipeURL = baseID_URL + id + endID_URL;
      const response = await fetch(recipeURL, options);
      const json = await response.json();

      const nutrientsMap = json.nutrition.nutrients.map(({amount})=> amount);
      const {summary, title, image, instructions} = json;

      // This variables can be used as well, might be easier to read but left to show that both are good the ones in element id and these
      const recipeSummary = summary;
      const recipeTitle = title;
      const recipeImage = image;
      const recipeInstructions = instructions;
      const caloriesValue = nutrientsMap[0];
      const fatValue = nutrientsMap[1];
      const carbsValue = nutrientsMap[3];
      const proteinValue = nutrientsMap[9];


      document.getElementById('recipeTitle').innerHTML = title;
      document.getElementById("recipeImage").src = image;
      document.getElementById('recipeSummary').innerHTML = summary;
      document.getElementById('recipeInstructions').innerHTML = instructions;
      document.getElementById('caloriesValue').innerHTML = nutrientsMap[0];
      document.getElementById('fatValue').innerHTML = nutrientsMap[1];
      document.getElementById('carbsValue').innerHTML =  nutrientsMap[3];
      document.getElementById('proteinValue').innerHTML = nutrientsMap[9];

    };
    // get the first set of results as soon as the page is initialised
     get();
  }
  if (target.matches('#favorite')) {
    let spinner = document.getElementById('#favorite-spinner');
    function viewRecipe(recipeID) {
      //you can also send it this other way, just for ref
     // document.querySelector('#my-navigator').bringPageTop('pages/view-recipe.html', { data: id });
      myNavigator.pushPage("pages/view-recipe.html",{ data: {recipeID}});
    }
    console.log("This is the favorites page");
        let recipeID = userData.favorites[0];
        var id = recipeID;
        console.log("This is the id from other page " + id); // Get id from the other page"   
        
        if(userData.favorites.length > 0){
          const list = document.querySelector("#fav-result-list");
          document.querySelector("#favorite-spinner").style.display = "none";
          list.innerHTML = "";
          userData.favorites.forEach(favorite => {
            getSingleFavorite(favorite);
          }
          )
        }else{
          document.querySelector("#favorite-spinner").style.display = "none";
          document.getElementById("fav-result-list").innerHTML = "You haven't saved any recipes yet";
        }
        // get the first set of results as soon as the page is initialised
        
  }
  if (target.matches('#profile')) {
    document.getElementById('logout').addEventListener('click', logout);
    document.getElementById('switch').addEventListener('click', switchChange);
    document.getElementById('username').innerHTML = userName != null ? userName : "Guest user";

    console.log("This is the user name::: " + userData.name);
    if(userData.isGuest){
      document.getElementById('useremail').innerHTML = "You are using the app as a Guest. You can not save favorite recipes without signing in. Please logout from the guest account and sign in to save your favorite recipes.";
    }else{
      document.getElementById('useremail').innerHTML = userData.email; 
    }
  }
});
const getSingleFavorite = async (id) =>{
    // do the API call and get JSON response
    let recipeURL = baseID_URL + id + endID_URL;
    const response = await fetch(recipeURL, options);
    const json = await response.json();
  
    const {summary, title, image, instructions} = json;
    console.log("This is the json from favorites page " + title,image);
    const list = document.querySelector("#fav-result-list");
      //avoids getting reesults without images
      if (typeof image === "string") {
        console.log("This is the list HTML  " + list.innerHTML);
        list.appendChild(
          ons.createElement(`
          <ons-list-item tappable onclick="viewRecipe(${id})">
            <div class="left">
              <img class="list-item__thumbnail" src=${image}>
            </div>
            <div class="center">
              <span class="list-item__title">${title}dsds</span><span class="list-item__subtitle"></span>
            </div>
          </ons-list-item>
          `)
        );
      } else {
        console.log("No image found");
      }
   
}
document.addEventListener('init', function(event) {
  if (event.target.matches('#welcome')) {
    document.getElementById('loginButton').addEventListener('click', onSignInClick);
    document.getElementById('signupButton').addEventListener('click', onSignUpClick);
    document.getElementById('guestButton').addEventListener('click', anonymousLogin);
  }
  if (event.target.matches('#signup')) {
    document.getElementById('onSignup').addEventListener('click', signup);
  }
  if (event.target.matches('#login')) {
    document.getElementById('onSignin').addEventListener('click', signin);
  }
  

  if (event.target.matches("#search-page")) {
    const myNavigator = document.getElementById('my-navigator');
    let searchResult = document.getElementById("search");
    searchResult.addEventListener('change',()=>{
      console.log("chnage",searchResult.value);
      get(searchResult.value);
    })
    document.getElementById('searchButton').addEventListener('click', ()=>{
      // use to keep track of the recipe numbers
      let recipeImage;
      console.log("You are searching for this " + searchResult.value);
    get(searchResult.value);
    });
  }

  
}, false);
let nextrecipeNumber = 1;
const get = async (searchResult) => {
  // do the API call and get JSON response

  let searchURL = baseURL + searchResult + endURL;
  const response = await fetch(searchURL, options);
  const json = await response.json();

  const newRecipeTitle = json.results.map((e) => e.title);
  const recipeImage = json.results.map((e) => e.image);
  const recipeId = json.results.map((e)=>e.id);
  
  const list = document.querySelector("#result-list");
  list.innerHTML = "";
  newRecipeTitle.forEach((title, i) => {
    image = recipeImage[i];
    id = recipeId[i];
    //avoids getting reesults without images
    if (typeof image === "string") {
      list.appendChild(
        ons.createElement(`
        <ons-list-item tappable onclick="viewRecipe(${id})">
          <div class="left">
            <img class="list-item__thumbnail" src=${image}>
          </div>
          <div class="center">
            <span class="list-item__title">${title}</span><span class="list-item__subtitle"></span>
          </div>
        </ons-list-item>
        `)
      );
      nextrecipeNumber++;
    } else {
      console.log("No image found");
    }
  });

  // hide the spinner for now
};
const signin = () => {
  const email = document.getElementById('siemail').value;
  const password = document.getElementById('sipassword').value;
  console.log(email, password);
  firebase
    .signin(email, password)
    .then(user => {
      console.log(user);
      checkUser();
      setUserData(user.id)
    })
    .catch(error => {
      ons.notification.alert(error.code);
    }
    );
}
const displayFavorites = () => {
  if(userData.favorites.length > 0){
    userData.favorites.forEach(favorite => {

    })
  }
}
const anonymousLogin = () => {
  firebase.anonymousLogin().then((user) => {
    checkUser();
    setUserData(user.id)
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
      firebase.createUser(user.uid, name, email,user.isAnonymous);
      checkUser();
      setUserData(user.id)
    })
    .catch(error => {
      ons.notification.alert(error);
    })
}
const setUserData = (id) => {
  firebase.getUserData(id).then((user) => {
    userName = user.name;
    userEmail = user.email;
    userData = user
    console.log("user is: ",userData.favorites);
  })
}
const checkUser = () =>{
  firebase.onAuthStateChanged(user => {
    if(user){
      console.log(user);
      userName = user.displayName;
      userEmail = user.email;
      userID = user.uid;
      setUserData(user.uid)
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

const saveRecipe = (id) =>{
  console.log("save recipe",id);
  if(userData.isGuest){
    ons.notification.alert("You must be logged in to save recipes. Please sign in or sign up.");
  }else{
    firebase.addToFavorite(userID,id,userData.favorites).then((data)=>{
      userData.favorites = data.newArray
      console.log("data",data.newArray);
      if(data.added){
        ons.notification.toast("Recipe added to favorites",{timeout: 2000});
        document.getElementById("saveRecipeButton").style.backgroundColor = "#f84141";
      }
      else{
        ons.notification.toast("Recipe removed from favorites",{timeout: 2000});
        document.getElementById("saveRecipeButton").style.backgroundColor = "white";
      }
    });
  }
  
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