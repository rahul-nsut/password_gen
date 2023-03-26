const inputslider=document.querySelector('[data-slider]');

const lengthDisplay=document.querySelector('[data-length]');
const passwordDisplay=document.querySelector('[data-passwordDisplay]');
const copyBtn =document.querySelector('[data-copybtn]');
const copyMsg=document.querySelector('[data-CopyMsg]');
const UppercaseCheck=document.querySelector('#uppercase');
const LowerCaseCheck=document.querySelector('#lowercase');
const NumberCheck=document.querySelector('#number');
const SymbolCheck=document.querySelector('#symbol');
const indicator=document.querySelector('[data-indicator]');
const generateBtn=document.querySelector('.generate');
const CheckBoxes=document.querySelectorAll('input[type=checkbox]');
const symbols='!@#$%^&*(_)+=/?<>.|~`<>,;:""';


let password="";
let passwordLength=10;
let checkCount=0;
//set circle color grey initial

setIndicator("#ccc")

handleSlider();
//set password lenght- acc to slider position
function handleSlider (){
    inputslider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    let mini=inputslider.min;
    let maxi=inputslider.max;
    inputslider.style.backgroundSize=((passwordLength-mini)*100/(maxi-mini))+"% 100%";
}


function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow
}

function getRandomInt(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNo(){
    return getRandomInt(0,9);
}
function generateLowerCase(){
    return  String.fromCharCode(getRandomInt(97,123)) ;   //used ASCII Value
}

function generateUpperCase(){
    return  String.fromCharCode(getRandomInt(65,91)) ;
}

function generateSymbol(){
    let randomno=getRandomInt(0,symbols.length);
    return symbols.charAt(randomno);
}


function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(UppercaseCheck.checked){
        hasUpper=true;
    }
    if(LowerCaseCheck.checked){
        hasLower=true;
    }
    if(NumberCheck.checked){
        hasNum=true;
    }
    if(SymbolCheck.checked){
        hasSym=true;
    }

    if(hasLower&&hasUpper&&hasSym && passwordLength>=10){
        setIndicator("#0f0");
    }
    else if((hasLower||hasUpper) && hasNum||hasSym &&passwordLength>=7){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerText="Fail";
    }
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active")
    },2000);
}


function shufflepass(array){
    //use fisher yades
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random() *(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=> (str+=el));
    return str;

}


function handlecheckbox(){
    checkCount=0;
    CheckBoxes.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    //special condn
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}


CheckBoxes.forEach( (checkbox)=>{
    checkbox.addEventListener('change',handlecheckbox);
});

inputslider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click',()=>{
    if(checkCount<=0){
        return ;
    }
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    console.log("Creating started")
    //finding new password

    //remove old password
    password="";

    // now handling the checkbox
    // if(UppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }

    // if(LowerCaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(NumberCheck.checked){
    //     password+=generateRandomNo();
    // }
    // if(SymbolCheck.checked){
    //     password+=generateSymbol();
    // }


    let funcarr=[];
    if(UppercaseCheck.checked){
        funcarr.push(generateUpperCase);
    }

    if(LowerCaseCheck.checked){
        funcarr.push(generateLowerCase);
    }
    if(NumberCheck.checked){
        funcarr.push(generateRandomNo);
    }
    if(SymbolCheck.checked){
        funcarr.push(generateSymbol);
    }
    console.log("pushing in arr");


    //compulsory addition
    for(let i=0;i<funcarr.length;i++){
        password+=funcarr[i]();
    }
    console.log("Comp addn");

    //rest part
    for(let i=0;i<passwordLength-funcarr.length;i++){
        let randIndex=getRandomInt(0,funcarr.length);
        console.log(randIndex);
        password+= funcarr[randIndex]();
    }
    console.log("rest addn")
    // shuffling password
    password=shufflepass(Array.from(password));

    passwordDisplay.value=password;

    //calculating strength
    calcStrength();
})


