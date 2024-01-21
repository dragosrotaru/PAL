use super::{point::Point3};

#[derive(Debug,Clone,PartialEq)]
pub struct Prism {
    pub origin: Point3,
    pub opposite: Point3,
}