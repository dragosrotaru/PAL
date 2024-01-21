## User Actions
- close: application, project, view, peek/autocomplete
- open control: control panel, search bar, voice
- undo/redo
- unit nav: next token, expression, closure, statement
- graph navigation: new unit, open definition, references, implementations, call hierarchy, refactor
- multi-select, copy, paste, cut
- comment out selected
- move selected up, down
- edit

the move-focus / select is difficult:
if you click on something, it goes to the definition.
if its the definition, it makes it editable

## Focus
- eye-tracking: 4 quadrant focus switching.
- brainwaves: concept switching
- keyboard: arrows, 1234, shortcuts
- mouse: click, hover


Affordances
Hierarchy
Customisability

In VS Code, you have file panels, and these specialized panels. 
One goal is to reduce the number of specialized ui elements. 
Another goal is to mould the UI around the user without requiring customization from the user

Things we can get rid of:

- line numbering
- filesystem view
- distinct file / project search
  

Universal Interfaces:

- graph view
- command/search bar
- floating action button 
- text panel


I dont think users should have to think about saving code, running tests, or anything other than the structure of the code itself. That should
all be done automatically. It is obvious what needs to be tested - if you are changing a unit of code, those tests should re-run every time
that the code can be compiled. Code should be saved continuously. Code should be commited whenever tests are passing, and so on. 

If we track the cost of all the actions, then we can optimise how often they are triggered to keep user performance high.

The user can fine tune how much compute to devote to the IDE. But whats the point of letting them change specific settings like linting?

Its a waste of time!

Programmers only need to focus on solving the problem the software is set out to solve.
The tooling should take care of everything else for you.

I dont think there should be any affordances on the screen. Using a mouse to click on a button is very slow.

Its much faster to use voice, eye tracking, brain scanning or a keyboard.

Also, its pretty crazy the default behaviour of the mouse is to move a cursor.
then you click and drag, or click, or double click
In a game, the mouse moves the view by default. 

Types of workflows:

1 changing a unit of code

real time values, tests, compiler errors, recommendations, documentation. I would want to see all of these things at the same time.

The entire view should be dedicated to giving you as much information about that specific piece of code

Transitions -> dependency, dependents, siblings 

Higher Level -> project management, code organization, integration-level tests/values


