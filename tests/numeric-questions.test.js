import test from 'node:test';
import assert from 'node:assert/strict';
import {questions} from '../src/questions.js';
import tutorial from '../puzzles/tutorial.json' with {type:'json'};
import legacy from '../questions/legacy-ids.json' with {type:'json'};
import {countChains,linked,validate} from '../src/logic.js';

test('question IDs are unique positive integers',()=>{
 assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
 assert.ok(questions.every(q=>Number.isSafeInteger(q.id)&&q.id>0));
});
test('all legacy question IDs resolve to the same numbered question',()=>{
 for(const [oldId,id] of Object.entries(legacy)){
  assert.ok(questions.some(q=>q.id===id),oldId);
 }
});
test('tutorial uses five numeric question IDs and supports the example chain',()=>{
 assert.equal(tutorial.questionIds.length,5);
 assert.ok(tutorial.questionIds.every(id=>Number.isSafeInteger(id)));
 const sequence=tutorial.questionIds.map(id=>questions.find(q=>q.id===id));
 assert.ok(sequence.every(Boolean));
 assert.ok(linked(tutorial.exampleChain));
 for(let i=0;i<sequence.length;i++)assert.equal(validate(sequence[i],tutorial.exampleChain[i],i? tutorial.exampleChain[i-1].slice(-1).toLowerCase():'',tutorial.exampleChain.slice(0,i)).error,undefined);
 assert.ok(countChains(sequence,1000)>=1000);
});

test('country pool covers 193 UN members, observers, Kosovo, Taiwan and UK constituent countries',()=>{const countries=questions.find(q=>q.id===3).answers;assert.equal(countries.length,201);for(const name of ['Antigua and Barbuda','Bosnia and Herzegovina','Burkina Faso','Central African Republic','Democratic Republic of the Congo','Equatorial Guinea','Guinea-Bissau','Marshall Islands','Saint Lucia','Sierra Leone','Kosovo','Taiwan','England','Scotland','Wales','Northern Ireland'])assert.ok(countries.includes(name),name);});
test('instrument pool covers common orchestral, folk and electronic instruments',()=>{const instruments=questions.find(q=>q.id===6).answers;assert.ok(instruments.length>=200);for(const name of ['Electric Guitar','Bass Guitar','Double Bass','Drum Kit','Synthesizer','Marimba','Kalimba','Erhu','Tabla','Theremin','Ocarina'])assert.ok(instruments.includes(name),name);});
