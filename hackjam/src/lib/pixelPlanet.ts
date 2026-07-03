/* Pixel-art planet engine ported verbatim from the "FOUR WORLDS" reference.
   Each Layer owns one WebGL2 context; a Planet composites its layers onto a
   2D canvas. Do not "improve" the GLSL — it is copied exactly. */

// ─── SHADERS ───────────────────────────────────────────────────────────────
const VERT = `#version 300 es
in vec2 a_pos;
out vec2 vUV;
void main(){vUV=a_pos*.5+.5;gl_Position=vec4(a_pos,0,1);}`;

// Shared helpers embedded in each frag
const H1 = `// rand tiling vec2(1,1)
float rand(vec2 co){co=mod(co,vec2(1)*round(u_size));return fract(sin(dot(co,vec2(12.9898,78.233)))*15.5453*u_seed);}`;
const H2 = `// rand tiling vec2(2,1) for land (planet has other side)
float rand(vec2 co){co=mod(co,vec2(2,1)*round(u_size));return fract(sin(dot(co,vec2(12.9898,78.233)))*15.5453*u_seed);}`;
const NOISE = `
float noise(vec2 co){
  vec2 i=floor(co),f=fract(co);
  float a=rand(i),b=rand(i+vec2(1,0)),c=rand(i+vec2(0,1)),d=rand(i+vec2(1,1));
  vec2 u=f*f*(3.-2.*f);
  return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
}
float fbm(vec2 co){float v=0.,s=.5;for(int i=0;i<8;i++){v+=noise(co)*s;co*=2.;s*=.5;}return v;}`;
const ROT = `
vec2 rot(vec2 co,float a){co-=.5;float c=cos(a),s=sin(a);co=vec2(c*co.x-s*co.y,s*co.x+c*co.y);return co+.5;}
vec2 sph(vec2 uv){vec2 c=uv*2.-1.;float z=sqrt(max(0.,1.-dot(c,c)));return c/(z+1.)*.5+.5;}`;

// ── PlanetUnder (ocean base, 3 colors, dithered borders) ──────────────────
const FRAG_OCEAN = `#version 300 es
precision highp float;
in vec2 vUV; out vec4 fragColor;
uniform float u_pixels,u_time_speed,u_dither_size,u_lb1,u_lb2,u_size,u_seed,u_time,u_rotation;
uniform vec2 u_light;uniform vec4 u_c0,u_c1,u_c2;
${H2}${NOISE}${ROT}
bool dith(vec2 a,vec2 b){return mod(a.x+b.y,2./u_pixels)<=1./u_pixels;}
void main(){
  vec2 uv=floor(vUV*u_pixels)/u_pixels;
  bool d=dith(uv,vUV);
  float dl=distance(uv,u_light),dc=distance(uv,vec2(.5));
  float a=step(dc,.49999);
  uv=sph(uv);uv=rot(uv,u_rotation);
  dl+=fbm(uv*u_size+vec2(u_time*u_time_speed,0))*.3;
  float db=(1./u_pixels)*u_dither_size;
  vec4 col=u_c0;
  if(dl>u_lb1){col=u_c1;if(dl<u_lb1+db&&(d||u_dither_size<.01))col=u_c0;}
  if(dl>u_lb2){col=u_c2;if(dl<u_lb2+db&&(d||u_dither_size<.01))col=u_c1;}
  fragColor=vec4(col.rgb,a*col.a);
}`;

