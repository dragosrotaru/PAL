use super::dimension::Dimension;

#[derive(Debug,Clone,PartialEq)]
pub struct Point2 {
    pub x: Dimension,
    pub y: Dimension,
}

impl Point2 {
    pub fn new(x: Dimension, y: Dimension) -> Self {
        Self{x, y}
    }
    
}

#[derive(Debug,Clone,PartialEq)]
pub struct Point3 {
    pub x: Dimension,
    pub y: Dimension,
    pub z: Dimension,
}

impl Point3 {
    pub fn new(x: Dimension, y: Dimension, z: Dimension) -> Self {
        Self{x, y, z}
    }
    
}
