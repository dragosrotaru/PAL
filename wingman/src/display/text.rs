use glyphon::{
    Attrs, Buffer, Color, Family, FontSystem, Metrics, Resolution, Shaping, SwashCache, TextArea,
    TextAtlas, TextBounds, TextRenderer,
};

use wgpu::MultisampleState;

pub struct TextRenderService {
    pub renderer: TextRenderer,
    pub atlas: TextAtlas,
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

        // Set up text renderer
        // todo does not work in the browser
        /*
        As suggested in Git issues:
            let mut font_system = FontSystem::new_with_locale_and_db("en-US".into(), fontdb::Database::new());
            let font = include_bytes!("fonts/MyFont.ttf");
            font_system.db_mut().load_font_data(font);
             */
        let mut font_system = FontSystem::new();
        let cache = SwashCache::new();
        let mut atlas = TextAtlas::new(&device, &queue, texture_format);
        let renderer = TextRenderer::new(&mut atlas, &device, MultisampleState::default(), None);
        let mut buffer = Buffer::new(&mut font_system, Metrics::new(30.0, 42.0));

        buffer.set_size(&mut font_system, physical_width, physical_height);
        buffer.shape_until_scroll(&mut font_system);

        Self {
            renderer,
            atlas,
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
        self.renderer
            .prepare(
                &device,
                &queue,
                &mut self.font_system,
                &mut self.atlas,
                Resolution { width, height },
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
            Attrs::new().family(Family::Monospace),
            Shaping::Advanced,
        );
    }
}
