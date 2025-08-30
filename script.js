const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//default cheeze jo pehle se h
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleslider(); //calling function by hoisting
//strength colour grey (yeh krna h default)


//set password length

function handleslider(){   // handle slider ka kaam bss itna h ki passwordwali length ko ui pe interface krana
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

//set indicator colour

function setindicator(color){   //indicator ke samne jo strength ka colour set krna hai wo function
    indicator.style.backgroundColor = color;
}


function getRandInt(min, max){
    // min inclusive, max exclusive
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandNum(){
    return getRandInt(0, 9);
}

function getlowercase(){
    return String.fromCharCode(getRandInt(97, 123));  //a ascii value = 97,  z = 123         String.fromCharCode = use to convert ascii value to char
}

function getuppercase(){
    return String.fromCharCode(getRandInt(65, 91));  //A ascii value = 65, Z = 91   
}

function genrateSymbol(){
    const randNum = getRandInt(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasupper = false;
    let haslower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked){
        hasupper = true;
    }
    if(lowercaseCheck.checked){
        haslower = true;
    }
    if(numbersCheck.checked){
        hasNum = true;
    }
    if(symbolCheck.checked){
        hasSym = true;
    }

    if(hasupper && haslower && hasNum && hasSym && passwordLength >= 8){
        setindicator("#0f0");
        alert("strong");
    }
    else if((haslower || hasupper) && (hasNum || hasupper)&& (hasNum || hasSym) && passwordLength >= 6)
    {
        setindicator("#ff0");
        alert("medium");
    }
    else{
        setindicator("#f00");
        alert("weak");
    }
}


async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);  // this "navigator.clipboard.writeText" = write the text and return promise (promise = return two things = excute aur failed)
        alert("copied"); 
          
    } catch (error) {
        copyMsg.innerText = "failed";
       
    }

    // to make span visible
    copyMsg.classList.add("active");

    // to make span invisible after 2sec
    setTimeout( ()=> {
        copyMsg.classList.remove("active");
    }, 2000);

}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// handling checkbox and counting the number of checkbox because taking the information of that we are generating correct password or not 

function handleCheckBoxChanges(){
    checkCount = 0;
    allCheckBox.forEach(checkbox => {
       if(checkbox.checked)
        checkCount++;
    });

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleslider();
    }
}

//EVENT LISTENERS

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChanges);

}
)


// concatinating slider with passwordlength text

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;   //jaise hi hm slider ko aage piche krenge toh uss time pe jo value hogi slider ki  wo passwordlength ke eqaul ho jayegi

    handleslider();
})


copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})


// generating password

generateBtn.addEventListener('click', () => {


    //none of the checkbox are selected
    if(checkCount == 0)
        alert("Please select atleast one checkbox"); // means it will not generate any password

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleslider();
    }

    console.log("Starting");
    //remove old password
    password = "";


    /*
    //let's put the stuff mentioned by checkboxes

    if(uppercaseCheck.checked){
        password += getuppercase();
    }

    if(lowercaseCheck.checked){
        password += getlowercase();
    }

    if(numbersCheck.checked){
        password += getRandNum();
    }

    if(symbolCheck.checked){
        password += genrateSymbol();  
    }
*/


// we do not need all that bulky code insted of doing this we simply do = we make an array and put all the the checked item in that array using for loop and then reaming length( we put random things using for loop)

let funcArr = [];

if(uppercaseCheck.checked){
    funcArr.push(getuppercase);
}

if(lowercaseCheck.checked){
    funcArr.push(getlowercase);
}

if(numbersCheck.checked){
    funcArr.push(getRandNum);
}

if(symbolCheck.checked){
    funcArr.push(genrateSymbol);
}

 for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRandInt(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");

// shuffle the password so that we do not get the password in the order we have checked the boxes
password = shufflePassword(Array.from(password));

//show in UI
passwordDisplay.value = password;

//calculate strength
calcStrength();


})
