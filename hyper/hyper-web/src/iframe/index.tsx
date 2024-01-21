import React from "react";


/* 

- Populate IFrame Permissions Type
- Research Trusted Types: https://w3c.github.io/webappsec-trusted-types/dist/spec/
- Research SharedArrayBuffer: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer/Planned_changes
- Read: https://csp.withgoogle.com/docs/strict-csp.html
- Read: https://csp.withgoogle.com/docs/adopting-csp.html#refactor-inline-event-handlers-and-javascript-uris
- Implement Sub Resource Integrity, CORS
- Research Performance Options

*/


/* 

Notes on Content Security Policy:

- Every component has to explicitly define the dependencies it has
- The CSP is defined in the header and in the iframe
- Add a nonce attribute to all <script> elements.
- Refactor inline event handlers and javascript: URIs
- All resources fetched will implement sri checks. this is enforced with CSP "require-sri-for".

*/


/* 

Performance

- Component files are cached
- Components cannot form cyclic dependencies?
- Components should be dismounted if they cause a hangup?

*/


/* 

Notes On Sandboxing:

- When the embedded document has the same origin as the embedding page,
  it is strongly discouraged to use both allow-scripts and allow-same-origin,
  as that lets the embedded document remove the sandbox attribute — making it no more
  secure than not using the sandbox attribute at all.

- Sandboxing is useless if the attacker can display content outside a sandboxed iframe —
  such as if the viewer opens the frame in a new tab. Such content should be also served
  from a separate origin to limit potential damage.

*/

type SandboxPolicy =
  | "allow-downloads-without-user-activation" // Allows for downloads to occur without a gesture from the user.
  | "allow-downloads" // Allows for downloads to occur with a gesture from the user.
  | "allow-forms" // Allows the resource to submit forms. If this keyword is not used, form submission is blocked.
  | "allow-modals" // Lets the resource open modal windows.
  | "allow-orientation-lock" // Lets the resource lock the screen orientation.
  | "allow-pointer-lock" // Lets the resource use the Pointer Lock API.
  | "allow-popups-to-escape-sandbox" // Lets the sandboxed document open new windows without those windows inheriting the sandboxing. For example, this can safely sandbox an advertisement without forcing the same restrictions upon the page the ad links to.
  | "allow-popups" // Allows popups (such as window.open(), target="_blank", or showModalDialog()). If this keyword is not used, the popup will silently fail to open.
  | "allow-presentation" // Lets the resource start a presentation session.
  | "allow-same-origin" // If this token is not used, the resource is treated as being from a special origin that always fails the same-origin policy (potentially preventing access to data storage/cookies and some JavaScript APIs).
  | "allow-scripts" // Lets the resource run scripts (but not create popup windows).
  | "allow-storage-access-by-user-activation" // Lets the resource request access to the parent's storage capabilities with the Storage Access API.
  | "allow-top-navigation-by-user-activation" // Lets the resource navigate the top-level browsing context, but only if initiated by a user gesture.
  | "allow-top-navigation"; // Lets the resource navigate the top-level browsing context (the one named _top).



/* 

Notes On Permissions Policy:

- Permissions policy can be set in the iframe with "allow" or by the server.
- The 'src' origin is used in the iframe allow attribute only, and is the default allowlist value.
- This list restricts access to browser features for child iframes and applies to all descendants

Example Best Practice Permissions Policy:

`Feature-Policy: layout-animations 'none'; unoptimized-images 'none'; oversized-images 'none'; sync-script 'none'; sync-xhr 'none'; unsized-media 'none';`

 
*/

type Permission = 
  | "";

type PermissionScope = 
  | "*" // The feature will be allowed in this document, and all nested browsing contexts (iframes) regardless of their origin.
  | "self" // The feature will be allowed in this document, and in all nested browsing contexts (iframes) in the same origin.
  | "src" // 'src': (In an iframe allow attribute only) The feature will be allowed in this iframe, as long as the document loaded into it comes from the same origin as the URL in the iframe's src attribute.
  | "none"; // The feature is disabled in top-level and nested browsing contexts.

type PermissionScopeURL = string & { readonly brand: unique symbol }; // The feature is allowed for specific origins (for example, https://example.com). Origins should be separated by a space.

type PermissionsPolicy = [Permission, PermissionScope | PermissionScopeURL];

// type FeaturePolicy = PermissionsPolicy; // Old Name is FeaturePolicy

enum Loading {
  LAZY = "lazy",
  EAGER = "eager",
}

type Props = {
  src: string; // url
  name: string;
  title: string;
  height?: number;
  width?: number;
  loading?: Loading;
  sandboxPolicies?: SandboxPolicy[];
  permissionsPolicies?: PermissionsPolicy[];
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
};

export const IFrame = ({
  src,
  name,
  title,
  height,
  width,
  loading = Loading.LAZY,
  sandboxPolicies = [],
  permissionsPolicies = [],
  referrerPolicy = "strict-origin-when-cross-origin",
}: Props) => (
  <iframe
    src={src} // or srcdoc
    name={name} // to reference with a.target, for instance
    title={title} // for people navigating with assistive technology
    loading={loading}
    height={height}
    width={width}
    sandbox={sandboxPolicies.join(" ")} // unsupported in Internet Explorer <= 9
    allow={permissionsPolicies.map(policy => policy.join(" ")).join("; ").trim()}
    referrerPolicy={referrerPolicy} // Send a full URL when performing a same-origin request, only send the origin when the protocol security level stays the same (HTTPS→HTTPS), and send no header to a less secure destination (HTTPS→HTTP).
  ></iframe>
);