
//获取到program的方法
function initShader(gl,vertexShaderSource,fragmentShaderSource){
  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader,vertexShaderSource);
  gl.shaderSource(fragmentShader,fragmentShaderSource);

  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);


  let program = gl.createProgram();

  gl.attachShader(program,vertexShader);
  gl.attachShader(program,fragmentShader);

  gl.linkProgram(program);
  gl.useProgram(program);

  return program;
}


//矩阵复合变化的函数
function mixMatrix(matrixA,matrixB){
  let result = new Float32Array(16);

  for(let i = 0;i < 4; i ++){
    result[i] = matrixA[i] * matrixB[0] + matrixA[i + 4] * matrixB[1] + matrixA[i + 8] * matrixB[2] + matrixA[i + 12] * matrixB[3];
    result[i + 4] = matrixA[i] * matrixB[4] + matrixA[i + 4] * matrixB[5] + matrixA[i + 8] * matrixB[6] + matrixA[i + 12] * matrixB[7];
    result[i + 8] = matrixA[i] * matrixB[8] + matrixA[i + 4] * matrixB[9] + matrixA[i + 8] * matrixB[10] + matrixA[i + 12] * matrixB[11];
    result[i + 12] = matrixA[i] * matrixB[12] + matrixA[i + 4] * matrixB[13] + matrixA[i + 8] * matrixB[14] + matrixA[i + 12] * matrixB[15];
  }
  return result;
}

//绑定buffer
function bindBuffer(gl,attributeName,data,program,n){
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
  let aposlocation = gl.getAttribLocation(program,attributeName);

  gl.vertexAttribPointer(aposlocation,n || 2,gl.FLOAT,false,0,0);
  gl.enableVertexAttribArray(aposlocation)
}

//创建旋转矩阵
function createXZMatrix(angle){
  let t = Math.PI * angle / 180;
  let sinB = Math.sin(t);
  let cosB = Math.cos(t);
  return new Float32Array([
    cosB,-sinB,0.0,0.0,
    sinB,cosB,0.0,0.0,
    0.0,0.0,1.0,0.0,
    0.0,0.0,0.0,1.0
  ])
}
//创建平移矩阵
function createPYMatrix(tx,ty){
  return new Float32Array([
    1.0,0.0,0.0,0.0,
    0.0,1.0,0.0,0.0,
    0.0,0.0,1.0,0.0,
    tx,ty,0.0,1.0
  ])
}
//创建缩放矩阵
function createSFMatrix(sx,sy){
  return new Float32Array([
    sx,0.0,0.0,0.0,
    0.0,sy,0.0,0.0,
    0.0,0.0,1.0,0.0,
    0.0,0.0,0.0,1.0
  ]);
}

//乘积
function dot(a,b){
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

//矩阵相减
function minus(a,b){
  return new Float32Array([a[0]-b[0],a[1]-b[1],a[2]-b[2]])
}

//函数归一  规范化处理
function normalize(v){
  let sum = 0;
  for(let i = 0;i < v.length;i ++){
    sum += v[i] * v[i];
  }
  let result = Math.sqrt(sum);
  for(let j = 0;j < v.length;j ++){
    v[j] = v[j] / result;
  }
}

//差积处理  是交错相乘
function cross(a,b){
  let nx = a[1] * b[2] - a[2] * b[1];
  let ny = a[2] * b[0] - a[0] * b[2];
  let nz = a[0] * b[1] - a[1] * b[0];
  return new Float32Array([nx,ny,nz]);
}

//正射投影矩阵
function getVm(l,r,t,b,f,n){
  //接受的六个参数分别是left,right,top,bottom,far,near
  return new Float32Array([
    2/(r - l) ,            0 ,             0 ,          0,
        0,             2/(t - b),          0,           0,
        0,                 0,         -2/(f - n),       0,
    -(r+l)/(r-l),    -(t+b)/(t-b),   -(f+n)/(f-n),      1
  ])
}

//获取视图矩阵
function getMatrix(x,y,z,ax,ay,az){
  var eye = new Float32Array([x,y,z]);
  var lookat = new Float32Array([ax,ay,az]);
  var up = new Float32Array([0,1,1]);

  var za = minus(eye,lookat);
  normalize(up);
  normalize(z);

  var xa = cross(up,z);
  normalize(x);
  var ya = cross(z,x);
  return new Float32Array([
    xa[0],ya[0],za[0],0,
    xa[1],ya[1],za[1],0,
    xa[2],ya[2],za[2],0,
    -dot(xa,eye),-dot(ya,eye),-dot(za,eye),1
  ])

}

//获取透视投影矩阵
function getTs(fov,aspect,far,near){
  fov = Math.PI * fov / 180;
  return new Float32Array([
    1/aspect* Math.tan(fov/2),0,0,0,
    0,1/Math.tan(fov/2),0,0,
    0,0,-(far + near)/(far -near),-(far * near * 2)/(far - near),
    0,0,1,0,
  ])
}






























