/**
 *
 *    gl.drawArrays中的第一个参数有以下几种形式
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
 *    如果要平移和缩放图形需要先在着色器中定义一个变量，然后apos 加或乘这个变量，加是平移，乘是缩放
 *    然后获取到这个location
 *    再然后赋值
 *
 *      例如：
 *            var vertexShaderSource = "" +
 *                 "attribute vec4 apos;" +
 *                  "uniform float a;" +
 *                 "void main(){" +
 *                     " gl_Position.x = apos.x * a;" +
 *                    " gl_Position.y = apos.y * a;" +
 *                    " gl_Position.z = 0.0;" +
 *                    " gl_Position.w = 1.0;" +
 *                    "}";
 *
 *            var alocation = gl.getUniformLocation(program,'a');
 *            var a = 2.0;  这里是放大两倍
 *            gl.uniform1f(alocation,a);
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