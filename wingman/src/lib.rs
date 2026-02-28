//! Prophet: a WebGPU-based text editor / IDE runtime built with wgpu + winit.
//! Builds for native (cargo run) and WASM (wasm-pack --target web).
//! Modules: control (keyboard/mouse), display (render pipeline, geometry, text), domain (AST).
//! @author claude

mod control;
mod display;
mod domain;

#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

use std::sync::Arc;

use wgpu::SurfaceError;

use winit::{
    dpi::LogicalSize,
    event::WindowEvent,
    event_loop::{ControlFlow, EventLoop},
    keyboard::ModifiersState,
    window::Window,
};

use crate::control::keyboard::KeyboardService;
use crate::display::render::RenderService;

#[cfg_attr(target_arch = "wasm32", wasm_bindgen(start))]
pub async fn run() {
    cfg_if::cfg_if! {
        if #[cfg(target_arch = "wasm32")] {
            std::panic::set_hook(Box::new(console_error_panic_hook::hook));
            console_log::init_with_level(log::Level::Warn).expect("Couldn't initialize logger");
        } else {
            env_logger::init();
        }
    }

    let event_loop = EventLoop::builder().build().unwrap();
    event_loop.set_control_flow(ControlFlow::Poll);

    let window = Arc::new(
        event_loop
            .create_window(
                Window::default_attributes()
                    .with_inner_size(LogicalSize::new(800, 600))
                    .with_title("Prophet"),
            )
            .unwrap(),
    );

    #[cfg(target_arch = "wasm32")]
    {
        use winit::dpi::PhysicalSize;
        let _ = window.request_inner_size(PhysicalSize::new(450, 400));

        use winit::platform::web::WindowExtWebSys;
        web_sys::window()
            .and_then(|win| win.document())
            .and_then(|doc| {
                let dst = doc.get_element_by_id("wasm-example")?;
                let canvas = web_sys::Element::from(window.canvas().unwrap());
                dst.append_child(&canvas).ok()?;
                Some(())
            })
            .expect("Couldn't append canvas to document body.");
    }

    let mut render_service = RenderService::new(window.clone()).await;

    let text = String::from(
        "fn fibonacci(n: u32) -> u32 {
    fn fibonacci(n: u32) -> u32 {
        match n {
            0 => 0,
            1 => 1,
            _ => fibonacci(n - 1) + fibonacci(n - 2),
        }
    }
",
    );

    render_service.update(&text);

    let mut keyboard_service = KeyboardService::new();

    // Exit on Escape
    keyboard_service.set_key_action("Escape", ModifiersState::empty(), || true);

    // Copy on ctrl-c
    keyboard_service.set_key_action("c", ModifiersState::CONTROL, || {
        println!("Copy");
        false
    });
    // Paste on ctrl-v
    keyboard_service.set_key_action("v", ModifiersState::CONTROL, || {
        println!("Paste");
        false
    });
    // Cut on ctrl-x
    keyboard_service.set_key_action("x", ModifiersState::CONTROL, || {
        println!("Cut");
        false
    });

    let window_id = window.id();

    event_loop
        .run(move |event, elwt| {
            match event {
                winit::event::Event::WindowEvent {
                    ref event,
                    window_id: wid,
                } if wid == window_id => {
                    match event {
                        /* General Window Events */
                        WindowEvent::CloseRequested => {
                            println!("Window close requested");
                            elwt.exit();
                        }
                        WindowEvent::Destroyed => {
                            println!("Window destroyed");
                        }

                        WindowEvent::Resized(physical_size) => {
                            println!("Resized to {:?}", physical_size);
                            render_service.resize(*physical_size);
                        }
                        WindowEvent::ScaleFactorChanged { scale_factor, .. } => {
                            println!("Scale factor changed to {:?}", scale_factor);
                            // Request redraw on scale change
                            render_service.window.request_redraw();
                        }

                        WindowEvent::ThemeChanged(theme) => {
                            println!("Theme changed to {:?}", theme)
                        }

                        /* Focus Events */
                        WindowEvent::Occluded(occluded) => {
                            println!("Window occlusion: {:?}", occluded);
                        }
                        WindowEvent::Focused(focused) => {
                            println!("Window focused: {:?}", focused);
                        }

                        /* Mouse Events */
                        WindowEvent::CursorEntered { device_id } => {
                            println!("Cursor entered {:?}", device_id);
                        }
                        WindowEvent::CursorLeft { device_id } => {
                            println!("Cursor left {:?}", device_id);
                        }

                        WindowEvent::CursorMoved {
                            device_id,
                            position,
                        } => {
                            println!("Cursor moved {:?} {:?}", device_id, position);
                        }

                        WindowEvent::MouseInput {
                            device_id,
                            state,
                            button,
                        } => {
                            println!("Mouse button {:?} {:?} {:?}", button, state, device_id);
                        }
                        WindowEvent::MouseWheel {
                            device_id,
                            delta,
                            phase,
                        } => {
                            println!("Mouse wheel {:?} {:?} {:?}", device_id, delta, phase);
                        }

                        /* Keyboard Events */
                        WindowEvent::KeyboardInput {
                            device_id,
                            event,
                            is_synthetic,
                        } => {
                            println!(
                                "Keyboard input {:?} {:?} {:?}",
                                device_id, event, is_synthetic
                            );
                            if keyboard_service.handle_keyboard_input(event) {
                                elwt.exit();
                            }
                        }
                        WindowEvent::ModifiersChanged(modifiers) => {
                            println!("Modifier: {:?}", modifiers);
                            keyboard_service.handle_modifiers_changed(*modifiers);
                        }

                        // todo implement internationalization
                        WindowEvent::Ime(ime) => println!("Ime event {:?}", ime),

                        /* File Drag n Drop */
                        WindowEvent::DroppedFile(path) => {
                            println!("File {:?} dropped:", path)
                        }
                        WindowEvent::HoveredFile(path) => {
                            println!("Hovering file {:?}", path)
                        }
                        WindowEvent::HoveredFileCancelled => {
                            println!("Hovered file cancelled")
                        }

                        /* Redraw */
                        WindowEvent::RedrawRequested => {
                            println!("Rendering");
                            match render_service.render() {
                                Ok(_) => {}
                                Err(SurfaceError::Lost | SurfaceError::Outdated) => {
                                    render_service.resize(render_service.size)
                                }
                                Err(SurfaceError::OutOfMemory) => elwt.exit(),
                                Err(SurfaceError::Timeout) => log::warn!("Surface timeout"),
                                Err(e) => log::warn!("Render error: {:?}", e),
                            }
                        }

                        _ => {}
                    }
                }
                _ => {}
            }
        })
        .unwrap();
}
