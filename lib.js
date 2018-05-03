
//获取到program的方法
function initShader(gl,vertexShaderSource,fragmentShaderSource){
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader,vertexShaderSource);
  gl.shaderSource(fragmentShader,fragmentShaderSource);

  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);


  var program = gl.createProgram();

  gl.attachShader(program,vertexShader);
  gl.attachShader(program,fragmentShader);

  gl.linkProgram(program);
  gl.useProgram(program);

  return program;
}