// ── PlanetLandmass (land layer, 4 colors, alpha via land_cutoff) ──────────
const FRAG_LAND = `#version 300 es
precision highp float;
in vec2 vUV; out vec4 fragColor;
uniform float u_pixels,u_time_speed,u_lb1,u_lb2,u_land_cutoff,u_size,u_seed,u_time,u_rotation;
uniform vec2 u_light;uniform vec4 u_c0,u_c1,u_c2,u_c3;
${H2}${NOISE}${ROT}
void main(){
  vec2 uv=floor(vUV*u_pixels)/u_pixels;
  float dl=distance(uv,u_light),dc=distance(uv,vec2(.5));
  float a=step(dc,.49999);
  uv=rot(uv,u_rotation);uv=sph(uv);
  vec2 base=uv*u_size+vec2(u_time*u_time_speed,0);
  float f1=fbm(base),f2=fbm(base-u_light*f1),f3=fbm(base-u_light*1.5*f1),f4=fbm(base-u_light*2.*f1);
  if(dl<u_lb1)f4*=.9;
  if(dl>u_lb1){f2*=1.05;f3*=1.05;f4*=1.05;}
  if(dl>u_lb2){f2*=1.3;f3*=1.4;f4*=1.8;}
  dl=pow(dl,2.)*.1;
  vec4 col=u_c3;
  if(f4+dl<f1)col=u_c2;
  if(f3+dl<f1)col=u_c1;
  if(f2+dl<f1)col=u_c0;
  fragColor=vec4(col.rgb,step(u_land_cutoff,f1)*a*col.a);
}`;

// ── Clouds (same structure as GasPlanet) ─────────────────────────────────
const FRAG_CLOUDS = `#version 300 es
precision highp float;
in vec2 vUV; out vec4 fragColor;
uniform float u_pixels,u_time_speed,u_stretch,u_cloud_curve,u_cloud_cover,u_lb1,u_lb2,u_size,u_seed,u_time,u_rotation;
uniform vec2 u_light;uniform vec4 u_c0,u_c1,u_c2,u_c3;
${H1}${NOISE}${ROT}
float cNoise(vec2 uv){float uy=floor(uv.y);uv.x+=uy*.31;vec2 f=fract(uv);float h=rand(vec2(floor(uv.x),floor(uy)));float m=length(f-.25-h*.5);return smoothstep(0.,h*.25,m*.75);}
float cloudA(vec2 uv){float cn=0.;for(int i=0;i<9;i++)cn+=cNoise((uv*u_size*.3)+(float(i+1)+10.)+vec2(u_time*u_time_speed,0));return fbm(uv*u_size+cn+vec2(u_time*u_time_speed,0));}
void main(){
  vec2 uv=floor(vUV*u_pixels)/u_pixels;
  float dl=distance(uv,u_light);
  float a=step(length(uv-vec2(.5)),.49999);
  float dc=distance(uv,vec2(.5));
  uv=rot(uv,u_rotation);uv=sph(uv);
  uv.y+=smoothstep(0.,u_cloud_curve,abs(uv.x-.4));
  float c=cloudA(uv*vec2(1,u_stretch));
  vec4 col=u_c0;
  if(c<u_cloud_cover+.03)col=u_c1;
  if(dl+c*.2>u_lb1)col=u_c2;
  if(dl+c*.2>u_lb2)col=u_c3;
  c*=step(dc,.5);
  fragColor=vec4(col.rgb,step(u_cloud_cover,c)*a*col.a);
}`;

// ── NoAtmosphere (rocky surface, 3 colors, dithered) ─────────────────────
const FRAG_NOATM = `#version 300 es
precision highp float;
in vec2 vUV; out vec4 fragColor;
uniform float u_pixels,u_time_speed,u_dither_size,u_lb1,u_lb2,u_size,u_seed,u_time,u_rotation;
uniform vec2 u_light;uniform vec4 u_c0,u_c1,u_c2;
${H1}${NOISE}${ROT}
bool dith(vec2 a,vec2 b){return mod(a.x+b.y,2./u_pixels)<=1./u_pixels;}
void main(){
  vec2 uv=floor(vUV*u_pixels)/u_pixels;
  bool d=dith(uv,vUV);
  float dc=distance(uv,vec2(.5)),dl=distance(uv,u_light);
  float a=step(dc,.49999);
  uv=rot(uv,u_rotation);
  float f1=fbm(uv);
  dl+=fbm(uv*u_size+f1+vec2(u_time*u_time_speed,0))*.3;
  float db=(1./u_pixels)*u_dither_size;
  vec4 col=u_c0;
  if(dl>u_lb1){col=u_c1;if(dl<u_lb1+db&&d)col=u_c0;}
  if(dl>u_lb2){col=u_c2;if(dl<u_lb2+db&&d)col=u_c1;}
  fragColor=vec4(col.rgb,a*col.a);
}`;

