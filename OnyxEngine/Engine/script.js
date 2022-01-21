var mat4 = glMatrix.mat4;
var vertexShaderText = 
[
  'precision mediump float;',
  '',
  'attribute vec3 vertPosition;',
  'attribute vec3 vertColor;',
  'varying vec3 fragColor;',
  'uniform mat4 mWorld;',
  'uniform mat4 mView;',
  'uniform mat4 mProj;',
  '',
  'void main()',
  '{',
  ' fragColor = vertColor;',
  ' gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
  '}'
].join('\n');

var fragmentShaderText = 
[
  'precision mediump float;',
  '',
  'varying vec3 fragColor;',
  'void main()',
  '{',
  ' gl_FragColor = vec4(fragColor, 1.0);',
  '}'
].join('\n');


var _Init = function () {
  console.log("This Function Is Working!")

  var canvas = document.getElementById('glCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var gl = canvas.getContext('webgl');

  if (!gl) {
    console.log('WebGL not supported')
    gl = canvas.getContext('experimental-webgl');
  }

  if (!gl) {
    alert('Your Browser Does Not Support WebGL')
  }

  gl.clearColor(0.1, 0.1, 0.1, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);

  //
  // Create Shader
  //
  
  var vertextShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertextShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  gl.compileShader(vertextShader);

  if (!gl.getShaderParameter(vertextShader, gl.COMPILE_STATUS)){
    console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertextShader));
    return;
  }

  gl.compileShader(fragmentShader);

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
    console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
    return;
  }

  var program = gl.createProgram();
  gl.attachShader(program, vertextShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('ERROR linking program!', gl.getProgramInfoLog(program));
    return;
  }

  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error('ERROR validating program!', gl.getProgramInfoLog(program));
    return;
  }

  //
  // Create Buffer
  //
  var boxVertices =
  [ // X,Y,Z           R, G, B
    //TOP
    -1.0, 1.0, -1.0,     1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,   1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,    1.0, 1.0, 1.0,
    
    //LEFT
    -1.0, 1.0, 1.0,     0.0, 0.0, 1.0,
    -1.0, -1.0, 1.0,   0.0, 0.0, 1.0,
    -1.0, -1.0, -1.0,    0.0, 0.0, 1.0,
    -1.0, 1.0, -1.0,    0.0, 0.0, 1.0,

    //RIGHT
    1.0, 1.0, 1.0,     1.0, 0.5, 0.0,
    1.0, -1.0, 1.0,   1.0, 0.5, 0.0,
    1.0, -1.0, -1.0,    1.0, 0.5, 0.0,
    1.0, 1.0, -1.0,    1.0, 0.5, 0.0,

    //FRONT
    1.0, 1.0, 1.0,    1.0, 0.0, 0.0,
    1.0, -1.0, 1.0,  1.0, 0.0, 0.0,
    -1.0, -1.0, 1.0,   1.0, 0.0, 0.0,
    -1.0, 1.0, 1.0,   1.0, 0.0, 0.0,

    //BACK
    1.0, 1.0, -1.0,     0.0, 1.0, 0.0,
    1.0, -1.0, -1.0,   0.0, 1.0, 0.0,
    -1.0, -1.0, -1.0,    0.0, 1.0, 0.0,
    -1.0, 1.0, -1.0,    0.0, 1.0, 0.0,

    //BOTTOM
    -1.0, -1.0, -1.0,     1.0, 1.0, 0.0,
    -1.0, -1.0, 1.0,   1.0, 1.0, 0.0,
    1.0, -1.0, 1.0,    1.0, 1.0, 0.0,
    1.0, -1.0, -1.0,    1.0, 1.0, 0.0
  ];

  var boxIndices =
  [
    //TOP
    0, 1, 2,
    0, 2, 3,

    //LEFT
    5, 4, 6,
    6, 4, 7,

    //RIGHT
    8, 9, 10,
    8, 10, 11,

    //FRONT
    13, 12, 14,
    15, 14, 12,

    //BACK
    16, 17, 18,
    16, 18, 19,

    //BOTTOM
    21, 20, 22,
    22, 20, 23
  ];

  var boxVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

  var boxIndexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW)

  var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
  gl.vertexAttribPointer(
    positionAttribLocation,
    3,
    gl.FLOAT,
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT,
    0
  );
  gl.vertexAttribPointer(
    colorAttribLocation,
    3,
    gl.FLOAT,
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT,
    3 * Float32Array.BYTES_PER_ELEMENT
  );

  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);


  
  gl.useProgram(program);
    
  var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
  var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
  var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
  
  var worldMatrix = new Float32Array(16);
  var viewMatrix = new Float32Array(16);
  var projMatrix = new Float32Array(16);
  mat4.identity(worldMatrix);


  mat4.lookAt(viewMatrix, [0, 0, 0], [0, 0, 0,], [0, 1, 0]);


  mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0)

  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
  
  var xRotationMatrix = new Float32Array(16);
  var yRotationMatrix = new Float32Array(16);

  //
  // Main Render Loop
  //

  var identityMatrix = new Float32Array(16);
  mat4.identity(identityMatrix)
  var angle = 0;
  var loop = function () {

    angle = performance.now() / 1000 / 6 * 2 * Math.PI;
    mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
    mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
    mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    gl.clearColor(0.1, 0.1, 0.1, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  

};
