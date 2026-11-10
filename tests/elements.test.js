import test from 'node:test';
import assert from 'node:assert/strict';
import {questions} from '../src/questions.js';
import {normalize,validate} from '../src/logic.js';
test('periodic table has all 118 elements plus US/UK spelling variants',()=>{
 const element=questions.find(q=>q.id==='element');
 assert.equal(element.answers.length,120);
 for(const name of ['Oganesson','Copernicium','Tennessine','Nihonium','Aluminum','Aluminium','Cesium','Caesium']){
  assert.equal(validate(element,name,'',[]).error,undefined,name);
 }
 assert.equal(new Set(element.answers.map(normalize)).size,120);
});
