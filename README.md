jsc-shader
==========

Shader builder for javascript cas. I think that all of javascript-cas's GLSL related code should be moved here

## Usage

```js

var c = new M.Context();
c.x = M('x', c);
c.y = m('x^2', c);

var s = new M.Expression.Shader(shaderSource).inject({
  f: {
    arguments: [c.x],
    restrict: [t],
    type: 'f',
    value: c.y
  }
});

Types based on https://github.com/mrdoob/three.js/wiki/Uniforms-types

```

### Example shader source

```glsl
/* spec: webgl */
precision highp float;

uniform float t;
uniform vec3 colorDiffuse;
varying vec3 vCoord;

float f(float x, float y);

#import f(x,y)

void main() {
  gl_FragColor = vec4(colorDiffuse.rgb, f(vCoord.x, vCoord.y));
}
```