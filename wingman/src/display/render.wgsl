// Vertex shader for drawing rectangles

struct VertexInput {
    @location(0) position: vec2<f32>,
};

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
};

@vertex
fn vs_main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    // Transform the position to NDC (assuming it's already in NDC)
    output.position = vec4(input.position, 0.0, 1.0);
    return output;
}

@fragment
fn fs_main() -> @location(0) vec4f {
   return vec4f(1.0, 0.0, 0.0, 1.0); // Output red color
}