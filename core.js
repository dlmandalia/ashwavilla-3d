(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AshwaCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const FLOORS=['basement','ground','first','second'];
const CATEGORIES=['wall','roof','slab','glazing','frame','railing','landscape','site','furniture'];
function validateScene(s){
 const finite=a=>Array.isArray(a)&&a.every(Number.isFinite);
 const triple=a=>finite(a)&&a.length===3;
 if(!s||s.units!=='metres'||!Array.isArray(s.objects)||!s.objects.length)throw Error('The model must contain geometry in metres.');
 if(!s.bounds||!triple(s.bounds.min)||!triple(s.bounds.max)||s.bounds.min.some((v,i)=>v>s.bounds.max[i]))throw Error('Invalid model bounds.');
 const ids=new Set();
 for(const o of s.objects){
  if(!o||typeof o.id!=='string'||ids.has(o.id)||!CATEGORIES.includes(o.category)||![...FLOORS,'site'].includes(o.floor))throw Error('Invalid model object metadata.');ids.add(o.id);
  if(!finite(o.vertices)||o.vertices.length<9||o.vertices.length%3||!Array.isArray(o.indices)||!o.indices.length||o.indices.length%3||!o.indices.every(i=>Number.isInteger(i)&&i>=0&&i<o.vertices.length/3))throw Error('Invalid geometry: '+o.id);
  if(!triple(o.color)||o.color.some(v=>v<0||v>1)||(o.opacity!==undefined&&(!Number.isFinite(o.opacity)||o.opacity<0||o.opacity>1)))throw Error('Invalid material: '+o.id);
 }
 return s;
}
function objectVisible(o,state){return (state.floor==='all'||o.floor===state.floor)&&(state.roof||o.category!=='roof');}
function explodeOffset(floor,mode,height){return mode==='explode'?Math.max(0,FLOORS.indexOf(floor))*Math.max(1,Math.min(6,height*.3)):0;}
return {FLOORS,validateScene,objectVisible,explodeOffset};
});
