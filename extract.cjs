const fs=require('fs');
const f='C:/Users/Sahil/Downloads/baffle_interactions.lovable.app/baffle-interactions.lovable.app/assets/routes-BPFs7HTC.js';
const s=fs.readFileSync(f,'utf8');
function extract(name){let i=s.indexOf(name+' = `');if(i<0)return null;i+=name.length+4;let out='',esc=false;for(;i<s.length;i++){let c=s[i];if(c==='`'&&!esc)return out;if(c==='\\'&&!esc){esc=true;out+=c;continue}esc=false;out+=c}return null}
const names={swap:'Bd',tilt:'Hd',magnetic:'Vd',dock:'Ud',segmented:'Wd',spread:'$p',accordion:'em',lens:'tm',trail:'nm'};
const map={};for(const [k,n] of Object.entries(names))map[k]=extract(n);
for(const k of ['swap','tilt','magnetic','dock','segmented','spread','accordion','lens','trail'])console.log(k,map[k]?.length||0);
fs.writeFileSync('src/zipSources.json',JSON.stringify(map,null,2));
