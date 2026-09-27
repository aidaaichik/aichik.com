const crypto = require("crypto");

const owner = "aidaaichik";
const repo = "aichik.com";
const branch = "main";

function slugify(s){return s.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
function safeEqual(a,b){
 const A=Buffer.from(String(a||"")), B=Buffer.from(String(b||""));
 return A.length===B.length && crypto.timingSafeEqual(A,B);
}
async function gh(path, opts={}){
 const r=await fetch(`https://api.github.com/repos/${owner}/${repo}${path}`,{
  ...opts,headers:{Authorization:`Bearer ${process.env.GITHUB_ART_ADMIN_TOKEN}`,"User-Agent":"aichik-admin","Accept":"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28",...(opts.headers||{})}
 });
 if(!r.ok) throw new Error(`GitHub ${r.status}: ${await r.text()}`);
 return r.json();
}
async function put(path, content, message){
 let sha;
 try{sha=(await gh(`/contents/${path}?ref=${branch}`)).sha}catch(e){if(!String(e).includes("404")) throw e}
 return gh(`/contents/${path}`,{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify({message,content,branch,...(sha?{sha}:{})})});
}
exports.handler=async(event)=>{
 try{
  if(event.httpMethod!=="POST") return {statusCode:405,body:JSON.stringify({error:"Method not allowed"})};
  const x=JSON.parse(event.body||"{}");
  if(!safeEqual(x.password,process.env.ART_ADMIN_PASSWORD)) return {statusCode:401,body:JSON.stringify({error:"Incorrect admin password"})};
  if(!x.title||!x.imageBase64) return {statusCode:400,body:JSON.stringify({error:"Title and image are required"})};
  const slug=slugify(x.title), ext=(x.imageName.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"")||"jpg";
  const imgPath=`assets/artworks/${slug}.${ext}`;
  const esc=v=>String(v??"").replace(/"/g,'\\"');
  const md=`---\nlayout: artwork\ntitle: "${esc(x.title)}"\nslug: "${slug}"\nseries: "${esc(x.series)}"\nyear: "${esc(x.year)}"\nmedium: "${esc(x.medium)}"\ndimensions: "${esc(x.dimensions)}"\nlocation: "${esc(x.location)}"\nprice: "${esc(x.price)}"\ncurrency: "${esc(x.currency)}"\nstatus: "${esc(x.status)}"\nimage: "/${imgPath}"\npermalink: "/art/${slug}/"\n---\n${x.description||""}\n`;
  await put(imgPath,x.imageBase64,`Add artwork image: ${x.title}`);
  await put(`_artworks/${slug}.md`,Buffer.from(md).toString("base64"),`Publish artwork: ${x.title}`);
  return {statusCode:200,headers:{"content-type":"application/json"},body:JSON.stringify({url:`/art/${slug}/`})};
 }catch(e){return {statusCode:500,headers:{"content-type":"application/json"},body:JSON.stringify({error:e.message})}}
};