'use strict';

if (typeof M === 'undefined') {
  var M = require('javascript-cas');
}

/*

E.g.

var s = new M.Expression.Shader(source).inject({
  f: {
    arguments: [glob.x],
    restrict: [glob.t],
    type: 'f',
    value: M('x^2')
  }
});

Types based on https://github.com/mrdoob/three.js/wiki/Uniforms-types

*/

var types = {
  'f': 'float',
  'i': 'int',
  'v2': 'vec2',
  'v3': 'vec3',
  'v4': 'vec4',
  'c': 'vec3',
  'm4': 'mat4',
  // 't': 'sampler2D',
  // 't': 'samplerCube',
  'iv1': 'int',
  'iv': 'ivec3',
  'fv1': 'float',
  'fv': 'vec3',
  'v2v': 'vec2',
  'v3v': 'vec3',
  'v4v': 'vec4',
  'm4v': 'mat4',
  'tv': 'sampler2D'
};

M.Expression.Shader = module.exports = Shader;

function Shader(src) {
  this.src = src;
}

Shader.prototype.sourceWith = function (vars) {
  var symbol_dummy = 0;
  function symbolify(arg) {
    var t = type(arg);
    var n;
    if (arg && arg.symbol) {
      n = arg.symbol;
    } else {
      n = '_discard_' + (symbol_dummy++).toString(16);
    }
    return t + ' ' + n;
  }
  function type(expr) {
    if (expr instanceof M.Expression.Vector) {
      return 'vec' + expr.length;
    }
    return 'float';
  }
  var p = '';
  var pre = '';
  var i;
  for (i in vars) {
    if (vars.hasOwnProperty(i)) {
      var k = vars[i];

      if (i === 'define') {
        for(var d in k) {
          if (k[d]) {
            pre += '#define ' + d + '\n';
          }
        }
        continue;
      }

      var calc = k.value.s('x-shader/x-fragment');
      var defn = type(k.value) + ' ' + i;

      if (k.arguments) {
        // function
        defn += '(';

        defn += k.arguments.map(symbolify).join(',');

        defn += ') {';
        defn += calc.pre.join('\n');
        defn += '\n\treturn ' + calc.s + ';';
        defn += '\n}';

      } else {
        defn += ' = ';
        // defn +=
        defn += ';';
      }

      p += defn;
    }
  }

  return pre + '\n' + this.src.replace(/#import.+\n/, p);
};


