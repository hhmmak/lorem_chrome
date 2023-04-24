const beginner = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit']
const symbol = ['.', ',']
const word = ['dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'ut', 'magna', 'sed', 'pulvinar', 'ultricies', 
  'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat',
  'dolore', 'eu', 'fugiat', 'nulla', 'pariatur', 'in', 'voluptate', 'velit', 'esse', 'nunc', 'eros', 'quis', 'urna']

const container = document.getElementById('result')
const start = document.getElementById('startWithLorem')
const generate = document.getElementById('buttonGenerate')

const randomWord = (upper=false) => {

  let idx = Math.floor(Math.random() * word.length);
  return word[idx];
}

const generateText = (n=100) => {

  let result = start.checked ? [... beginner, symbol[Math.round(Math.random())] ] : [randomWord(true)];
  let count = start? n - 8 : n - 1;

  for (let i = 0; i < count; i ++){
    result.push( randomWord() );
  }

  return result.join(' ');
}

generate.addEventListener("click", () => {
  container.innerText = generateText(20);
})