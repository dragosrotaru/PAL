---
date: 2024-01-21
tags: [archive, changetheweb, history, origins]
summary: Historical documents from the 2019 launch of changetheweb.xyz — the project that became Pal. Manifesto intro, technical description of the live-coding website, and original 2019 objectives.
---

# changetheweb origins (2019)

## Hello World!

From the beginning of knowable time, man has been on the search for meaning. Why are we here? What does it all mean? In our search for meaning, we have built new technologies to explore and share what we find — spoken language, oral tradition, cave paintings, petroglyphs, pictograms, ideograms, the alphabet, written language, the Gutenberg Press, journalism, fire signals, telegraphs, telephones, radio, television, computing, programming, the Internet, blockchain, YouTube, digital memes, TikTok. We are setting out to explore what the next paradigm might be.

Some of the ideas you may see here are wacky. This initiative is all about providing ourselves with the space to think creatively and out in the open — to suspend disbelief, dream big, and have a conversation about our future. This site was a live journal of thoughts, research and discussions between friends. We intended to build a platform for non-linear conversation, in which we would prototype and discuss the future of human information systems.

## How the site worked (2019)

A live-coding experiment — the site changed in real time as new code was typed. Sections changed, but the entire history was saved in `meta.json`. Past versions were accessible by taking any digest from `meta.json` and appending it to `https://changetheweb.xyz/info/`.

Version control was custom-built using content-addressing. The latest code was therefore not in GitHub.

Files for the project:
- `index.html`
- `meta.json`
- `style.css`
- `client.js` — code running in the browser
- `server.js` — code running on the server
- `watcher.js` — code running on the local PC

## Original objectives (2019)

- Make all existing content available and clean it up
- Get wild.cards up — the next, interactive version of the website
- Build the hypergraph protocol
- Conduct more interviews
- Work on use case discovery
- Study the history of networking; study individuals on the Internet Hall of Fame
- Read