// ── Craters ───────────────────────────────────────────────────────────────
const FRAG_CRATERS = `#version 300 es
precision highp float;
in vec2 vUV; out vec4 fragColor;
uniform float u_pixels,u_time_speed,u_light_border,u_size,u_seed,u_time,u_rotation;
uniform vec2 u_light;uniform vec4 u_c0,u_c1;
${H1}${ROT}
float cNoise(vec2 uv){float uy=floor(uv.y);uv.x+=uy*.31;vec2 f=fract(uv);float h=rand(vec2(floor(uv.x),floor(uy)));float m=length(f-.25-h*.5);float r=h*.25;return smoothstep(r-.1*r,r,m);}
float crater(vec2 uv){float c=1.;for(int i=0;i<2;i++)c*=cNoise((uv*u_size)+(float(i+1)+10.)+vec2(u_time*u_time_speed,0));return 1.-c;}
void main(){
  vec2 uv=floor(vUV*u_pixels)/u_pixels;
  float dc=distance(uv,vec2(.5)),dl=distance(uv,u_light);
  float a=step(dc,.49999);
  uv=rot(uv,u_rotation);uv=sph(uv);
  float c1=crater(uv),c2=crater(uv+(u_light-.5)*.03);
  vec4 col=u_c0;
  a*=step(.5,c1);
  if(c2<c1-(.5-dl)*2.)col=u_c1;
  if(dl>u_light_border)col=u_c1;
  a*=step(dc,.5);
  fragColor=vec4(col.rgb,a*col.a);
}`;

// ── LavaRivers ────────────────────────────────────────────────────────────
const FRAG_LAVA = `#version 300 es
precision highp float;
in vec2 vUV; out vec4 fragColor;
uniform float u_pixels,u_time_speed,u_lb1,u_lb2,u_river_cutoff,u_size,u_seed,u_time,u_rotation;
uniform vec2 u_light;uniform vec4 u_c0,u_c1,u_c2;
${H2}${NOISE}${ROT}
void main(){
  vec2 uv=floor(vUV*u_pixels)/u_pixels;
  float dl=distance(uv,u_light),dc=distance(uv,vec2(.5));
  float a=step(dc,.49999);
  uv=rot(uv,u_rotation);uv=sph(uv);
  float f1=fbm(uv*u_size+vec2(u_time*u_time_speed,0));
  float rf=fbm(uv+f1*2.5);
  dl=pow(dl,2.)*.4;dl-=dl*rf;
  rf=step(u_river_cutoff,rf);
  vec4 col=u_c0;
  if(dl>u_lb1)col=u_c1;
  if(dl>u_lb2)col=u_c2;
  a*=step(u_river_cutoff,rf);
  fragColor=vec4(col.rgb,a*col.a);
}`;

