# Design Notes

There are many ways to structure the program. Many perspectives to consider.

## Things we definitely want to render

- 2D vector graphics
- text
- svg
- latex, markdown
- png,jpeg,gif,video
- 3D models

We could also render pdfs and web content, but that incurs a significant overhead to our bundle size.
I think it is a more sane strategy to open that content in the user's prefered
browser / pdf reader than to include it in our bundle. Especially since one of our build targets is the
web platform.

We can include a lightweight preview rendering lib for html and pdfs, or our own subset which is more sane.

On top of this, we have our own data formats with their own particular rendering styles - CSV, Code Files, etc,
some MDX type format.

We can now consider each of these objects, and how they stack up in our Display system and rendering pipeline.

The first thing is Models.
Models can be instantiated to produce Objects.
Models have their own Model Space.
Models are instantiated in World Space.
A World keeps track of instances and their relation to each other
The World basis is then transformed to go to into View Space
View Space has the Camera at the origin
This is then transformed again by Projection taking into acount the point of view,
into Clip Space followed by normalized device space (NDC) then screen space

The High level api of this is going to be user friendly.
when it comes time to perform transformations, these Entities need
to be turned into highly efficient gpu-friendly buffer representations.

Every Object needs to be tesallated and triangulated, then rasterised.

It is best to perform compute on these objects before they are triangulated.

We also need a reverse process for picking (mouse interactivity)


The best way to do everything is to compute it all on Compute Shaders.
i can write a special shader for picking which can operate more frequency
and reuse cached buffers when the rendering pipeline isn't being triggered.

# Geometry

I can define the geometries without having a reference point to some underlying coordinate system.

If I were to build a World Space, then the 2D geometries as I defined them would be limited in terms
of orientation, because they are assumed to have a Z of zero. I can assume that the placement is on a
predefined plane within the space. 

Then they must exist on a plane.

The other thing is, which Primitive do you choose? In HTML Circle does not exist. instead you define
circle based on the radius of a rectangle. then you dont have to define an elliptoid

## Links

### parallelization
https://www.nickwilcox.com/blog/autovec/
https://doc.rust-lang.org/std/simd/index.html - simd stdlib
https://crates.io/crates/wide - intrinsics
https://github.com/rayon-rs/rayon - parallelization library
https://crates.io/crates/ultraviolet - used by rayn for SIMD

### 2D Renderers
https://github.com/bodoni/svg - svg parser
https://github.com/google/forma - vector graphics renderer
https://github.com/RazrFalcon/resvg - svg renderer + everything else
https://github.com/linebender/vello - 2d rendering lib
https://github.com/servo/pathfinder - fonts and vector graphics
https://fuchsia.googlesource.com/fuchsia/+/refs/heads/master/src/graphics/lib/compute/spinel/ -  Spinel Vulkan

### Renderers
https://github.com/fu5ha/rayn - raytracer
https://github.com/linebender/xilem/ - ui lib uses vello
https://github.com/servo/servo - browser engine

## Performance


We will want to implement high efficiency algorithms and data structures, leveraging the hardware
capabilities at our disposal. These include WebGPU, but also Auto-vectorization, SIMD/NEON and Intrinsics
When possible. Well, I dont know what Im talking about, we need to see if its worth it. If the support is
lacking in WASM or across various platforms perhaps its best to focus on highly optimised WebGPU code only.




/* 
This is the UI model space. We have to choose how we will represent our Objects

Camera movement:
    - translate left, right, up, down
    - zoom in/out
Object movement:
    - translate x/y
    - scale up, down
    - rotate left, right, up, down

The camera can be zoomed into something but it cant go further than the object,
which brings up the question of how to handle the camera's position and zoom level
in relation to the object's position and scale.


For now, lets focus on 2D objects and a 2D camera. We can add 3D later.
*/
