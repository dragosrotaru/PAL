mod control;
mod display;
mod domain;

#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

use wgpu::SurfaceError;

use winit::{
    dpi::LogicalSize,
    event::{Event, ModifiersState, VirtualKeyCode, WindowEvent},
    event_loop::{ControlFlow, EventLoop},
    window::WindowBuilder,
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

    let event_loop = EventLoop::new();
    let window = WindowBuilder::new()
        .with_inner_size(LogicalSize::new(800, 600))
        .with_title("Prophet")
        .build(&event_loop)
        .unwrap();

    #[cfg(target_arch = "wasm32")]
    {
        // Winit prevents sizing with CSS, so we have to set
        // the size manually when on web.
        use winit::dpi::PhysicalSize;
        window.set_inner_size(PhysicalSize::new(450, 400));

        use winit::platform::web::WindowExtWebSys;
        web_sys::window()
            .and_then(|win| win.document())
            .and_then(|doc| {
                let dst = doc.get_element_by_id("wasm-example")?;
                let canvas = web_sys::Element::from(window.canvas());
                dst.append_child(&canvas).ok()?;
                Some(())
            })
            .expect("Couldn't append canvas to document body.");
    }

    let mut render_service = RenderService::new(window).await;
    
    let text = String::from(
        "fn fibonacci(n: u32) -> u32 {
        fn fibonacci(n: u32) -> u32 {
            match n {🤠
                0 => 0,
                1 => 1,
                _ => fibonacci(n - 1) + fibonacci(n - 2),
            }
        }
    ",
    );

    // TODO render the scene
    render_service.update(&text);


    let mut keyboard_service = KeyboardService::new();

    // Exit on escape
    keyboard_service.set_key_action(VirtualKeyCode::Escape, ModifiersState::empty(), || {
        Some(ControlFlow::Exit)
    });
    // Copy on ctrl-c
    keyboard_service.set_key_action(VirtualKeyCode::C, ModifiersState::CTRL, || {
        println!("Copy");
        None
    });
    // Paste on ctrl-v
    keyboard_service.set_key_action(VirtualKeyCode::V, ModifiersState::CTRL, || {
        println!("Paste");
        None
    });
    // Cut on ctrl-x
    keyboard_service.set_key_action(VirtualKeyCode::X, ModifiersState::CTRL, || {
        println!("Cut");
        None
    });


    event_loop.run(move |event, _, control_flow| {
        match event {
            Event::WindowEvent {
                ref event,
                window_id,
            } if window_id == render_service.window.id() => {
                match event {
                    /* General Window Events */
                    WindowEvent::CloseRequested => {
                        println!("Window close requested");
                        // todo save and cleanup everything
                        *control_flow = ControlFlow::Exit
                    }
                    WindowEvent::Destroyed => {
                        // todo figure out when this is called
                        println!("Window destroyed");
                    }

                    WindowEvent::Resized(physical_size) => {
                        println!("Resized to {:?}", physical_size);
                        render_service.resize(*physical_size);
                    }
                    WindowEvent::ScaleFactorChanged { new_inner_size, .. } => {
                        println!("Scale factor changed");
                        // todo implement scale factor
                        render_service.resize(**new_inner_size);
                    }

                    WindowEvent::ThemeChanged(theme) => {
                        // todo implement theme
                        println!("Theme changed to {:?}", theme)
                    }

                    /* Focus Events */
                    WindowEvent::Occluded(bool) => {
                        // todo prevent rendering
                        println!("Window occlusion: {:?}", bool);
                    }
                    // unsure wht I can do with this
                    WindowEvent::Focused(focused) => {
                        // todo implement focus
                        println!("Window focused: {:?}", focused);
                    }

                    /* Mouse Events */
                    WindowEvent::CursorEntered { device_id } => {
                        // todo implement focus
                        println!("Cursor entered {:?}", device_id);
                    }
                    WindowEvent::CursorLeft { device_id } => {
                        // todo implement focus
                        println!("Cursor left {:?}", device_id);
                    }

                    WindowEvent::CursorMoved {
                        device_id,
                        position,
                        ..
                    } => {
                        println!("Cursor moved {:?} {:?}", device_id, position);
                    }
                    
                    WindowEvent::MouseInput {
                        device_id,
                        state,
                        button,
                        ..
                    } => {
                        println!("Mouse button {:?} {:?} {:?}", button, state, device_id);
                    }
                    WindowEvent::MouseWheel {
                        device_id,
                        delta,
                        phase,
                        ..
                    } => {
                        println!("Mouse wheel {:?} {:?} {:?}", device_id, delta, phase);
                    }

                    // Zoom gesture
                    WindowEvent::TouchpadMagnify { device_id, delta, phase } => {
                        println!("Touchpad magnify {:?} {:?} {:?}", device_id, delta, phase);
                    }

                    /* Keyboard Events */
                    // todo implement KeyboardService
                    WindowEvent::KeyboardInput {
                        device_id,
                        input,
                        is_synthetic,
                    } => {
                        println!(
                            "Keyboard input {:?} {:?} {:?}",
                            device_id, input, is_synthetic
                        );
                        if let Some(new_control_flow) =
                            keyboard_service.handle_keyboard_input(*input)
                        {
                            *control_flow = new_control_flow;
                        }
                    }
                    WindowEvent::ModifiersChanged(modifiers) => {
                        println!("Modifier: {:?}", modifiers);
                        return keyboard_service.handle_modifiers_changed(*modifiers);
                    }
                    WindowEvent::ReceivedCharacter(char) => {
                        println!("Received character {:?}", char);
                        return keyboard_service.handle_received_character(*char);
                    }
                    // todo implement internationalization
                    WindowEvent::Ime(ime) => println!("Ime event {:?}", ime),

                    /* File Drag n Drop */
                    // todo implement ImportService
                    WindowEvent::DroppedFile(path) => println!("File {:?} dropped:", path),
                    WindowEvent::HoveredFile(path) => println!("Hovering file {:?}", path),
                    WindowEvent::HoveredFileCancelled => println!("Hovered file cancelled"),

                    /* Other Events
                        - AxisMotion
                        - Moved
                        - SmartMagnify
                        - TouchPad Events
                        the touchpad events are interesting on Mac, they give you pressure and stage (the clicky bit)
                    */
                    _ => println!("Unhandled event {:?}", event),
                }
            }
            Event::RedrawRequested(window_id) if window_id == render_service.window.id() => {
                println!("Rendering");
                match render_service.render() {
                    Ok(_) => {}
                    Err(SurfaceError::Lost | SurfaceError::Outdated) => {
                        render_service.resize(render_service.size)
                    }
                    Err(SurfaceError::OutOfMemory) => *control_flow = ControlFlow::Exit,
                    Err(SurfaceError::Timeout) => log::warn!("Surface timeout"),
                }
            }
            _ => {}
        }
    });
}
