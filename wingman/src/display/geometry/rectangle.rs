use super::{point::Point2, vertex::Vertex};

#[derive(Debug,Clone,PartialEq)]
pub struct Rectangle {
    pub top_left: Point2,
    pub bottom_right: Point2,
}

impl Rectangle {
    pub fn new(top_left: Point2, bottom_right: Point2) -> Self {
        Self {
            top_left,
            bottom_right,
        }
    }
    pub fn contains(&self, point: Point2) -> bool {
        self.top_left.x <= point.x
            && self.top_left.y <= point.y
            && self.bottom_right.x >= point.x
            && self.bottom_right.y >= point.y
    }
    pub fn to_vertices(&self) -> [Vertex; 6] {
        [
            Vertex { position: [self.top_left.x, self.top_left.y] },
            Vertex { position: [self.bottom_right.x, self.top_left.y] },
            Vertex { position: [self.top_left.x, self.bottom_right.y] },
            Vertex { position: [self.bottom_right.x, self.top_left.y] },
            Vertex { position: [self.bottom_right.x, self.bottom_right.y] },
            Vertex { position: [self.top_left.x, self.bottom_right.y] },
        ]
    }
}