
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

const generateSentence = (lipsum=false, n=20) => {
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
    sentence[0] = sentence[0][0].toUpperCase() + sentence[0].slice(1)
  }
  return sentence.join('');
}


  const generateParagraph = (lipsum=false, n=7) => {
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
  let article = new Array(n);
  article[0] = generateParagraph(lipsum);
  for (let i = 1; i < n; i++){
    article[i] = generateParagraph();
  }

  return article.join('\n\n');
}

//.. button event listeners

buttonSentence.addEventListener("click", () => {
  containerSentence.innerText = generateSentence(start.checked);
})

buttonParagraph.addEventListener("click", () => {
  containerParagraph.innerText = generateParagraph(start.checked);
})

buttonArticle.addEventListener("click", () => {
  containerArticle.innerText = generateArticle(start.checked);
})