use super::{point::Point2, dimension::Dimension};

#[derive(Debug,Clone,PartialEq)]
pub struct Circle {
    pub center: Point2,
    pub radius: Dimension,
}

impl Circle {
    pub fn new(center: Point2, radius: Dimension) -> Self {
        Self { center, radius }
    }
    pub fn contains(&self, point: Point2) -> bool {
        let distance = ((point.x - self.center.x).powi(2) + (point.y - self.center.y).powi(2)).sqrt();
        distance <= self.radius
    }
}
