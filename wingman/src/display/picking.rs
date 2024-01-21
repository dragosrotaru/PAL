fn screen_to_ndc(mouse_pos: (f32, f32), screen_size: (f32, f32)) -> (f32, f32) {
    (
        2.0 * mouse_pos.0 / screen_size.0 - 1.0,
        1.0 - 2.0 * mouse_pos.1 / screen_size.1,
    )
}


fn ndc_to_world_ray(ndc_pos: (f32, f32), inv_view_proj_matrix: Matrix4<f32>) -> Ray {
    let near_point_ndc = Vector4::new(ndc_pos.0, ndc_pos.1, -1.0, 1.0);
    let far_point_ndc = Vector4::new(ndc_pos.0, ndc_pos.1, 1.0, 1.0);

    let near_point_world = inv_view_proj_matrix * near_point_ndc;
    let far_point_world = inv_view_proj_matrix * far_point_ndc;
    
    let near_point_world = near_point_world.xyz() / near_point_world.w;
    let far_point_world = far_point_world.xyz() / far_point_world.w;
    
    Ray {
        origin: near_point_world,
        direction: (far_point_world - near_point_world).normalize(),
    }
}    

/* 
In this code, `Matrix4<f32>` is a 4x4 matrix type (you can use a library like `nalgebra` for matrix operations), and `Ray` is a struct representing a ray with an origin and direction.

### 3. Intersection Test

For each object in your world, check if the ray intersects with it. This will depend on the shape of your objects.

For a simple example, here's how you might check intersection with a sphere:
 */

struct Sphere {
    center: Point3<f32>,
    radius: f32,
}

impl Sphere {
    fn intersects(&self, ray: &Ray) -> bool {
        let oc = ray.origin - self.center;
        let a = ray.direction.dot(&ray.direction);
        let b = 2.0 * oc.dot(&ray.direction);
        let c = oc.dot(&oc) - (self.radius * self.radius);
        let discriminant = b * b - 4.0 * a * c;
        discriminant > 0.0
    }
    fn intersect_distance(&self, ray: &Ray) -> Option<f32> {
        let oc = ray.origin - self.center;
        let a = ray.direction.dot(&ray.direction);
        let b = 2.0 * oc.dot(&ray.direction);
        let c = oc.dot(&oc) - (self.radius * self.radius);
        let discriminant = b * b - 4.0 * a * c;

        if discriminant < 0.0 {
            None
        } else {
            let t1 = (-b - discriminant.sqrt()) / (2.0 * a);
            let t2 = (-b + discriminant.sqrt()) / (2.0 * a);
            Some(t1.min(t2))
        }
    }
}

fn pick_object<'a>(ray: &Ray, objects: &'a [Sphere]) -> Option<&'a Sphere> {
    let mut closest_distance = f32::MAX;
    let mut closest_object = None;

    for object in &objects {
        if object.intersects(&ray) {
            if let Some(distance) = object.intersect_distance(&ray) {
                if distance < closest_distance && distance > 0.0 {
                    closest_distance = distance;
                    closest_object = Some(object);
                }
            }
        }
    }
}