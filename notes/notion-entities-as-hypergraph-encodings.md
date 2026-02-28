---
date: 2024-01-21
tags: [notion, encoding, hypergraph, types, hyper-ts]
summary: Mapping Notion's content model (Page, List, Text, Media, Code, Equation, Embed) onto HyperGraph nodes and edges with explicit encodings. Useful as a concrete example of how a real product's entity types map to the Atom/Edge model, and how file-extension-like encoding types determine parsing and rendering.
---

# Notion entities as HyperGraph encodings

## Entity mapping

| Notion entity | HyperGraph representation |
|---|---|
| Page | Edge with Page encoding |
| List | Edge with List encoding |
| Text | Node with UTF-8 + Markdown encoding |
| Media | Node with File encoding |
| Code | Node with Code encoding |
| Equation | Node with LaTeX encoding |
| Embed | Node with URL encoding |

## Text node semantics

Within a Text node, certain token patterns imply typed sub-nodes:
- URL Link Node
- Code Node
- Equation Node
- Person Node
- Page Node
- Date Node

## Node encodings

```
Binary
  Char Encoding: UTF-8
    MarkDown-Like (.md)
    LaTeX (.tex)
    JavaScript (.js)
    File (.pdf, .png, .jpg, .csv, .mp3, .mp4)
  Char Encoding: ASCII
    URL

Edge
  Binary
    Char Encoding: ASCII
      Ordered List
      Unordered List
      Set
```

## Open question

How do HyperGraph nodes get defined on the fly through syntax parsing (for code/LaTeX) or format detection for formally defined syntax (URL, Date, IDs in tokens)?
