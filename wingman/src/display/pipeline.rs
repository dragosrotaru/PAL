use wgpu::{
    vertex_attr_array, BindGroup, BindGroupDescriptor, BindGroupLayoutDescriptor,
    BufferAddress, ColorTargetState, Device, FragmentState, FrontFace, MultisampleState,
    PipelineCompilationOptions, PipelineLayoutDescriptor, PolygonMode, PrimitiveState,
    PrimitiveTopology, RenderPipeline, RenderPipelineDescriptor, ShaderModuleDescriptor,
    ShaderSource, TextureFormat, VertexBufferLayout, VertexState, VertexStepMode,
};

use super::geometry::vertex::Vertex;

pub struct Pipeline {
    pub pipeline: RenderPipeline,
    pub bind_group: BindGroup,
}

impl Pipeline {
    pub fn new(device: &Device, format: TextureFormat) -> Self {
        let shader_code = include_str!("render.wgsl");
        let shader = device.create_shader_module(ShaderModuleDescriptor {
            label: Some("Render Shader"),
            source: ShaderSource::Wgsl(shader_code.into()),
        });

        let bind_group_layout = device.create_bind_group_layout(&BindGroupLayoutDescriptor {
            label: Some("Render Bind Group Layout"),
            entries: &[], // none needed for now
        });

        let bind_group = device.create_bind_group(&BindGroupDescriptor {
            label: Some("Render Bind Group"),
            layout: &bind_group_layout,
            entries: &[], // none needed for now
        });

        let p_layout = device.create_pipeline_layout(&PipelineLayoutDescriptor {
            label: Some("Render Pipeline Layout"),
            bind_group_layouts: &[&bind_group_layout],
            immediate_size: 0,
        });

        let vertex_buffer_layout = VertexBufferLayout {
            array_stride: std::mem::size_of::<Vertex>() as BufferAddress,
            step_mode: VertexStepMode::Vertex,
            attributes: &vertex_attr_array![0 => Float32x2],
        };

        let pipeline = device.create_render_pipeline(&RenderPipelineDescriptor {
            label: Some("Render Pipeline"),
            layout: Some(&p_layout),
            vertex: VertexState {
                module: &shader,
                entry_point: Some("vs_main"),
                buffers: &[vertex_buffer_layout],
                compilation_options: PipelineCompilationOptions::default(),
            },
            fragment: Some(FragmentState {
                module: &shader,
                entry_point: Some("fs_main"),
                targets: &[Some(ColorTargetState {
                    format,
                    blend: None,
                    write_mask: Default::default(),
                })],
                compilation_options: PipelineCompilationOptions::default(),
            }),
            multiview_mask: None,
            primitive: PrimitiveState {
                topology: PrimitiveTopology::TriangleList,
                strip_index_format: None,
                front_face: FrontFace::Ccw,
                cull_mode: None,
                polygon_mode: PolygonMode::Fill,
                unclipped_depth: false,
                conservative: false,
            },
            depth_stencil: None,
            multisample: MultisampleState {
                count: 1,
                mask: !0,
                alpha_to_coverage_enabled: false,
            },
            cache: None,
        });

        Self {
            pipeline,
            bind_group,
        }
    }
}
