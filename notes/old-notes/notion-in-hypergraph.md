# Notion in HyperGraph

How would you implement Notion Databases in HyperEdge? How about Quotes?

Notion turned to HyperGraph

- Page - an Edge with the Page Encoding
- List - an Edge with the List Encoding
- Text - a Node with a UTF-8 + Markdown Encoding
    - HyperGraph Semantics
        - URL Link Node
        - Code Node
        - Equation Node
        - Person Node
        - Page Node
        - Date Node
- Media - a Node with File Encoding
- Code - a Node with a Code Encoding
- Equation - a Node with LaTeX Encoding
- Embed - a Node with a URL Encoding

### Encodings

Node

Binary

Char Encoding: UTF-8

MarkDown-Like (.md)

LaTeX (.tex)

JavaScript (.js) and later GraphScript

File (.pdf, .png, .jpg, .csv,  .mp3, .mp4) 

Char Encoding: ASCII

URL

Edge

Binary

Char Encoding: ASCII

Ordered List

Unordered List

Set

Figure out how HyperGraph Nodes can be defined on the fly through syntax parsing for code/latex or format detection for formally defined syntax like URL, Date or IDs in tokens.