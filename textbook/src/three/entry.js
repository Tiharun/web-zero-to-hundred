// 3D 엔진 입구: 교재의 3D 그림이 쓰는 three.js 클래스만 다시 내보낸다(build.mjs bundleThree, window.WZH_THREE).
// 앱 번들(src/app)은 이 파일과 'three' 를 import 하지 않는다. 앱은 app/three.js 의 loadThree() 로 받는다.
export {
  BoxGeometry,
  Color,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineDashedMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
