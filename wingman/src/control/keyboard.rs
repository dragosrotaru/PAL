use std::collections::HashMap;
use winit::{event::*, event_loop::ControlFlow};

type KeyAction = Box<dyn FnMut() -> Option<ControlFlow>>;

pub struct KeyboardService {
    key_actions: HashMap<(VirtualKeyCode, ModifiersState), KeyAction>,
    modifier_state: ModifiersState,
}

impl KeyboardService {
    pub fn new() -> Self {
        Self {
            key_actions: HashMap::new(),
            modifier_state: ModifiersState::empty(),
        }
    }

    pub fn set_key_action<F>(&mut self, key: VirtualKeyCode, modifiers: ModifiersState, action: F)
    where
        F: FnMut() -> Option<ControlFlow> + 'static,
    {
        self.key_actions.insert((key, modifiers), Box::new(action));
    }

    pub fn handle_keyboard_input(&mut self, input: KeyboardInput) -> Option<ControlFlow> {
        if input.state == ElementState::Pressed {
            if let Some(action) = self.key_actions.get_mut(&(
                input.virtual_keycode.unwrap_or(VirtualKeyCode::NoConvert),
                self.modifier_state,
            )) {
                return action();
            }
        }
        None
    }

    pub fn handle_modifiers_changed(&mut self, modifiers: ModifiersState) {
        self.modifier_state = modifiers;
    }

    pub fn handle_received_character(&self, char: char) {}
}
