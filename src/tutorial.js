import config from '../puzzles/tutorial.json' with {type:'json'};
import {questions} from './questions.js';
import {validate,normalize,first,last,score,linked} from './logic.js';

const puzzle=config.questionIds.map(id=>questions.find(q=>q.id===id));
const initial=()=>({answers:Array(puzzle.length).fill(''),revealed:0,best:null});
let state=initial(),current=0,error='',draft='',showFinish=false,celebrate=false;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const finished=()=>state.answers.every(Boolean)&&linked(state.answers)&&new Set(state.answers.map(normalize)).size===puzzle.length;
const prefix=()=>current>0&&state.answers[current-1]?last(state.answers[current-1]):'';
export function tutorialView(){
 const done=finished();
 return `<main class="game tutorial-page"><header><a href="${import.meta.env.BASE_URL}" id="tutorial-home" class="brand">tether'd</a><span class="pill">Practice · 5 questions</span></header><section class="intro"><div class="eyebrow">LEARN THE CHAIN</div><h1>Try a short tether<span>.</span></h1><p>Answer five trivia questions. Each new answer starts with the last letter of the previous one. Your answers are just for practice.</p></section><section class="stats"><div><small>LETTERS</small><strong>${score(state.answers)}</strong></div><div><small>BEST</small><strong>${state.best??'—'}</strong></div><div><small>REVEALED</small><strong>${state.revealed+1}/5</strong></div></section><section class="questions">${puzzle.map((q,i)=>i>state.revealed?`<div class="locked"><span>0${i+1}</span><span>Question locked</span></div>`:`<button class="question ${i===current?'active':''}" data-tutorial-index="${i}"><div class="question-top"><small>QUESTION 0${i+1} · ${esc(q.category.toUpperCase())}</small><span>${state.answers[i]?'✓':'○'}</span></div><div class="prompt">${esc(q.prompt)}</div><div class="answer">${esc(state.answers[i]||'Your answer…')}</div></button>`).join('')}</section><section class="entry floating-entry"><div class="entry-head"><span>ANSWER QUESTION 0${current+1}</span><span>${prefix()?'STARTS WITH '+prefix().toUpperCase():'ANY LETTER'}</span></div><label for="tutorial-answer">${esc(puzzle[current].prompt)}</label><form id="tutorial-form"><input id="tutorial-answer" placeholder="Type your answer…" autocomplete="off" value="${esc(draft)}"><button class="primary">Confirm ↗</button></form><div class="feedback" role="status">${esc(error)}</div><p class="tutorial-tip">Tip: ${current===0?'Try Mars to start.':'Your answer must start with '+(prefix()||'any letter').toUpperCase()+'.'} You can edit earlier answers.</p></section></main>${showFinish&&done?`<div class="modal-backdrop"><section class="completion-modal" role="dialog" aria-modal="true" aria-labelledby="tutorial-finish"><div class="eyebrow">TUTORIAL COMPLETE</div><h2 id="tutorial-finish">You made a tether!</h2><p>Five linked answers · ${score(state.answers)} letters</p><div class="modal-actions"><button id="tutorial-again" class="ghost">Try again</button><button id="tutorial-daily" class="primary">Play today's chain ↗</button></div></section></div>`:''}${celebrate&&showFinish?'<div class="celebration" aria-hidden="true">'+Array.from({length:55},(_,i)=>`<i style="--i:${i};--x:${(i*37)%100}%;--delay:${(i%9)*-.08}s;--rot:${(i*71)%360}deg"></i>`).join('')+'</div>':''}`;
}
export function bindTutorial(render,navigate){
 document.querySelector('#tutorial-home')?.addEventListener('click',e=>{e.preventDefault();navigate('home');});
 document.querySelectorAll('[data-tutorial-index]').forEach(el=>el.addEventListener('click',()=>{current=Number(el.dataset.tutorialIndex);draft=state.answers[current]||'';error='';render();}));
 document.querySelector('#tutorial-answer')?.addEventListener('input',e=>{draft=e.target.value;});
 document.querySelector('#tutorial-form')?.addEventListener('submit',e=>{
  e.preventDefault();const used=state.answers.filter((_,i)=>i!==current);
  const result=validate(puzzle[current],draft,prefix(),used);
  if(result.error){error=result.error;render();return;}
  state.answers[current]=result.answer;
  const unlocked=current===state.revealed&&current<puzzle.length-1;
  if(unlocked){state.revealed++;current=state.revealed;}draft=state.answers[current]||'';error='';
  if(finished()){state.best=Math.min(state.best??Infinity,score(state.answers));showFinish=true;celebrate=true;}
  render();
  if(unlocked)requestAnimationFrame(()=>document.querySelector('[data-tutorial-index="'+current+'"]')?.scrollIntoView({behavior:'smooth',block:'center'}));
  if(celebrate){celebrate=false;setTimeout(()=>document.querySelector('.celebration')?.remove(),3500);}
 });
 document.querySelector('#tutorial-again')?.addEventListener('click',()=>{state=initial();current=0;draft='';error='';showFinish=false;render();});
 document.querySelector('#tutorial-daily')?.addEventListener('click',()=>navigate('play'));
}
