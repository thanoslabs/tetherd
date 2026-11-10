import {defineConfig} from 'vite';
import {cpSync,existsSync} from 'node:fs';
export default defineConfig({
  base:'/',
  plugins:[{
    name:'copy-dated-puzzles',
    closeBundle(){if(existsSync('puzzles'))cpSync('puzzles','dist/puzzles',{recursive:true});}
  }]
});
