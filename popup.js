
//.. dictionary
const beginner = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit']
const symbol = ['. ', ', ', ' ']
const word = ['dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'ut', 'magna', 'sed', 'pulvinar', 'ultricies', 
  'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat',
  'dolore', 'eu', 'fugiat', 'nulla', 'pariatur', 'in', 'voluptate', 'velit', 'esse', 'nunc', 'eros', 'quis', 'urna']

//.. DOM elements
const start = document.getElementById('startWithLorem')
const containerWordCount = document.getElementById('resultWordCount')
const containerSentence = document.getElementById('resultSentence')
const containerParagraph = document.getElementById('resultParagraph')
const containerArticle = document.getElementById('resultArticle')
const buttonWordCount = document.getElementById('buttonWordCount')
const buttonSentence = document.getElementById('buttonSentence')
const buttonParagraph = document.getElementById('buttonParagraph')
const buttonArticle = document.getElementById('buttonArticle')


//.. helper functions

const randomIdx = (arrLength) => {
  return Math.floor(Math.random() * arrLength)
}

const randomWord = (upper=false) => {
  let idx = randomIdx(word.length);
  return word[idx];
}

//.. generators

const generateText = (n=100) => {

  let result = start.checked ? [... beginner, symbol[Math.round(Math.random())] ] : [randomWord(true)];
  let count = start.checked? n - 8 : n - 1;

  for (let i = 0; i < count; i ++){
    result.push( randomWord() );
  }

  return result.join(' ');
}

const generateSentence = (n=20) => {
  let sentence = []
  let maxPhrase = 3;

  while (maxPhrase > 0 && sentence[sentence.length - 1] !== '. '){  
    let count = 20;
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
  
  // concat random word
  sentence = sentence.map(str => randomWord() + str)
  sentence[0] = sentence[0][0].toUpperCase() + sentence[0].slice(1)
  return sentence.join('');
}


  const generateParagraph = (n=7) => {
  let paragraph = [];
  let maxLength = 1000;
  let maxSentence = n;

  while (maxLength > 0 && maxSentence > 0){
    let tempSentence = generateSentence();
    paragraph.push(tempSentence);
    maxLength -= tempSentence.length;
    maxSentence --;
  }

  return paragraph.join('');
}

const generateArticle = (n=5) => {
  let article = new Array(n);
  for (let i = 0; i < n; i++){
    article[i] = generateParagraph();
  }

  return article.join('\n\n');
}

//.. button event listeners
buttonWordCount.addEventListener("click", () => {
  containerWordCount.innerText = generateText(20);
})

buttonSentence.addEventListener("click", () => {
  containerSentence.innerText = generateSentence();
})

buttonParagraph.addEventListener("click", () => {
  containerParagraph.innerText = generateParagraph();
})

buttonArticle.addEventListener("click", () => {
  containerArticle.innerText = generateArticle();
})