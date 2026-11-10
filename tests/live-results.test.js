import test from 'node:test';
import assert from 'node:assert/strict';
import {canComplete,resultSquares,shareText,PUZZLE_LENGTH} from '../src/logic.js';

const words=['ab','bc','cd','de','ef','fg','gh'];
const sequence=words.map(word=>({answers:[word]}));
test('blank squares reflect whether a complete chain is possible',()=>{
  assert.equal(sequence.length,PUZZLE_LENGTH);
  assert.equal(canComplete(sequence,Array(PUZZLE_LENGTH).fill('')),true);
  assert.equal(resultSquares(sequence,Array(PUZZLE_LENGTH).fill('')),'⬛'.repeat(PUZZLE_LENGTH));
  const broken=['ab','','wrong','','','',''];
  assert.equal(canComplete(sequence,broken),false);
  assert.equal(resultSquares(sequence,broken),'🟦⬛🟦⬛⬛⬛⬛'.replaceAll('⬛','🟥'));
});
test('hint usage is tracked per question and shown in shared text',()=>{
  const answers=['ab','bc','','','','',''];
  assert.equal(resultSquares(sequence,answers,[1]),'🟦🟨'+'⬛'.repeat(5));
  const share=shareText('2026-11-10',sequence,answers,[1],2,false);
  assert.match(share,/2\/7 · 4 letters · 2\/3 hints/);
  assert.ok(share.includes('🟦🟨'+'⬛'.repeat(5)));
});
test('fixed invalid answers and repeated answers cannot be completed',()=>{
  assert.equal(canComplete(sequence,['ab','ab','','','','','']),false);
  assert.equal(canComplete(sequence,['ab','bc','cd','de','ef','fg','gh']),true);
});
