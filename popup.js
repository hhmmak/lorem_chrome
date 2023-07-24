
//.. dictionary

const beginner = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit']
const symbol = ['. ', ', ', ' ']
const word = ['dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'ut', 'magna', 'sed', 'pulvinar', 'ultricies', 
  'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat',
  'dolore', 'eu', 'fugiat', 'nulla', 'pariatur', 'in', 'voluptate', 'velit', 'esse', 'nunc', 'eros', 'quis', 'urna',
  'sunt', 'sint', 'duis', 'tempor', 'velaliquam', 'suscipit', 'doming', 'tempuribud', 'harmud', 'dignissim', 'providerent']

//.. DOM elements

// user input
const checkboxLipsum = document.getElementById('startWithLorem')
const numSentence = document.getElementById('numSentence')
const numParagraph = document.getElementById('numParagraph')

//container
const container = document.getElementById('result')

// button
const buttonWordCount = document.getElementById('buttonWordCount')
const buttonSentence = document.getElementById('buttonSentence')
const buttonTitle = document.getElementById('buttonTitle')
const buttonParagraph = document.getElementById('buttonParagraph')
const buttonArticle = document.getElementById('buttonArticle')
const buttonCopy = document.getElementById('buttonCopy')
const buttonDefault = document.getElementById('buttonDefault')

//.. set defaults functions

chrome.storage.local.get(["lorem-chrome-lipsum"])
  .then((res) => {
    checkboxLipsum.checked = res["lorem-chrome-lipsum"] === "true"
  })
  .catch((err) => console.error(err))

chrome.storage.local.get(["lorem-chrome-para"])
  .then((res) => {
    numSentence.value = parseInt(res["lorem-chrome-para"]);
  })
  .catch((err) => console.error(err))

chrome.storage.local.get(["lorem-chrome-article"])
  .then((res) => {
    numParagraph.value = parseInt(res["lorem-chrome-article"]);
  })
  .catch((err) => console.error(err))

buttonDefault.addEventListener(("click"), () => {
  chrome.storage.local.set({
    "lorem-chrome-lipsum": "false", 
    "lorem-chrome-para": "7", 
    "lorem-chrome-article": "5"
  })
  checkboxLipsum.checked = false
  numSentence.value = "7"
  numParagraph.value = "5"
})


//.. helper functions

const randomIdx = (arrLength) => {
  return Math.floor(Math.random() * arrLength)
}

const randomWord = () => {
  let idx = randomIdx(word.length);
  return word[idx];
}

const capHead = (str) => {
  return str[0].toUpperCase() + str.slice(1)
}

//.. error warning
const warning = (str) => {
  let el = document.createElement('span');
  el.innerText = str;
  el.className = 'warning';
  console.error("Error: " + str);
  container.innerText = '';
  container.appendChild(el);
}

//.. copy function
const copyContent = async () => {
  let text = container.innerText
  try {
    await navigator.clipboard.writeText(text);
    console.log('Content copied to clipboard: ', text);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

//.. generators

const generateSentence = (lipsum=false, n=20) => {
  if (n < 1)  return '';

  let sentence = []
  let maxPhrase = 3;

  while (maxPhrase > 0 && sentence[sentence.length - 1] !== '. '){  
    let count = n;
    sentence.push(' ')
    while (count > 0 && sentence[sentence.length - 1] === ' '){
      let idx = Math.min(2, randomIdx(count));
      sentence.push(symbol[idx]);
      count --;
    }
    maxPhrase --;
  }

  // make sure last symbol is period ('. ')
  if (maxPhrase === 0) {
    sentence[sentence.length - 1] = ' '
    sentence.push('. ')
  }
  
  // concat random word and add Lorem Ipsum start
  sentence = sentence.map(str => randomWord() + str)
  if (lipsum) {
    sentence.unshift(...beginner)
  } else {
    sentence[0] = capHead(sentence[0]);
  }
  return sentence.join('');
}

const generateTitle = (lipsum=false, n=10) => {
  let title = lipsum ? ["Lorem", "Ipsum"] : []

  let count = Math.max(2, randomIdx(n));
  while (title.length <= count) {
    let word = randomWord();
    if (title.length > 1 && word.length < 4 && randomIdx(3)){
      title.push( word );
    } else {
      title.push(capHead(word));
    }
  }

  return title.join(' ');
}

const generateParagraph = (lipsum=false, n=7) => {
  if (n < 1 || n > 20)  return 'Number of sentences per paragraph is limited to 1 to 20.';

  let paragraph = [];
  let maxLength = 1000;
  let maxSentence = n;
  let tempSentence = '';

  while (maxLength > 0 && maxSentence > 0){
    if (maxSentence === n && lipsum) {
      tempSentence = generateSentence(lipsum);
    } else {
      tempSentence = generateSentence();
    }
    paragraph.push(tempSentence);
    maxLength -= tempSentence.length;
    maxSentence --;
  }

  return paragraph.join('');
}

const generateArticle = (lipsum=false, n=5) => {
  if (n < 1 || n > 10)  return 'Number of paragraphs per article is limited to 1 to 10.';

  let article = new Array(n);
  article[0] = generateParagraph(lipsum);
  for (let i = 1; i < n; i++){
    article[i] = generateParagraph();
  }

  return article.join('\n\n');
}

//.. checkbox/input event listeners

checkboxLipsum.addEventListener("click", () => {
  chrome.storage.local.set(
    {"lorem-chrome-lipsum": (checkboxLipsum.checked).toString()},
    () => {
      chrome.storage.local.get(["lorem-chrome-lipsum"])
    }
  );
})



//.. button event listeners

buttonSentence.addEventListener("click", () => {
  container.innerText = generateSentence(checkboxLipsum.checked);
})

buttonTitle.addEventListener("click", () => {
  container.innerText = generateTitle(checkboxLipsum.checked);
})

buttonParagraph.addEventListener("click", () => {
  if (numSentence.valueAsNumber < 1 || numSentence.valueAsNumber > 20) { 
    warning('Number of sentences per paragraph is limited to 1 to 20.');
  } else {
    chrome.storage.local.set({"lorem-chrome-para": numSentence.value})
    container.innerText = generateParagraph(checkboxLipsum.checked, numSentence.valueAsNumber);
  }
})

buttonArticle.addEventListener("click", () => {
  if (numParagraph.valueAsNumber < 1 || numParagraph.valueAsNumber > 10) {  
    warning('Number of paragraphs per article is limited to 1 to 10.');
  } else {
    chrome.storage.local.set({"lorem-chrome-article": numParagraph.value})
    container.innerText = generateArticle(checkboxLipsum.checked, numParagraph.valueAsNumber);
  }
})

buttonCopy.addEventListener("click", copyContent)
