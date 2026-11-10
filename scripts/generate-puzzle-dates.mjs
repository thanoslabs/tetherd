import {readdir,writeFile} from 'node:fs/promises';
const dates=[];
for(const year of await readdir('puzzles',{withFileTypes:true})){
 if(!year.isDirectory()||!/^\d{4}$/.test(year.name))continue;
 for(const month of await readdir('puzzles/'+year.name,{withFileTypes:true})){
  if(!month.isDirectory()||!/^\d{2}$/.test(month.name))continue;
  for(const day of await readdir('puzzles/'+year.name+'/'+month.name)){
   if(!/^\d{2}\.json$/.test(day))continue;
   const date=year.name+'-'+month.name+'-'+day.slice(0,2);
   if(new Date(date+'T00:00:00Z').toISOString().slice(0,10)===date)dates.push(date);
  }
 }
}
dates.sort();
await writeFile('src/puzzle-dates.json',JSON.stringify(dates,null,2)+'\n');
console.log('Indexed',dates.length,'dated puzzles');