// ── GasPlanetLayers (banded gas giant, 3+3 colors) ────────────────────────
const FRAG_GAS = `#version 300 es
precision highp float;
in vec2 vUV; out vec4 fragColor;
uniform float u_pixels,u_time_speed,u_stretch,u_cloud_curve,u_cloud_cover,u_bands,u_lb1,u_lb2,u_size,u_seed,u_time,u_rotation;
uniform vec2 u_light;
uniform vec4 u_c0,u_c1,u_c2,u_d0,u_d1,u_d2;
${H1}${NOISE}${ROT}
float cNoise(vec2 uv){float uy=floor(uv.y);uv.x+=uy*.31;vec2 f=fract(uv);float h=rand(vec2(floor(uv.x),floor(uy)));return smoothstep(0.,h*.25,length(f-.25-h*.5)*.75);}
float turb(vec2 uv){float cn=0.;for(int i=0;i<10;i++)cn+=cNoise((uv*u_size*.3)+(float(i+1)+10.)+vec2(u_time*u_time_speed,0));return cn;}
bool dith(vec2 a,vec2 b){return mod(a.x+b.y,2./u_pixels)<=1./u_pixels;}
void main(){
  vec2 uv=floor(vUV*u_pixels)/u_pixels;
  float ld=distance(uv,u_light);
  bool d=dith(uv,vUV);
  float a=step(length(uv-vec2(.5)),.49999);
  uv=rot(uv,u_rotation);uv=sph(uv);
  float band=fbm(vec2(0,uv.y*u_size*u_bands));
  float tb=turb(uv);
  float f1=fbm(uv*u_size);
  float f2=fbm(uv*vec2(1,2)*u_size+f1+vec2(-u_time*u_time_speed,0)+tb);
  f2*=pow(band,2.)*7.;
  float light=f2+ld*1.8;
  f2+=pow(ld,1.)-.3;
  f2=smoothstep(-.2,4.-f2,light);
  if(d)f2*=1.1;
  float p=floor(f2*4.)/2.;
  vec4 col=vec4(0,0,0,1);
  if(f2<.625){
    float idx=p*2.;
    if(idx<.5)col=u_c0;else if(idx<1.5)col=u_c1;else col=u_c2;
  }else{
    float idx=(p-1.)*2.;
    if(idx<.5)col=u_d0;else if(idx<1.5)col=u_d1;else col=u_d2;
  }
  fragColor=vec4(col.rgb,a*col.a);
}`;

// ── Ring ─────────────────────────────────────────────────────────────────
const FRAG_RING = `#version 300 es
precision highp float;
in vec2 vUV; out vec4 fragColor;
uniform float u_pixels,u_time_speed,u_lb1,u_lb2,u_ring_width,u_ring_persp,u_scale_rel,u_size,u_seed,u_time,u_rotation;
uniform vec2 u_light;
uniform vec4 u_c0,u_c1,u_c2,u_d0,u_d1,u_d2;
${H1}${NOISE}${ROT}
void main(){
  vec2 uv=floor(vUV*u_pixels)/u_pixels;
  float ld=distance(uv,u_light);
  uv=rot(uv,u_rotation);
  vec2 uvc=uv-vec2(0,.5);
  uvc*=vec2(1,u_ring_persp);
  float cd=distance(uvc,vec2(.5,0));
  float ring=smoothstep(.5-u_ring_width*2.,.5-u_ring_width,cd);
  ring*=smoothstep(cd-u_ring_width,cd,.4);
  if(uv.y<.5)ring*=step(1./u_scale_rel,distance(uv,vec2(.5)));
  uvc=rot(uvc+vec2(0,.5),u_time*u_time_speed);
  ring*=fbm(uvc*u_size);
  float p=floor((ring+pow(ld,2.)*2.)*4.)/4.;
  p=min(p,2.);
  vec4 col;
  if(p<=1.){float idx=p*2.;if(idx<.5)col=u_c0;else if(idx<1.5)col=u_c1;else col=u_c2;}
  else{float idx=(p-1.)*2.;if(idx<.5)col=u_d0;else if(idx<1.5)col=u_d1;else col=u_d2;}
  fragColor=vec4(col.rgb,step(.28,ring)*col.a);
}`;

// ─── TYPES ─────────────────────────────────────────────────────────────────
export type UniformSetup = (
  gl: WebGL2RenderingContext,
  prog: WebGLProgram,
  layer: Layer,
) => void;

export interface LayerConfig {
  frag: string;
  setup: UniformSetup;
}

export interface PlanetStats {
  orbit: string;
  temp: string;
  radius: string;
  atm: string;
}

export interface PlanetDef {
  name: string;
  num: string;
  desc: string;
  stats: PlanetStats;
  layers: LayerConfig[];
}

