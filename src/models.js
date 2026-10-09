import * as THREE from 'three';
export function parsePrompt(prompt,width=60,height=60,depth=40){
 const p=prompt.toLowerCase();
 const shape=/\b(vase|planter)\b/.test(p)?'vase':/\b(ball|sphere)\b/.test(p)?'sphere':/\b(cylinder|tube)\b/.test(p)?'cylinder':/\b(box|block|cube)\b/.test(p)?'box':null;
 if(!shape)throw new Error('Try “box 60 x 40 x 20 mm”, “sphere”, “cylinder”, or “vase”. For raised lettering, choose Text plaque.');
 const dims=p.match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/);
 if(dims)[width,depth,height]=dims.slice(1).map(Number);
 for(const n of [width,height,depth])if(!Number.isFinite(n)||n<5||n>250)throw new Error('Dimensions must be between 5 and 250 mm.');
 return {shape,width,height,depth};
}
export function makeShape({shape,width,height,depth}){
 let g;
 if(shape==='box')g=new THREE.BoxGeometry(width,depth,height);
 if(shape==='sphere'){g=new THREE.SphereGeometry(1,64,32);g.scale(width/2,depth/2,height/2);}
 if(shape==='cylinder'){g=new THREE.CylinderGeometry(width/2,width/2,height,64);g.rotateX(Math.PI/2);g.scale(1,depth/width,1);}
 if(shape==='vase'){
  const r=Math.min(width,depth)/2,wall=Math.min(2,r/3),base=2;
  const points=[new THREE.Vector2(0,0),new THREE.Vector2(r*.68,0),new THREE.Vector2(r*.85,height*.15),new THREE.Vector2(r,height*.48),new THREE.Vector2(r*.63,height*.85),new THREE.Vector2(r*.68,height),new THREE.Vector2(r*.68-wall,height),new THREE.Vector2(r*.63-wall,height*.85),new THREE.Vector2(r-wall,height*.48),new THREE.Vector2(r*.85-wall,height*.15),new THREE.Vector2(r*.68-wall,base),new THREE.Vector2(0,base)];
  g=new THREE.LatheGeometry(points,96);g.rotateX(Math.PI/2);g.scale(width/(2*r),depth/(2*r),1);
 }
 g.computeBoundingBox();g.translate(0,0,-g.boundingBox.min.z);g.computeVertexNormals();return g;
}
export function reliefGeometry(samples,columns,rows,width,depth,base,rise){
 const vertices=[],indices=[];
 for(let y=0;y<rows;y++)for(let x=0;x<columns;x++)vertices.push(x/(columns-1)*width-width/2,depth/2-y/(rows-1)*depth,base+samples[y*columns+x]*rise);
 const bottom=vertices.length/3;
 for(let y=0;y<rows;y++)for(let x=0;x<columns;x++)vertices.push(x/(columns-1)*width-width/2,depth/2-y/(rows-1)*depth,0);
 for(let y=0;y<rows-1;y++)for(let x=0;x<columns-1;x++){
  const a=y*columns+x,b=a+1,c=a+columns,d=c+1;
  indices.push(a,c,b,b,c,d,bottom+a,bottom+b,bottom+c,bottom+b,bottom+d,bottom+c);
 }
 const side=(a,b)=>indices.push(a,b,bottom+a,b,bottom+b,bottom+a);
 for(let x=0;x<columns-1;x++){side(x,x+1);side((rows-1)*columns+x+1,(rows-1)*columns+x);}
 for(let y=0;y<rows-1;y++){side((y+1)*columns,y*columns);side(y*columns+columns-1,(y+1)*columns+columns-1);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();return g;
}
export function binarySTL(geometry){
 const g=geometry.index?geometry.toNonIndexed():geometry;
 const a=g.attributes.position;const triangles=[];
 const p=new THREE.Vector3(),q=new THREE.Vector3(),r=new THREE.Vector3(),normal=new THREE.Vector3();
 for(let i=0;i<a.count;i+=3){p.fromBufferAttribute(a,i);q.fromBufferAttribute(a,i+1);r.fromBufferAttribute(a,i+2);normal.crossVectors(q.clone().sub(p),r.clone().sub(p));if(normal.lengthSq()<1e-14)continue;normal.normalize();triangles.push([normal.x,normal.y,normal.z,p.x,p.y,p.z,q.x,q.y,q.z,r.x,r.y,r.z]);}
 const buffer=new ArrayBuffer(84+triangles.length*50),view=new DataView(buffer);view.setUint32(80,triangles.length,true);let offset=84;
 for(const triangle of triangles){for(const value of triangle){view.setFloat32(offset,value,true);offset+=4;}view.setUint16(offset,0,true);offset+=2;}
 if(g!==geometry)g.dispose();return buffer;
}
