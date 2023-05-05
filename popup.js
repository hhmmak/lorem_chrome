
//.. dictionary

const beginner = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit']
const symbol = ['. ', ', ', ' ']
const word = ['dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'ut', 'magna', 'sed', 'pulvinar', 'ultricies', 
  'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat',
  'dolore', 'eu', 'fugiat', 'nulla', 'pariatur', 'in', 'voluptate', 'velit', 'esse', 'nunc', 'eros', 'quis', 'urna',
  'sunt', 'sint', 'duis', 'tempor', 'velaliquam', 'suscipit', 'doming', 'tempuribud', 'harmud', 'dignissim', 'providerent']

//.. DOM elements

// user input
const start = document.getElementById('startWithLorem')
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

//.. copy function
const copyContent = async () => {
  let text = container.innerText
  try {
    await navigator.clipboard.writeText(text);
    console.log('Content copied to clipboard');
    console.log(text)
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
  if (n < 1)  return '';

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
  if (n < 1)  return '';

  let article = new Array(n);
  article[0] = generateParagraph(lipsum);
  for (let i = 1; i < n; i++){
    article[i] = generateParagraph();
  }

  return article.join('\n\n');
}

//.. button event listeners

buttonSentence.addEventListener("click", () => {
  container.innerText = generateSentence(start.checked);
})

buttonTitle.addEventListener("click", () => {
  container.innerText = generateTitle(start.checked);
})

buttonParagraph.addEventListener("click", () => {
  container.innerText = generateParagraph(start.checked, numSentence.valueAsNumber);
})

buttonArticle.addEventListener("click", () => {
  container.innerText = generateArticle(start.checked, numParagraph.valueAsNumber);
})

buttonCopy.addEventListener("click", copyContent)