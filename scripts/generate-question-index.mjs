import {readdir,readFile,writeFile} from 'node:fs/promises';
const files=(await readdir('questions')).filter(name=>/^\d+\.json$/.test(name)).sort((a,b)=>Number(a.slice(0,-5))-Number(b.slice(0,-5)));
if(!files.length)throw Error('No question files');
const ids=new Set();
for(const name of files){const q=JSON.parse(await readFile('questions/'+name,'utf8'));const id=Number(name.slice(0,-5));if(!Number.isSafeInteger(id)||id<1||q.id!==id||ids.has(id))throw Error('Invalid or duplicate ID in '+name);if(typeof q.prompt!=='string'||!q.prompt.trim()||typeof q.category!=='string'||!Number.isInteger(q.difficulty)||!Array.isArray(q.answers)||!q.answers.length||q.answers.some(a=>typeof a!=='string'||!a.trim()))throw Error('Invalid question data: '+name);ids.add(id);}
const imports=files.map((name,i)=>`import q${i} from '../questions/${name}' with {type:'json'};`).join('\n');
const source='// Auto-generated. Run npm run questions:generate.\n'+imports+'\nexport const questions=['+files.map((_,i)=>'q'+i).join(',')+'];\n';
await writeFile('src/questions.js',source);
console.log('Validated and indexed',files.length,'questions');
