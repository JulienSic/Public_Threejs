precision mediump float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float uTime;




void main() {
  vPosition = position;
  vNormal = normal;
  vUv = uv;

  vec4 modelViewPosition = modelViewMatrix * vec4( position, 1.0 );
  vec4 projectedPosition = projectionMatrix * modelViewPosition;
  gl_Position = projectedPosition;
}
