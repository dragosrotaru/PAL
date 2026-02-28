use std::collections::HashMap;
use winit::{
    event::ElementState,
    keyboard::{Key, ModifiersState},
};

type KeyAction = Box<dyn FnMut() -> bool>;

pub struct KeyboardService {
    key_actions: HashMap<(String, ModifiersState), KeyAction>,
    modifier_state: ModifiersState,
}

impl KeyboardService {
    pub fn new() -> Self {
        Self {
            key_actions: HashMap::new(),
            modifier_state: ModifiersState::empty(),
        }
    }

    /// Register an action for a key + modifier combination.
    /// The key identifier is a string: for named keys use e.g. "Escape", for character keys use "c", "v", "x".
    /// The action returns true if the event loop should exit.
    pub fn set_key_action<F>(&mut self, key_id: &str, modifiers: ModifiersState, action: F)
    where
        F: FnMut() -> bool + 'static,
    {
        self.key_actions
            .insert((key_id.to_string(), modifiers), Box::new(action));
    }

    /// Returns true if the event loop should exit.
    pub fn handle_keyboard_input(&mut self, event: &winit::event::KeyEvent) -> bool {
        if event.state == ElementState::Pressed {
            let key_id = match &event.logical_key {
                Key::Named(named) => format!("{:?}", named),
                Key::Character(ch) => ch.to_string(),
                _ => return false,
            };
            if let Some(action) = self.key_actions.get_mut(&(key_id, self.modifier_state)) {
                return action();
            }
        }
        false
    }

    pub fn handle_modifiers_changed(&mut self, modifiers: winit::event::Modifiers) {
        self.modifier_state = modifiers.state();
    }

    pub fn handle_received_character(&self, _char: char) {}
}
