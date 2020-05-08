

//import * as THREE from 'three';
window.THREE = THREE;

//create image
// キャンバスの作成
var canvas = document.createElement( 'canvas' );
var context = canvas.getContext( '2d' );
// キャンバスサイズの設定
context.width = 512/2;
context.height = 256;
var click = true;
 

//context.beginPath();
//context.strokeStyle = '#FFFF00';
//context.lineWidth = 4.0;
//context.strokeRect(  0 ,  0 , 256 , 128 );
//context.stroke();
 
// 文字の描画開始
context.beginPath();
// 文字色指定
//context.fillStyle = '#DDA0DD';//ピンク
//context.fillStyle = '#006400';//緑
//context.fillStyle = '#33dd33';//緑
context.fillStyle = '#ffffff';
//context.fillStyle = 'white';
// フォントサイズとスタイルの定義
//context.font= '130px sans-serif';
//context.font= '100px monospace';
context.font = 'Bold 105px FixedSys';
//context.font = '105px FixedSys';
//context.font = "110px 'ＭＳ ゴシック'";
//context.font = "110px 'MS 明朝'";
//context.font = '115px MingLiU';
// 文字の表示位置指定
context.textAlign = 'center';
context.textBaseline = 'middle';
//context.textBaseline = 'top';
// 文字、文字の開始位置、最大幅
//context.fillText('あいうえお', 128, 64, 230);
//context.fillText('ABCDE', 128, 64, 230);
//context.fillText(' .   ;   +   =   o   d   p   8   $   W   @ ', 130, 64, 230);
context.fillText(' .   ;   +   =   o   d   p   8   $   W   @', 140, 64, 235);
context.fill();
 
// テクスチャの作成
var texture = new THREE.Texture( canvas );
// これをやらないとマテリアルは真っ暗
texture.needsUpdate = true;
texture.minFilter = THREE.NearestFilter;
texture.magFilter = THREE.NearestFilter;
const width = 1200/2.0;
const height = 700;
//var width = window.innerWidth/2.0;
//var height = window.innerHeight;
//import TPP from '../../src';

var x;
var y;
var x2 = 0.4;


class APP {
  constructor() {
    this.canvas = document.querySelector('#canvas');
      
      
    this.canvas.addEventListener("mousemove", function(e){
        var borderWidth = 1;
        var rect = e.target.getBoundingClientRect();
        x = e.clientX - rect.left - borderWidth;
        y = e.clientY - rect.top - borderWidth;
    //	document.getElementById("debug").innerHTML = `${x}:${y}`
        x2=(x/600)-0.5;
        console.log(x2);
    });
    this.canvas.addEventListener("click", (e) => {
        x2 = 3;
    });
      
      
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas
    });
    this.renderer.setSize(width, height);
    //this.renderer.setSize(800,450);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000,1);//背景色
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    //this.controls = new THREE.OrbitControls(this.camera);
    this.camera.position.set(0, 1.5, 180);
    this.camera.lookAt(0, 0, 0);
      
    //立方体
    //var geometry = new THREE.BoxGeometry(8, 8, 8);
    //ドーナツ型
    var geometry = new THREE.TorusGeometry( 5, 2, 16, 100 );
    //球
    //var geometry = new THREE.SphereGeometry( 5, 32, 32 );
      
    var loader = new THREE.TDSLoader();
    loader.load('model/lowpoly skull.3DS', object => {
        // 読み込み後に3D空間に追加
        object.position.set(55, 20, 0);
        object.rotation.x = 30;
        this.scene.add(object);
    });  
    
      
    var boxMat = new THREE.MeshNormalMaterial();
    this.box = new THREE.Mesh(geometry, boxMat);
//    this.scene.add(this.box);

    this.light = new THREE.DirectionalLight();
//    this.light.position.y = 100;
    this.light.position.y = 250;
    this.light.position.z = 200;
    this.scene.add(this.light);
      
      
    this.light = new THREE.DirectionalLight();
    this.light.position.y = 250;
    this.light.position.z = -500;
    this.scene.add(this.light);

    this.uniforms = {
      time:{
        value: 0
      },"resolution" : { type: "v2", value: new THREE.Vector2(window.innerWidth,window.innerHeight)},"uTex": { type: "t", value: texture}
        
    }

    let pp1 = {
      fragmentShader: document.getElementById( 'fragmentShader1' ).textContent,
      uniforms:this.uniforms
    };

    let pp2 = {
      fragmentShader: document.getElementById( 'fragmentShader2' ).textContent,
      uniforms:this.uniforms,
    }

    this.pp_params = [pp1,pp2];
    
    this.tpp = new TPP(this.renderer,this.pp_params);

    this.animate();
  }

  animate() {
//    this.box.rotateY(0.01);
//    this.scene.rotateY(0.007);
      if(x2<0){
         this.scene.rotateY(-0.007);
      }else if(x2<0.5){
          this.scene.rotateY(0.007);
      }else{
          this.scene.rotateY(0);
      }
    //this.controls.update();  

    //update post-processing-uniforms
    this.uniforms.time.value += 0.01;
    
    //render scene with post-processing
    this.tpp.render(this.scene,this.camera);

    requestAnimationFrame(this.animate.bind(this));
  }

}

window.addEventListener('load', () => {
  let app = new APP();
})