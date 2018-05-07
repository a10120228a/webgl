/**
 *----------------------------------------------------------------------------------------------------------------------
 *着色器的编写
 *    顶点着色器 源码
 *      var vertexShaderSource = "" +
 *         "attribute vec4 apos;" +
 *         "void main(){" +
 *         " gl_Position = xf * apos;" +
 *         "}";
 *    片元着色器 源码
 *
 *       var fragmentShaderSource = "" +
 *         "void main(){" +
 *         " gl_FragColor = vec4(1.0,0.0,0.0,1.0);" +
 *         "}";
 *    初始化着色器
 *         function initShader(gl,vertexShaderSource,fragmentShaderSource){
 *           var vertexShader = gl.createShader(gl.VERTEX_SHADER);
 *           var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
 *
 *           gl.shaderSource(vertexShader,vertexShaderSource);
 *           gl.shaderSource(fragmentShader,fragmentShaderSource);
 *
 *           gl.compileShader(vertexShader);
 *           gl.compileShader(fragmentShader);
 *
 *
 *           var program = gl.createProgram();
 *
 *           gl.attachShader(program,vertexShader);
 *           gl.attachShader(program,fragmentShader);
 *
 *           gl.linkProgram(program);
 *           gl.useProgram(program);
 *
 *           return program;
 *         }
 *    获取到apos
 *
 *      var program = initShader(gl,vertexShaderSource,fragmentShaderSource)
 *      var aposlocation = gl.getAttribLocation(program,'apos')
 *
 *    创建buffer
 *      var buffer = gl.createBuffer();
 *
 *    绑定buffer
 *
 *      gl.bindBuffer(gl.ARRAY_BUFFER,buffer)
 *
 *    创建buffer数据
 *
 *      var data = new Float32Array([……])
 *
 *    像buffer中添加数据
 *
 *      gl.bufferData(gl.ARRAT_BUFFER,data,gl.STATIC_DRAW)
 *
 *    关联apos
 *
 *      gl.vertexAttribPointer(aposlocation,2,gl.FLOAT,false,0,0)
 *
 *    激活apos
 *
 *      gl.enableVertexAttribArray(aposlocation);
 *
 *    绘制图形
 *
 *      gl.drawArrays(要绘制的形状，起始点，绘制数量);
 *----------------------------------------------------------------------------------------------------------------------
 *基础：
 *      gl.drawArrays中的第一个参数有以下几种形式
 *
 *            gl.POINTS 这个是画多个点的方法
 *
 *            gl.LINES  这个是每两个点绘制一条线段，
 *
 *            gl.LINE_STRIP 这个是在data中的的第一个元素是起点，最后一个值终点，中间的点依次链接，
 *
 *            gl.LINE_LOOP 跟LINE_STRIP这个类似，但是这个是最后将图形闭合，也就是将起点和终点链接起来，用来绘制闭合图形
 *
 *            gl.TRIANGLES 绘制三角形
 *
 *            gl.TRIANGLE_STRIP 绘制一个三角带
 *
 *            gl.TRIANGLE_FAN   绘制一个三角扇
 *
 *----------------------------------------------------------------------------------------------------------------------
 *图形变换：
 *
 *
 *    如果要平移和缩放图形需要先在着色器中定义一个变量，然后apos 加或乘这个变量，加是平移，乘是缩放
 *    然后获取到这个location
 *    再然后赋值
 *
 *      例如：
 *            var vertexShaderSource = "" +
 *                 "attribute vec4 apos;" +
 *                 "uniform float a;" +  // 这里是设置一个偏移值，代表的是放大的倍数，如果要移动图像，则是在.x 和 .y各定义一个变量然后获取
 *                 "void main(){" +
 *                    " gl_Position.x = apos.x * a;" +
 *                    " gl_Position.y = apos.y * a;" +
 *                    " gl_Position.z = 0.0;" +
 *                    " gl_Position.w = 1.0;" +
 *                 "}";
 *
 *
 *       声明：     "uniform float a;"
 *
 *       获取：     var alocation = gl.getUniformLocation(program,'a');
 *
 *                  var a = 2.0;  这里是放大两倍
 *
 *       赋值：     gl.uniform1f(alocation,a);   //通过这个方法，将变量的值放到着色器上，
 *
 *    图形的旋转   需要用到少许的数学知识
 *                x = r.cos(a)  y = r.sin(a) x1 = r.cos(a + b) y1 = r.sin(a + b) x1 = x.cos(b) - y.sin(b)
 *                y1 = x.sin(b) + y.cos(b)
 *
 *            旋转sin和cos计算公式
 *                var angle = 30; 旋转30度
 *                var t = Math.PI * angle / 180;
 *                var sinB = Math.sin(t);
 *                var cosB = Math.cos(t);
 *----------------------------------------------------------------------------------------------------------------------
 *矩阵变换：
 *
 *      矩阵 (平移矩阵)
 *
 *        | 1.0 0.0 0.0 TX  |
 *        | 0.0 1.0 0.0 TX  |
 *        | 0.0 0.0 1.0 0.0 |
 *        | 0.0 0.0 0.0 1.0 |
 *
 *
 *      矩阵 (缩放矩阵)
 *
 *        | Sx  0.0 0.0 0.0 |
 *        | 0.0 Sy  0.0 0.0 |
 *        | 0.0 0.0 Sz  0.0 |
 *        | 0.0 0.0 0.0 1.0 |
 *
 *
 *      矩阵 (旋转矩阵)
 *
 *        这个可以根据图形旋转的方程式来记忆   apos.x * cosB - apos.y * sinB
 *                                         apos.x * sinB + apos.y * cosB
 *
 *        | cosB  -sinB   0.0  0.0 |
 *        | sinB  cosB    0.0  0.0 |
 *        | 0.0   0.0     1.0  0.0 |
 *        | 0.0   0.0     0.0  1.0 |
 *----------------------------------------------------------------------------------------------------------------------
 *动画：
 *
 *    动画的原理是：将多个矩阵同时作用在同一元素上，比如，将平移和旋转矩阵同时作用在一个三角形上，则会出现边走边旋转的效果；
 *
 *    矩阵复合变换
 *
 *             function min(a,b){
 *
 *                var result = new Float32Array(16);//这里一定将小括号中的16写上，否则就会报错
 *
 *                for(var i = 0; i < 4;i ++){
 *
 *                   result[i] = a[i] * b[0] + a[i+4] * b[1] + a[i+8] * b[2] + a[i+12] * b[3];
 *                   result[i+4] = a[i] * b[4] + a[i+4] * b[5] + a[i+8] * b[6] + a[i+12] * b[7];
 *                   result[i+8] = a[i] * b[8] + a[i+4] * b[9] + a[i+8] * b[10] + a[i+12] * b[11];
 *                   result[i+12] = a[i] * b[12] + a[i+4] * b[13] + a[i+8] * b[14] + a[i+12] * b[15];
 *
 *                }
 *
 *                return result;
 *             }
 *
 *----------------------------------------------------------------------------------------------------------------------
 *
 *数据信息传入着色器技术
 *
 *      varying vec4 color;用varying定义的变量可以在顶点着色器和片元着色器中使用，然后用 color = apos来改变color的值，
 *
 *      在片元着色器中的实现是gl_FragColor = color;  然后用precision lowp float;设置精度
 *
 *    多数据传入顶点着色器
 *
 *      可以定义多个buffer，都绑定到着色器中，也可以用偏移量来实现
 *      用偏移量来实现
 *          定义bufferdata
 *              var data = new Float32Array([
                    0.0,0.0, 10.0,
                    0.5,0.5, 30.0,
                    0.2,0.2, 50.0
                ])
 *          然后在gl.vertexAttribPointer的时候定义偏移量是多少
 *          gl.vertexAttribPointer(aposlocation,2,gl.FLOAT,false,data.BYTES_PER_ELEMENT * 3,0); 第一个是定义位置的偏移量，
 *
 *            上边这行代码查找的是0.0，0.0 0.5，0.5，0.2，0.2这几个数值，因为每一行有3个数值，所以后边乘以3
 *
 *
 *          gl.vertexAttribPointer(sizeLocation,1,gl.FLOAT,false,data.BYTES_PER_ELEMENT * 3,data.BYTES_PER_ELEMENT * 2);
 *
 *            这里查找的是bufferdata种的10.0这个值   因为每个size值是在每行的第三个，需要跳过前两个值，所以最后一个参数乘以2
 *
 *----------------------------------------------------------------------------------------------------------------------
 *视点、目标点和上方向
 *
 *      视点：观察者所在的三维世界中的位置
 *      目标点：被观察的目标所在的位置
 *      上方向：相机的正上方的方向
 *
 *      指定视点观察图形：
 *
 *          旋转后定点坐标 = 旋转矩阵*原始顶点坐标
 *          旋转后定点坐标 = 试图矩阵 * 旋转后定点坐标
 *          旋转后定点坐标 = 视图矩阵*旋转矩阵* 原始定点坐标
 *          视图矩阵* 模型矩阵* 原始定点坐标
 *
 *      设置视点、目标点、上方向的时候几个辅助函数
 *
 *      //矩阵归一的函数
 *      function normalize(y){
 *        var sum = 0;
 *        for(var i = 0;i < y.length;i++){
 *           sum += y[i] * y[i];
 *        }
 *        var result = Math.sqrt(sum);
 *        for(var j = 0;j < y.length;j ++{
 *          y[i] = y[i] / result;
 *        }
 *      }
 *
 *
 *      //向量计算函数
 *      function cross(a,b){
 *        var x = a[1] * b[2] - a[2] * b[0];
 *        var y = a[2] * b[0] - a[0] * b[1];
 *        var z = a[0] 8 b[1] - a[1] * b[2];
 *        return new Float32Array([x,y,z]);
 *      }
 *
 *      //求点积函数
 *      function dot(a,b){
 *        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
 *      }
 *
 *
 *      //求差函数
 *      function minus(a,b){
 *        return new Float32Array([a[0] - b[0],a[1] - b[1],a[2] - b[2]])
 *      }
 *
 *      //这里是定义获取三个点的函数
 *      function geiVm(){
 *        var eye = new Float32Array([0.5,0.5,0.5]) 这里是定义一个视点在0.5 0.5 0.5的点
 *        var lookat = new Float32Array([0.0,0.0,0.0])这里是定义一个在原点的目标
 *        var up = new Float32Array([0,1,1]) 定义一个上方向
 *
 *        var za = minus(eye,lookat) 这里是用视点减去目标点获取z坐标
 *
 *        normalize(up)
 *        normalize(za)
 *
 *        var xa = cross(up,za);  通过up和za将x坐标得到
 *        var ya = cross(za,xa)   通过za和xa将y坐标得到
 *
 *          返回计算出的视图矩阵
 *
 *        return new Float32Array([
 *          xa[0],ya[0],za[0],0
 *          xa[1],ya[1],za[1],0
 *          xa[2],ya[2],za[2],0
 *          -dot(xa,eye),-dot(ya,eye),-dot(za,eye),1
 *        ])
 *      }
 *
 *
 *----------------------------------------------------------------------------------------------------------------------
 *
 *贴图  首先要了解图片的各种格式
 *
 *    jpg格式的图片  以24位的颜色存储位图，有损格式，，不能处理亮度，纯度，，优点是压缩比较好，减小文件的大小，是适合写实（相机拍照）的图片
 *
 *    gif 无损压缩格式 重要图片不多余256颜色，图片的体积比较小，只能显示256颜色，不适合写实写真图片，处理黑白照片性能是很好的
 *
 *    png文件，是代替gif的，支持透明，不支持动画，可移植性网络图片格式，压缩比例非常高，体积小，可以保证图片清晰度，lz77算法压缩，无损压缩格式
 *
 *
 *    1.准备图像，
 *    2.p配置图像映射方式
 *    3.加载图片
 *
 *    首先要准备图像，
 *        function load(url,cb){
 *          var img = new Image();
 *          img.src = url;
 *          img.onload = function(){
 *            cb(img);
 *          }
 *        }
 *    创建纹理
 *        load('url',function(img){
 *
 *          //创建一个texture
 *          var texture = gl.createTexture();
 *
 *          //然后反转Y坐标
 *          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
 *
 *          //然后激活texture   参数后边的0是指的激活哪一个texture 起始点是第0个，
 *          gl.activeTexture(gl.TEXTURE0)
 *
 *          //绑定texture
 *          gl.bindTexture(gl.TEXTURE_2D,texture);
 *
 *          //设置纹理参数
 *          gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR || gl.NEAREST这里的参数类型还有好多)
 *
 *          //设置展示方式xy轴  (这里需要注意的是，如果图片是2的幂倍数，则不用设置下边这两个值)
 *          gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
 *          gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 *
 *          //配置纹理图像
 *          gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);
 *
 *          //准备画图
 *          gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
 *        })
 *
 *----------------------------------------------------------------------------------------------------------------------
 *可视范围
 *
 *     长方体可视空间：盒状空间是由正射投影产生
 *     可视锥体空间： 由透视投影产生，比如树木远小近大的效果
 *
 *
 *     正射投影矩阵
 *        setOrtho(上，下，左，右，近，远)；
 *        setOrtho(top,bottom,left,right,near,far)；
 *
 *
 *
 *     正射投影矩阵方程式
 *
 *          |   2/right-left,           0,              0,       -(right + left) / (right - left)   |
 *          |          0        2/top - bottom,         0,       -(top + bottom) / (top - bottom)   |
 *          |          0,               0,         -2/far-near,  -(far + near) / (far - near)       |
 *          |          0,               0,              0,                      1                   |
 *
 *      通过创建正射投影矩阵，将矩阵和顶点坐标联系在一起，然后给出渲染空间，
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */