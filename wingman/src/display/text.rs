use glyphon::{
    Attrs, Buffer, Cache, Color, Family, FontSystem, Metrics, Resolution, Shaping, SwashCache,
    TextArea, TextAtlas, TextBounds, TextRenderer, Viewport,
};

use wgpu::MultisampleState;

pub struct TextRenderService {
    pub renderer: TextRenderer,
    pub atlas: TextAtlas,
    pub viewport: Viewport,
    cache: SwashCache,
    buffer: Buffer,
    font_system: FontSystem,
}

impl TextRenderService {
    pub fn new(
        device: &wgpu::Device,
        queue: &wgpu::Queue,
        window: &winit::window::Window,
        width: u32,
        height: u32,
        texture_format: wgpu::TextureFormat,
    ) -> Self {
        let scale_factor = window.scale_factor();
        let physical_width = (width as f64 * scale_factor) as f32;
        let physical_height = (height as f64 * scale_factor) as f32;

        let mut font_system = FontSystem::new();
        let cache = SwashCache::new();
        let glyph_cache = Cache::new(device);
        let viewport = Viewport::new(device, &glyph_cache);
        let mut atlas = TextAtlas::new(device, queue, &glyph_cache, texture_format);
        let renderer = TextRenderer::new(&mut atlas, device, MultisampleState::default(), None);
        let mut buffer = Buffer::new(&mut font_system, Metrics::new(30.0, 42.0));

        buffer.set_size(
            &mut font_system,
            Some(physical_width),
            Some(physical_height),
        );
        buffer.shape_until_scroll(&mut font_system, false);

        Self {
            renderer,
            atlas,
            viewport,
            cache,
            buffer,
            font_system,
        }
    }

    pub fn pre_render(
        &mut self,
        device: &wgpu::Device,
        queue: &wgpu::Queue,
        width: u32,
        height: u32,
    ) {
        self.viewport
            .update(queue, Resolution { width, height });

        self.renderer
            .prepare(
                device,
                queue,
                &mut self.font_system,
                &mut self.atlas,
                &self.viewport,
                [TextArea {
                    buffer: &self.buffer,
                    left: 10.0,
                    top: 10.0,
                    scale: 1.0,
                    bounds: TextBounds {
                        left: 0,
                        top: 0,
                        right: width as i32,
                        bottom: height as i32,
                    },
                    default_color: Color::rgb(255, 255, 255),
                    custom_glyphs: &[],
                }],
                &mut self.cache,
            )
            .unwrap();
    }

    /** Updates the text buffer with the given text. */
    pub fn update(&mut self, text: &str) {
        self.buffer.set_text(
            &mut self.font_system,
            text,
            &Attrs::new().family(Family::Monospace),
            Shaping::Advanced,
            None,
        );
    }
}
