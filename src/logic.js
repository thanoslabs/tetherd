export const PUZZLE_LENGTH = 7;
export const MIN_DAILY_CHAINS = 10;
export const MAX_DAILY_CHAINS = 20;
export const normalize = value => Array.from(value.normalize('NFKD')).filter(ch=>{const cp=ch.codePointAt(0);return cp<0x300||cp>0x36f;}).join('').toLowerCase().replace(/[^a-z]/g,'');
export const first = value => normalize(value)[0] || '';
export const last = value => normalize(value).slice(-1);
export const letters = value => normalize(value).length;
export const score = answers => answers.reduce((n,a)=>n+letters(a),0);
export const linked = answers => answers.every((a,i)=>!a || i===0 || !answers[i-1] || first(a)===last(answers[i-1]));
export const complete = answers => answers.length===PUZZLE_LENGTH && answers.every(Boolean) && linked(answers) && new Set(answers.map(normalize)).size===PUZZLE_LENGTH;
export function distance(a,b){a=normalize(a);b=normalize(b);const dp=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let prev=dp[0];dp[0]=i;for(let j=1;j<=b.length;j++){const temp=dp[j];dp[j]=Math.min(dp[j]+1,dp[j-1]+1,prev+(a[i-1]===b[j-1]?0:1));prev=temp;}}return dp[b.length];}
export function validate(question,input,required,used=[]){const v=normalize(input);if(!v)return {error:'Enter an answer.'};const match=question.answers.find(a=>normalize(a)===v);if(!match){const closest=question.answers.map(a=>({a,d:distance(a,v)})).sort((a,b)=>a.d-b.d)[0];return {error:closest&&closest.d<=Math.max(1,Math.floor(v.length/4))?'Not quite. Did you mean '+closest.a+'?':'That answer is not in our accepted list.'};}if(required&&first(match)!==required)return {error:'Your answer must start with '+required.toUpperCase()+'.'};if(used.some(a=>normalize(a)===v))return {error:'You already used that answer in this chain.'};return {answer:match};}
// Feasibility search: stops at the first complete valid chain to keep daily loading fast.
export function solve(sequence){const dead=new Set();function visit(i,required,used){if(i===sequence.length)return [];const key=i+'|'+required+'|'+[...used].sort().join(',');if(dead.has(key))return null;for(const a of sequence[i].answers){const n=normalize(a);if((required&&first(a)!==required)||used.has(n))continue;const next=visit(i+1,last(a),new Set([...used,n]));if(next)return [a,...next];}dead.add(key);return null;}const answers=visit(0,'',new Set());return answers?{cost:score(answers),answers}:null;}
// Count distinct complete answer sequences, stopping once the upper limit is exceeded.
// Answers are normalized so punctuation/case variants do not count as separate chains.
export function countChains(sequence,limit=MAX_DAILY_CHAINS+1){
  if(!Number.isInteger(limit)||limit<1)throw Error('Chain count limit must be positive');
  const choices=sequence.map(q=>{
    const byFirst=new Map();const seen=new Set();
    for(const answer of q.answers){const n=normalize(answer);if(!n||seen.has(n))continue;seen.add(n);
      const start=n[0];if(!byFirst.has(start))byFirst.set(start,[]);
      byFirst.get(start).push({value:n,end:n[n.length-1]});
    }
    return byFirst;
  });
  let count=0;
  function visit(i,required,used){
    if(count>=limit)return;
    if(i===choices.length){count++;return;}
    const options=required?(choices[i].get(required)||[]):[...choices[i].values()].flat();
    for(const option of options){if(used.has(option.value))continue;
      used.add(option.value);visit(i+1,option.end,used);used.delete(option.value);
      if(count>=limit)return;
    }
  }
  visit(0,'',new Set());return count;
}
export function seeded(seed){let n=seed>>>0;return ()=>{n=(n+0x6D2B79F5)|0;let t=Math.imul(n^(n>>>15),1|n);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296;};}
export function dailyQuestions(bank,date){const day=Math.floor(Date.parse(date+'T00:00:00Z')/86400000);const rng=seeded(day);for(let attempt=0;attempt<1500;attempt++){const pool=[...bank];for(let i=pool.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}const selected=pool.slice(0,PUZZLE_LENGTH);const chains=countChains(selected);if(chains>=MIN_DAILY_CHAINS&&chains<=MAX_DAILY_CHAINS)return selected;}throw Error('Unable to build a daily puzzle with 10–20 valid chains');}
