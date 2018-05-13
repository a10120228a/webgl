/*
* three.js基础
*
*     浏览器支持程度
*         火狐    4.0
*         谷歌    9.0
*         Safari  5.1
*         IE   一直不支持，从11版本开始支持
*
*
*绘制三维对象----需要的组件
*   Plane     平面    二维矩形，渲染结果是在屏幕中央有个灰色矩形
*   Cube      方块    三维立方体
*   Sphere    球体    三维球体
*   Camera    相机    决定视点的位置，和最终观察结果
*   Axes      轴      辅助测试工具
*
*   思路,
*     首先创建一个场景
*       var scene = new THREE.Scene();
      创建一个相机
        var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
      创建一个渲染器
        var renderer = new THREE.WebGLRenderer();
      渲染器设置背景颜色
        renderer.setClearColor(new THREE.Color(0xcccccc));
      渲染器设置尺寸
        renderer.setSize(window.innerWidth,window.innerHeight);
      设置阴影可用
        renderer.shadowMapEnabled = true;
      创建平面的骨架
        var planeGeometry = new THREE.PlaneGeometry(20,20);
      创建平面的材质   (如果不设置灯光,则在对象参数中添加wireframe:true 以骨架显示)
        var planeMaterial = new THREE.MeshLambertMaterial({color:0xcccccc});
      创建平面
        var plane = new THREE.Mesh(planeGeometry,planeMaterial);
      平面阴影可用
        plane.receiveShadow = true;
      平面旋转
        plane.rotation.x = -.5 * Math.PI;
      平面偏移
        plane.position.x = 1;
        plane.position.y = 2;
        plane.position.z = 3;
      将平面添加到场景中
        scene.add(plane);

      创建一个球体骨架
        var sphereGeometry = new THREE.SphereGeometry(1,1,1);

        sphereGeometry.parameters.width   获取宽度
        sphereGeometry.parameters.height  获取高度
      创建球体的纹理
        var sphereMaterial = new THREE.MeshLambertMaterial({color:0x00ff00})
      创建一个球体
        var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
      球体阴影可用
        sphere.castShadow = true;
      球体偏移
        sphere.position.x = 2;
        sphere.position.y = 4;
        sphere.position.z = 5;
      将球体添加到场景中
        scene.add(sphere);
      相机设置
        camera.position.x = 10;
        camera.position.y = 20;
        camera.position.z = 30;
      创建一个观察点
        camera.lookAt(scene.position);


      创建灯光
        var spotLight = new THREE.SpotLight(0x00fff0);
      灯光设置聚焦点
        spotLight.position.set(10,20,10);
      灯光阴影可用
        spotLight.castShadow = true;
      将灯光添加到场景中
        scene.add(spotLight);
      将renderer获取到的DOMElement添加到html中
        document.body.appendChild(renderer.domElement);
      渲染场景
        renderer.render(scene,camera);

          requestAnimationFrame();可以用这个来制作动画
*
*
* =======================================================================================
*
*基本组件
*
*
*     场景:
*
*         相机：决定哪些东西将被显示在屏幕上
*         光源：生成阴影与改变物体表面显示的效果
*         物体：主要的渲染对象比如一个球，一个立方体
*
*       场景的方法：
*         scene.add()在场景中添加物体
*         scene.remove()在场景中移除物体
*         scene.getChildByName()获得场景中所有对象的列表
*
*       场景的属性；
*         fog               设置场景雾化
*         overrideMaterial  通过这个属性让场景中的所有物体都使用相同的材质
*         children          返回所有对象的列表，包括相机和光源对象
*
*         scene.fog = new THREE.Flog(颜色，x，y)；雾化处理；
*
*     几何和网格对象:
*
*          THREE.Geometry是所有对象的基类
*          THREE.Geometry.verties 表示几何体的顶点，是一个数组；
*          position 定义对象相对于父对象的位置
*          rotation  旋转
*          scale  suofang
*          translateX translateY  x,y的平移
*
*
*光源：
*
*      AmbientLight  环境光源   颜色会添加到所有物体表面  不会产生阴影
*      PointLight    点光源     不会产生阴影
*      SpotLight     聚光灯光源    会产生阴影  形状类似于手电筒  跟方向光是相同的
*      DirectionalLight  方向光
*      HemisphereLight  半球光  可以把天空光照和地面反射光计算在内
*      AreaLight    面光源
*      lensFlare   镜头炫光     使用炫光组件
*
*
*     一、 环境光
*
*      AmbientLight  环境光，没有特定的来源，不能产生阴影效果，不能单一出现。需要其他光源配合
*      如果想加入颜色，则使用three的color类
*      add(color)  添加颜色
*      clone()    克隆当前颜色
*
*     二、 点光源
*
*       照射所有方向的光源
*       不会产生阴影
*       单点发光的方式
*       color颜色
*       intensity强度
*       distance距离
*       position位置
*
*     三、 聚光光源
*       spotLight   最常用的光源，可以产生阴影
*
*
*       属性：  castshadow，设置成true会缠上阴影
*
*              target 决定光照的方向
*
*              angle  光照的角度
*
*     四、太阳的光源
*        它和平行光源的属性一样，常用的属性有castshadow   target   angle三种
*
*
*        不常用的属性有shadowCameravVisible  shadowDarkness shadowMapWidth shadowMapHeight等
*
*材质
*   材质的共有属性
*     id   用来识别材质的标识符
*     name  可以通过这个属性赋予材质名称
*     opacity 物体的透明度
*     transparent 是否透明
*     overdraw过度描绘，如果绘制出来的物体缝隙比较大，可以将这个属性设置为false；
*     visible 是否可见
*     needsupdata  是否刷新  在对某一材质变量修改后，通过这个来判断是否使用新的变量；
*
*
*
*   MeshBasicMaterial 不受光照影响。使用这种材质会被渲染成一个简单的多边形；
*
*       属性： color  颜色   wirwireframe是否显示线框，fog 是否雾化
*
*
*   深度材质   外观不由光照和材质决定
             外观是由和相机的距离决定
             需要与其他材质想组合
           属性
              wireframe   是否以线框绘制
              wireframeLineWidth  线框宽度

*   联合材质
*       three.sceneUtils.createMultiMaterialObject
*       联合多个材质，产生综合渲染效果；
*       这个方法在创建物体的时候使用
*       使用之前需要在普通材质上{color:'red',transparent:true,blending:THREE.MultiplyBlending}添加这几个属性；
*
*
*
*   MeshNormalMaterial  法向材质
*
*     法向量是yu与垂直面的向量
*     同样有wireframe   wireframeLineWidth的方法，，还有shading的方法
*
*
*几何体
*
*   二维几何体
*
*     planeGeometry   平面图形（矩形）
 *                    属性：
*                       width宽度
*                       height高度
*                       wSegments 宽度段数
*                       hSegments 高度段数
*
*     circleGeometry   圆形
*                     属性：
*                         radius 半径
*                         segments  所用面的数量
*                         start 起始位置
*                         length 结束位置  （后两个都是角度）
*
*
*   球面几何体
*
*     sphereGeometry   球体
*         属性： radius 半径
*               widthSegments 垂直方向上的段数
*               heightSegments 水平方向上的段数；（也就是创建的时候穿的 3个参数）；
*               phiStart    x轴的绘制起始位置
*               phiLength   x轴的结束位置
*               thetaStart  y轴的起始位置
*               thetaLength y轴的结束位置
*
*     CylinderGeometry    圆柱体
*         属性
*            radiusTop      顶部尺寸
*            radiusBottom   底部尺寸
*            height         高度
*            segmentsX      指定x轴分段数
*            segmentsY      指定y轴分段数
*            segmentsZ      指定z轴分段数
*            openEnded      指定网格顶部和底部是否封闭
*
*
*     TorusGeometry     车轮体（类似于一个轮胎）
*         属性：
*           radius 尺寸
*           tube   半径
*           radialSegments   长度分段数
*           tubularSegments  宽度分段数
*           arc 控制绘制的长度
*
*     TorusKnotGeometry   扭结体
*         属性：
*           radius 尺寸
*           tube   半径
*           radialSegments   长度分段数
*           tubularSegments  宽度分段数
*           detail  为环面增加额外的细节
*
*   多面几何体
*
*       PolyHedronGeometry      普通多面体
*       (这个是由自己定义顶点的)
*           属性：
*             vertices    顶点
*             faces       面
*             radius      半径
*             detail      添加细节
*
*       IcosahedronGeometry  正20面体
*       TetrahedronGeometry  正四面体
*       OctahedronGeometry   正八面体
*
*粒子：
*   粒子和粒子系统
*
*     THREE.Particle
*     创建粒子
*     使用webglrenderer 需要THREE.ParticleSystem配合
*
*   属性
*     color颜色  map材质  size大小
*
*   格式化粒子
*     在webgl中使用画布
*       只能使用particlebasicMaterial
*       用map属性加载纹理
*       imageUtils.loadTexture加载纹理
*
*       为map属性设置纹理
*       设置blending
*
*   精灵
*
      color 颜色
      map纹理
      blending 融合模式
      useScreenCoordinates 是否绝对定位

*
*
*相机和动画
*
*   firstPersonControls(camera) 第一人称控件
*   flyControls 飞行控件
*   RollControls 翻滚控件
*   TrackBallControls轨迹球控件
*   orbitControls轨迹控件
*   PathControls路径控件
*
*   使用控件的基本方法：
*     首先声明一个clock
*     var clock = new THREE.Clock();
*     然后添加控件
*     var controls = new THREE.FlyControls(camera);
*     在渲染的时候获取到时间
*     var d = clock.getDelta();
*     控件更新的时候加入d
*     controls.updata(d)
*
*   轨迹球控件
*       THREE.TrackballControles 创建轨迹球控件
*       属性：
*           rotateSpeed 转速
*           zoomSpeed 变焦速度
*           panSpeed 平移速度
*   飞行控件
*       THREE.flycontrols(camera) 创建
*       属性：
*           movementspeed  移动速度
*           rollspeed  转速
*           autoforward  是否自动前进
*   翻滚控件
    第一人称控件
        通过THREE.FirstPersonControls(camera)创建
        属性：
            movementSpeed移动速度
            noFly 非飞行模式
            lon/lat 定位相机位置
*
*
*three纹理
*
*     凹凸贴图创建皱纹
*       目的是为材质增加厚度
*       需要设置map和bumpmap属性
*       像素密度决定凹凸的密度
*
*     法向贴图创建皱纹
*       法向贴图中保存的是法向向量
*       很少的顶点和面就可创建丰富的模型
*       将normalMap 属性设置成一个纹理
*
*     光照贴图创建阴影
*       将材质的lightmap设置成所示的纹理
*       模拟真实的阴影
*       不会损害渲染性能
*
*     换将贴图创建反光效果
*       创建一个cubemap对象
*       创建一个带有这个对象的方块
*       将这个对象加入到场景中
*
*     高光贴图
*       为材质指定闪亮贴图
*       高光与法线贴图同事渲染
*       像素值越高表面越闪亮
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
* */