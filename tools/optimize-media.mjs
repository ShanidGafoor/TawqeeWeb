import { readFile, writeFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { openBrowser } from './browser.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const source=process.env.MEDIA_SOURCE;
const logo=process.env.LOGO_SOURCE;
if(!source || !logo)throw new Error('Set MEDIA_SOURCE to the supplied demo directory and LOGO_SOURCE to the logo PNG.');
const browser=await openBrowser();
try{
  for(const item of [{input:logo,output:'logo.webp',width:522,type:'image/webp',quality:.92},{input:path.join(source,'f200.png'),output:'demo-poster.webp',width:960,type:'image/webp',quality:.87},{input:path.join(source,'f540.png'),output:'fields.webp',width:960,type:'image/webp',quality:.9},{input:path.join(source,'f200.png'),output:'social.jpg',width:1200,height:630,type:'image/jpeg',quality:.92}]){
    const data='data:image/png;base64,'+(await readFile(item.input)).toString('base64');
    const options=JSON.stringify({...item,data});
    const output=await browser.evaluate(`(async()=>{const o=${options};const image=new Image();image.src=o.data;await image.decode();const c=document.createElement('canvas');c.width=o.width;c.height=o.height||Math.round(image.height*o.width/image.width);const ctx=c.getContext('2d');if(o.height){ctx.fillStyle='#0b1222';ctx.fillRect(0,0,c.width,c.height);const width=1120;const height=image.height*width/image.width;ctx.drawImage(image,(c.width-width)/2,(c.height-height)/2,width,height);}else ctx.drawImage(image,0,0,c.width,c.height);return c.toDataURL(o.type,o.quality).split(',')[1];})()`);
    const destination=path.join(root,'assets',item.output);await writeFile(destination,Buffer.from(output,'base64'));console.log(`${item.output}: ${(await stat(destination)).size} bytes`);
  }
}finally{await browser.close();}
