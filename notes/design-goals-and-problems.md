---
date: 2024-01-21
tags: [web-vision, design-goals, decentralization, privacy, accessibility, ui, changetheweb]
summary: The original design goals and problem statement for changetheweb.xyz. Eight goals: complete decentralization, information integrity, ownership/privacy, interface fluidity, backwards compatibility, new business models, safety, and man-machine symbiosis. Motivating problems: tracking, unstructured information, centralized trust, accessibility as afterthought.
---

# Design goals and problems

## Motivation

The way the web was built does not bode well with the way humans work. Fake news, privacy, control, trust, misinformation, information warfare, information overload. A breakdown of sense-making, loss of context in our communication and a polarization of society. These are systemic issues that we could substantially mitigate by starting from zero and (re)creating a more human web — something Tim Berners-Lee didn't have the time, knowledge or foresight to accomplish.

## Problems with the current web

**Browser fingerprinting and web activity tracking** — the boundary of control between user and system is poorly defined. Who should own the user interface? How do we ensure that the code which produces our interfaces can be trusted?

**Unstructured information** — roughly 94% of the information in the world is unstructured, and the amount of unstructured information is increasing much faster than structured. We are in the digital dark ages.

**"Scraping the web" vs "using the web"** — there should be no distinction. The web should seamlessly bridge the gap between man and machine.

**Centralized trust model** — Certificate Authorities as a single point of failure and control.

**Accessibility as an afterthought** — special needs and non-English speakers are second-class citizens of the web.

## Design goals

**Complete decentralization above the transport layer.** No Domain Name System, no Certificate Authorities, no Search Engine Monopoly, no Social Graph Monopoly, no Content Platform Monopoly. These should all be in the public domain.

**Information integrity.** Content-addressable information. A reference to a source should be a pure function connecting to the substring within the text. Computation results should be verifiable through recomputation on a personal device. Information archiving, redundancy and caching should be built into the bones of the web and made easy for users and developers alike.

**Ownership, sharing and privacy.** Expressive access control model for information.

**Interface fluidity.** Remove the distinction between editing and browsing. Create a spectrum of control over UI. Allow information to be accessed on the user's terms.

**Some backwards compatibility.** Integration tools to work with the existing WWW and outdated data formats like PDFs.

**New business models.** Advertising is nothing but propaganda. Make it easy for content creators to build on the platform or publish content and get paid via cryptocurrency.

**Safety.** Make the WWW a more safe and pleasant place. Make it hard for pedophiles, trolls, scammers and hackers to abuse.

**Man and machine symbiosis.** Create a common protocol, semantic and computational runtime for human and machine agents.

## On user interfaces

On the WWW, the website controls the presentation of its information with its own User Interface. This needs to be neutralized. The control over user interfaces should be a spectrum of infinite possibility. You should be able to design your own interface to any content on the web, to enable people with different needs to have access.

Animals should have access to the web. Dogs like watching dog videos. Standardized UI means lower cognitive overhead, no bad UI, no doubling of work (thousands of web frameworks, billions of web page designs). Translation, simplification, sensory impairment accommodation.
