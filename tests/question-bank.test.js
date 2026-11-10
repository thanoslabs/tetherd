import test from 'node:test';
import assert from 'node:assert/strict';
import {questions} from '../src/questions.js';
import {normalize,validate,dailyQuestions,solve,PUZZLE_LENGTH} from '../src/logic.js';

test('question IDs and normalized accepted answers are unique',()=>{
  assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
  for(const q of questions){
    assert.ok(q.answers.length>=8,q.id+' has too few answers');
    assert.equal(new Set(q.answers.map(normalize)).size,q.answers.length,q.id+' contains duplicate accepted answers');
  }
});

test('common missing answers are accepted',()=>{
  for(const [id,answer] of [['fruit','Tomato'],['country','Ecuador'],['country','England'],['country','Scotland'],['country','Wales'],['country','Northern Ireland']]){
    const q=questions.find(q=>q.id===id);
    assert.equal(validate(q,answer,'',[]).error,undefined,id+': '+answer);
  }
});

test('daily generator still yields a solvable seven-question chain',()=>{
  for(const date of ['2026-11-10','2026-11-11','2026-12-01']){
    const selected=dailyQuestions(questions,date);
    assert.equal(selected.length,PUZZLE_LENGTH);
    assert.equal(new Set(selected.map(q=>q.id)).size,PUZZLE_LENGTH);
    assert.ok(solve(selected),date);
  }
});