// ─── PLANET LAYER (WebGL2 renderer) ────────────────────────────────────────
export class Layer {
  canvas: HTMLCanvasElement;
  uniformSetup: UniformSetup;
  time: number;
  rotation: number;
  spin: number;
  gl: WebGL2RenderingContext | null = null;
  prog: WebGLProgram | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    fragSrc: string,
    uniformSetup: UniformSetup,
    spin = 0.22,
  ) {
    this.canvas = canvas;
    this.uniformSetup = uniformSetup;
    this.spin = spin;
    this.time = Math.random() * 100;
    this.rotation = Math.random() * Math.PI * 2;

    const gl = canvas.getContext("webgl2");
    if (!gl) {
      console.error("WebGL2 not supported");
      return;
    }
    this.gl = gl;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
        console.error(gl.getShaderInfoLog(sh), src.slice(0, 200));
      return sh;
    };

    const prog = gl.createProgram()!;
    this.prog = prog;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
      console.error(gl.getProgramInfoLog(prog));

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(prog);
    uniformSetup(gl, prog, this);
  }

  u(name: string): WebGLUniformLocation | null {
    return this.gl && this.prog ? this.gl.getUniformLocation(this.prog, name) : null;
  }

  render(dt: number): void {
    const gl = this.gl;
    if (!gl || !this.prog) return;
    this.time += dt;
    this.rotation += dt * this.spin;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.prog);
    gl.uniform1f(this.u("u_time"), this.time);
    gl.uniform1f(this.u("u_rotation"), this.rotation);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  dispose(): void {
    this.gl?.getExtension("WEBGL_lose_context")?.loseContext();
    this.gl = null;
    this.prog = null;
  }
}

// ─── LAYERED PLANET (composites layers onto 2D canvas) ─────────────────────
export class Planet {
  comp: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  layers: Layer[];

  constructor(
    glCanvases: HTMLCanvasElement[],
    compositeCanvas: HTMLCanvasElement,
    layerConfigs: LayerConfig[],
    spin = 0.22,
  ) {
    this.comp = compositeCanvas;
    this.ctx = compositeCanvas.getContext("2d")!;
    this.layers = layerConfigs.map(
      (cfg, i) => new Layer(glCanvases[i], cfg.frag, cfg.setup, spin),
    );
  }

  render(dt: number): void {
    this.layers.forEach((l) => l.render(dt));
    const w = this.comp.width,
      h = this.comp.height;
    this.ctx.clearRect(0, 0, w, h);
    this.layers.forEach((l) => this.ctx.drawImage(l.canvas, 0, 0, w, h));
  }

  dispose(): void {
    this.layers.forEach((l) => l.dispose());
  }
}

// ─── UNIFORM HELPERS ───────────────────────────────────────────────────────
const U = {
  f: (gl: WebGL2RenderingContext, p: WebGLProgram, n: string, v: number) =>
    gl.uniform1f(gl.getUniformLocation(p, n), v),
  v2: (gl: WebGL2RenderingContext, p: WebGLProgram, n: string, v: number[]) =>
    gl.uniform2fv(gl.getUniformLocation(p, n), v),
  v4: (gl: WebGL2RenderingContext, p: WebGLProgram, n: string, v: number[]) =>
    gl.uniform4fv(gl.getUniformLocation(p, n), v),
};
function base(
  gl: WebGL2RenderingContext,
  p: WebGLProgram,
  pixels = 180,
  size = 50,
  seed = 2,
  ts = 0.08,
  light: number[] = [0.35, 0.35],
) {
  U.f(gl, p, "u_pixels", pixels);
  U.f(gl, p, "u_size", size);
  U.f(gl, p, "u_seed", seed);
  U.f(gl, p, "u_time_speed", ts);
  U.v2(gl, p, "u_light", light);
  U.f(gl, p, "u_time", 0);
  U.f(gl, p, "u_rotation", 0);
}

