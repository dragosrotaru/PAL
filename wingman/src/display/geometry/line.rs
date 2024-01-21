use super::point::Point2;

#[derive(Debug,Clone,PartialEq)]
pub struct Line {
    pub start: Point2,
    pub end: Point2,
}

impl Line {
    pub fn new(start: Point2, end: Point2) -> Self {
        Self{start, end}
    }
}
