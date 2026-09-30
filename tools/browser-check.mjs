import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import { openBrowser } from './browser.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const port=Number(process.env.CHECK_PORT||4175);
const address=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,[path.join(root,'tools','serve.mjs')],{env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe'],windowsHide:true});
await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(new Error(`Server exited ${code}`)));});
let browser;
const evidence=path.join(root,'evidence');
await mkdir(evidence,{recursive:true});
try{
 browser=await openBrowser();
 await browser.command('Page.navigate',{url:address});
 for(let i=0;i<50;i++){if(await browser.evaluate('document.readyState === "complete"'))break;await new Promise(r=>setTimeout(r,100));}
 await browser.evaluate('document.fonts.ready.then(()=>true)');
 const report=[];
 for(const [width,height] of [[1440,1000],[1024,900],[768,1024],[390,844],[320,800]]){
   await browser.command('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
   await browser.evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
   const state=await browser.evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,images:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src),font:document.fonts.check('500 16px Jakarta'),videoRequested:performance.getEntriesByType('resource').some(r=>r.name.endsWith('.mp4'))})`);
   if(state.scrollWidth>width)console.log(await browser.evaluate(`[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth && getComputedStyle(e).position!=='absolute').map(e=>({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width})).slice(0,20)`));
   assert(state.scrollWidth<=width,`Horizontal overflow at ${width}: ${state.scrollWidth}`);
   assert.equal(state.images.length,0,'No broken images');assert(state.font,'Local font loaded');assert(!state.videoRequested,'Video not eagerly fetched');
   report.push(state);
   if(width===1440||width===390){
     await browser.evaluate(`Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});})).then(()=>true)`);
     const metrics=await browser.command('Page.getLayoutMetrics');
     const shot=await browser.command('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height:metrics.cssContentSize.height,scale:1}});
     await writeFile(path.join(evidence,`${width===1440?'desktop':'mobile'}.png`),Buffer.from(shot.data,'base64'));
   }
 }
 await browser.evaluate(`document.querySelector('.menu-toggle').click()`);
 assert(await browser.evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='true'`));
 await browser.command('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});
 assert(await browser.evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='false'`));
 await browser.evaluate(`document.querySelector('.menu-toggle').click();document.querySelector('#navigation a').click()`);
 assert(await browser.evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='false'`));
 await browser.evaluate(`document.querySelector('.faq-list summary').click()`);
 assert(await browser.evaluate(`document.querySelector('.faq-list details').open`));
 const contacts=await browser.evaluate(`[...document.querySelectorAll('a[href^="mailto:"]')].every(a=>a.href.startsWith('mailto:sales@forgrise.com'))`);assert(contacts);
 await browser.command('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 assert.equal(await browser.evaluate(`getComputedStyle(document.documentElement).scrollBehavior`),'auto');
 const range=await fetch(address+'/assets/tawqee-demo.mp4',{headers:{Range:'bytes=0-99'}});assert.equal(range.status,206);assert.equal((await range.arrayBuffer()).byteLength,100);
 assert.equal((await fetch(address+'/package.json')).status,404);
 assert.equal((await fetch(address+'/assets/tawqee-demo.mp4',{headers:{Range:'bytes=999999999-'}})).status,416);
 const playback=await browser.evaluate(`(async()=>{const v=document.querySelector('video');v.muted=true;await v.play();await new Promise(r=>setTimeout(r,800));const result={duration:v.duration,time:v.currentTime,width:v.videoWidth};v.pause();return result;})()`);
 assert(playback.time>0&&playback.width>0,'Video plays');assert(Math.abs(playback.duration-42.6667)<1);
 report.push({navigation:'open, Escape, link close passed',faq:'passed',contact:'passed',reducedMotion:'passed',rangeRequests:'passed',privateFiles:'not served',playback});
 await writeFile(path.join(evidence,'checks.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
}finally{if(browser)await browser.close();server.kill();}