// ─── PLANET CONFIGS ────────────────────────────────────────────────────────
export const PLANET_DEFS: PlanetDef[] = [
  // 0: TERRAN – LandMasses (ocean + land + clouds)
  {
    name: "TERRAN",
    num: "PLANET 01",
    desc: "A LUSH WORLD OF VAST OCEANS AND VERDANT CONTINENTS, TERRAN ORBITS WITHIN THE HABITABLE ZONE OF ITS GOLDEN STAR.",
    stats: { orbit: "365 DAYS", temp: "+15 °C", radius: "6,371 KM", atm: "N₂ / O₂" },
    layers: [
      {
        frag: FRAG_OCEAN,
        setup(gl, p) {
          base(gl, p, 555, 50, 2.1, 0.0, [0.35, 0.35]);
          U.f(gl, p, "u_dither_size", 2);
          U.f(gl, p, "u_lb1", 0.4);
          U.f(gl, p, "u_lb2", 0.6);
          U.v4(gl, p, "u_c0", [0.1, 0.28, 0.58, 1]);
          U.v4(gl, p, "u_c1", [0.06, 0.18, 0.4, 1]);
          U.v4(gl, p, "u_c2", [0.02, 0.06, 0.18, 1]);
        },
      },
      {
        frag: FRAG_LAND,
        setup(gl, p) {
          base(gl, p, 555, 50, 2.1, 0.04, [0.35, 0.35]);
          U.f(gl, p, "u_lb1", 0.4);
          U.f(gl, p, "u_lb2", 0.52);
          U.f(gl, p, "u_land_cutoff", 0.44);
          U.v4(gl, p, "u_c0", [0.2, 0.5, 0.16, 1]);
          U.v4(gl, p, "u_c1", [0.14, 0.36, 0.1, 1]);
          U.v4(gl, p, "u_c2", [0.38, 0.3, 0.14, 1]);
          U.v4(gl, p, "u_c3", [0.22, 0.18, 0.08, 1]);
        },
      },
      {
        frag: FRAG_CLOUDS,
        setup(gl, p) {
          base(gl, p, 555, 50, 3.5, 0.09, [0.35, 0.35]);
          U.f(gl, p, "u_stretch", 1.8);
          U.f(gl, p, "u_cloud_curve", 1.3);
          U.f(gl, p, "u_cloud_cover", 0.46);
          U.f(gl, p, "u_lb1", 0.52);
          U.f(gl, p, "u_lb2", 0.64);
          U.v4(gl, p, "u_c0", [0.9, 0.94, 1.0, 1.0]);
          U.v4(gl, p, "u_c1", [0.72, 0.8, 0.92, 0.85]);
          U.v4(gl, p, "u_c2", [0.5, 0.6, 0.74, 0.55]);
          U.v4(gl, p, "u_c3", [0.2, 0.26, 0.38, 0.25]);
        },
      },
    ],
  },
  // 1: LUNAR – NoAtmosphere + Craters
  {
    name: "LUNAR",
    num: "PLANET 02",
    desc: "A BARREN WORLD OF ANCIENT IMPACT CRATERS AND FROZEN ROCK, LUNAR DRIFTS SILENTLY THROUGH THE VOID.",
    stats: { orbit: "27 DAYS", temp: "-53 °C", radius: "1,737 KM", atm: "NONE" },
    layers: [
      {
        frag: FRAG_NOATM,
        setup(gl, p) {
          base(gl, p, 540, 50, 4.2, 0.03, [0.38, 0.36]);
          U.f(gl, p, "u_dither_size", 2);
          U.f(gl, p, "u_lb1", 0.4);
          U.f(gl, p, "u_lb2", 0.62);
          U.v4(gl, p, "u_c0", [0.8, 0.77, 0.74, 1]);
          U.v4(gl, p, "u_c1", [0.52, 0.5, 0.46, 1]);
          U.v4(gl, p, "u_c2", [0.26, 0.24, 0.22, 1]);
        },
      },
      {
        frag: FRAG_CRATERS,
        setup(gl, p) {
          base(gl, p, 540, 50, 4.2, 0.0, [0.38, 0.36]);
          U.f(gl, p, "u_light_border", 0.46);
          U.v4(gl, p, "u_c0", [0.62, 0.58, 0.55, 1]);
          U.v4(gl, p, "u_c1", [0.3, 0.26, 0.22, 1]);
        },
      },
    ],
  },
  // 2: MAGMA – dark rock base + LavaWorld Rivers
  {
    name: "MAGMA",
    num: "PLANET 03",
    desc: "A SEETHING WORLD OF VOLCANIC ERUPTIONS AND RIVERS OF MOLTEN ROCK, MAGMA BURNS WITH RELENTLESS FURY.",
    stats: { orbit: "88 DAYS", temp: "+465 °C", radius: "6,051 KM", atm: "SO₂ / CO₂" },
    layers: [
      {
        frag: FRAG_NOATM,
        setup(gl, p) {
          base(gl, p, 525, 50, 1.8, 0.0, [0.36, 0.34]);
          U.f(gl, p, "u_dither_size", 1);
          U.f(gl, p, "u_lb1", 0.38);
          U.f(gl, p, "u_lb2", 0.56);
          U.v4(gl, p, "u_c0", [0.22, 0.1, 0.06, 1]);
          U.v4(gl, p, "u_c1", [0.12, 0.05, 0.02, 1]);
          U.v4(gl, p, "u_c2", [0.05, 0.02, 0.01, 1]);
        },
      },
      {
        frag: FRAG_LAVA,
        setup(gl, p) {
          base(gl, p, 525, 50, 1.8, 0.16, [0.36, 0.34]);
          U.f(gl, p, "u_lb1", 0.32);
          U.f(gl, p, "u_lb2", 0.5);
          U.f(gl, p, "u_river_cutoff", 0.32);
          U.v4(gl, p, "u_c0", [0.98, 0.42, 0.04, 1]);
          U.v4(gl, p, "u_c1", [0.72, 0.2, 0.02, 1]);
          U.v4(gl, p, "u_c2", [0.28, 0.07, 0.01, 1]);
        },
      },
    ],
  },
  // 3: RINGED – GasPlanetLayers + Ring
  {
    name: "RINGED",
    num: "PLANET 04",
    desc: "A COLOSSAL GAS GIANT ENCIRCLED BY SHIMMERING RINGS OF ICE AND DUST, RINGED REIGNS SUPREME OVER ITS SYSTEM.",
    stats: { orbit: "29 YEARS", temp: "-178 °C", radius: "58,232 KM", atm: "H₂ / He" },
    layers: [
      {
        frag: FRAG_GAS,
        setup(gl, p) {
          base(gl, p, 555, 50, 6.1, 0.09, [0.38, 0.33]);
          U.f(gl, p, "u_stretch", 2.2);
          U.f(gl, p, "u_cloud_curve", 1.3);
          U.f(gl, p, "u_cloud_cover", 0.1);
          U.f(gl, p, "u_bands", 1.1);
          U.f(gl, p, "u_lb1", 0.5);
          U.f(gl, p, "u_lb2", 0.65);
          U.v4(gl, p, "u_c0", [0.88, 0.78, 0.55, 1]);
          U.v4(gl, p, "u_c1", [0.75, 0.62, 0.4, 1]);
          U.v4(gl, p, "u_c2", [0.6, 0.48, 0.28, 1]);
          U.v4(gl, p, "u_d0", [0.4, 0.3, 0.16, 1]);
          U.v4(gl, p, "u_d1", [0.28, 0.2, 0.09, 1]);
          U.v4(gl, p, "u_d2", [0.15, 0.1, 0.04, 1]);
        },
      },
      {
        frag: FRAG_RING,
        setup(gl, p) {
          base(gl, p, 555, 50, 6.1, 0.06, [0.38, 0.33]);
          U.f(gl, p, "u_lb1", 0.5);
          U.f(gl, p, "u_lb2", 0.65);
          U.f(gl, p, "u_ring_width", 0.08);
          U.f(gl, p, "u_ring_persp", 3.5);
          U.f(gl, p, "u_scale_rel", 2.0);
          U.v4(gl, p, "u_c0", [0.9, 0.82, 0.62, 1]);
          U.v4(gl, p, "u_c1", [0.72, 0.62, 0.44, 1]);
          U.v4(gl, p, "u_c2", [0.52, 0.42, 0.28, 1]);
          U.v4(gl, p, "u_d0", [0.38, 0.28, 0.14, 1]);
          U.v4(gl, p, "u_d1", [0.24, 0.16, 0.06, 1]);
          U.v4(gl, p, "u_d2", [0.12, 0.08, 0.02, 1]);
        },
      },
    ],
  },
];
