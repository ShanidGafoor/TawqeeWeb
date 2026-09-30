import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
export async function openBrowser() {
  if (!process.env.BROWSER_PATH) throw new Error('Set BROWSER_PATH to a Chrome or Chromium executable.');
  const profile = await mkdtemp(path.join(os.tmpdir(), 'tawqee-web-check-'));
  const child = spawn(process.env.BROWSER_PATH, ['--headless','--disable-gpu','--no-first-run','--remote-debugging-port=0',`--user-data-dir=${profile}`], {windowsHide:true, stdio:['ignore','ignore','pipe']});
  let socket;
  try {
    const endpoint = await new Promise((resolve,reject) => {
      const timer = setTimeout(() => reject(new Error('Chrome startup timed out')),20000);
      let output = '';
      child.stderr.on('data', chunk => { output += chunk; const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/); if(match){clearTimeout(timer);resolve(match[1]);} });
      child.on('error', error => {clearTimeout(timer);reject(error);});
      child.on('exit', code => {clearTimeout(timer);reject(new Error(`Chrome exited: ${code}`));});
    });
    socket = new WebSocket(endpoint);
    await new Promise((resolve,reject) => {socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
    let nextId=0;
    const pending = new Map();
    socket.addEventListener('message',event=>{const message=JSON.parse(event.data);const handler=pending.get(message.id);if(handler){pending.delete(message.id);clearTimeout(handler.timer);message.error?handler.reject(new Error(message.error.message)):handler.resolve(message.result);}});
    function send(method,params={},sessionId){return new Promise((resolve,reject)=>{const id=++nextId;const timer=setTimeout(()=>{pending.delete(id);reject(new Error(`CDP timeout: ${method}`));},20000);pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));});}
    const {targetId}=await send('Target.createTarget',{url:'about:blank'});
    const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
    const command=(method,params)=>send(method,params,sessionId);
    await command('Page.enable'); await command('Runtime.enable');
    return { command, async evaluate(expression){const response=await command('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(response.exceptionDetails)throw new Error(response.exceptionDetails.text+JSON.stringify(response.exceptionDetails.exception));return response.result.value;}, async close(){try{await send('Browser.close');}catch{}socket.close();child.kill();await new Promise(resolve=>setTimeout(resolve,300));await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:300});} };
  }catch(error){socket?.close();child.kill();throw error;}
}
