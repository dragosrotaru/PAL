use winit::event::{MouseButton, ElementState};

use crate::display::geometry::point::Point2;

pub struct MouseService {
    pub position: Point2,
    pub left: bool,
    pub right: bool,
    pub middle: bool,
}

impl MouseService {
    pub fn new() -> Self {
        Self {
            position: Point2::new(0.0, 0.0),
            left: false,
            right: false,
            middle: false,
        }
    }
    pub fn update_position(&mut self, position: Point2) {
        self.position = position;
    }
    pub fn handle_mouse_input(&mut self, button: MouseButton, state: ElementState) {
        match button {
            winit::event::MouseButton::Left => {
                self.left = state == ElementState::Pressed;
            }
            winit::event::MouseButton::Right => {
                self.right = state == ElementState::Pressed;
            }
            winit::event::MouseButton::Middle => {
                self.middle = state == ElementState::Pressed;
            }
            _ => {}
        }
    }
}
