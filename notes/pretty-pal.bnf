****# Language Spec

## BNF Grammar

<Component> ::= <SimpleComponent> | <ComponentInheritance> | <ComponentBody> | <ComponentInheritanceArgument> | <ShorthandComponent>

<SimpleComponent> ::= <ComponentIdentifier>
<ComponentInheritance> ::= <ComponentIdentifier> : <ComponentIdentifier> [] // can also be full
<ComponentInheritanceBody> ::=  <ComponentIdentifier> : <ComponentIdentifier> [<StatementList>]
<ComponentBody> ::= <ComponentIdentifier> [<StatementList>]

// this is so you can reference a simple namespace, like icons or routes
<ShorthandComponent> ::= <ShorthandPrefix> <String>
<ShorthandPrefix> ::= 't' | 'l' | 'i'  // t for Text, l for Link, i for Icon

<UpperCaseLetter> ::= [A-Z]
<LowerCaseLetter> ::= [a-z]
<Digit>  ::= [0-9]
<Underscore> ::= _

<Character> ::= <UpperCaseLetter> | <LowerCaseLetter> | <Digit> | <Underscore>
<Characters> :: = <Character> | <Character> <Characters>

<ComponentIdentifier> ::= <UpperCaseLetter> | <UpperCaseLetter> <Characters>

// todo exclude special keywords map, if, else
<PropertyIdentifier> ::= <LowerCaseLetter> | <LowerCaseLetter> <Characters>

<AnyCharacter> ::= <Character> | <SpecialCharacter> ... any UTF8

<StatementList> ::= <PropertyList> | <ComponentList> | <PropertyList> <ComponentList> // ordering enforced

<Property> ::= <PropertyIdentifier> <Expr>;
<PropertyList> ::= <Property> | <Property> <PropertyList>

<ChildComponent> :== <Component> | <ConditionalComponent> | <MappedComponent>
<ComponentList> ::= <ChildComponent> | <ChildComponent> <ComponentList>

<StringContent> ::= <AnyCharacter> | <StringContent> <AnyCharacter>
<String> ::= '"' <StringContent> '"'

<Map> ::= map
<If> := if
<Else> ::= else

<ConditionalComponent> ::= <If> <Condition> : <ComponentList> |  <If> <Condition> : <ComponentList> <Else> <ComponentList>
<MappedComponent> ::= <Map> <PropertyIdentifier> : <ComponentList> // todo define api for map

<Condition> ::= ... todo define
<Expr> ::= <String> | ... todo add more

<Comment> // comments are for free thanks to Rust macro

Todo
- indicate non observable values being imported with !
- augment with primitive types like px, em, vw/vh, percentage, ratio, built in enums,color, time, angle, length, etc.
- define map and function syntax
- support rust code embedded within
- consider adopting the Syntax Text ["hello world"] or something similar for shorthand properties
- add built in testing and example support

If we take a naive approach to support rust code embedded within the system, we will not have a nice API. this is because we need to hide the observable structure. properties are defined as expressions, but they cannot be arbitrary. Expressions for certain properties need to return certain values.

A condition must evaluate to True or False.
An Expr must evaluate to the Type which matches the property.
We have to build this up from the ground up

## Example

```
Page [
    show_sidebar false;
    Header [
        Button [
            on_click show_sidebar = !show_sidebar;
            i"menu.svg";
        ]
    ]
    if show_sidebar Sidebar [

        display flex;
        flex_direction column;
        align_items center;
        width 200px;
        height 100vh;
        right 0;
        top 0;
        left 0;

        List [
            l"Home"
            l"About"
            l"Contact"
        ];
        t"{@company_name} © 2021";
    ];
    Body [
        height 100%;

        Block []
        Block []
        Block : CustomBlock []
        Block : CustomOne CustomTwo [
            Block []
            Block []
        ]
        Block Block []
        Block Block Block []
    ]
];
```

## Shorthand Syntax

- what about the namespace for Icons / Links? and routing?
- consider adopting the Syntax Text ["hello world"] or something similar for shorthand properties
- how do these shorthands get declared by user?

## CSS Properties to Start

Self:
    Size:
        width, height
        max-width, max-height, min-width, min-height
    top, right, bottom, left
    position: relative or absolute
    margin
    transform
    z-index
Content:
    padding
    display: flex, grid
    align: center,center left,center right,center...
    overflow: x,y

scale: fixed | responsive
transform
z-index
    
sticky and fixed are out of scope

Might need to include magic values: css states and index

## Inheritance and Instantiation

There has to be a way to define Components, a way to reference between definitions and a way to instantiate.
I dont want to introduce files into the language, but a built in namespacing mechanism seems impossible to avoid.

We may also have to support typing, or we can say that every property defined has to have a default value, 
which makes a lot of sense to be honest. We probably want to include Monads.

Regardng the multiple inheritance, it adds a lot of complexity with very little benefit. However,
With Inheritance, there is no way to dynamically update the properties by changing parent properties.
I think it is important to include some sort of theming. and then there is the matter of cross-cutting 
concerns / reusability.

I can imagine having a theme observable which can be used to set properties. Another thing I can imagine,
is some sort of Selector system across the component tree which can change properties of many components, 
using a Visitor type pattern. Another one is builtins. I can also do decorators or HOF

I think the Theming is easiest implemented by conditionals on observable, in parent classes. 
Everything else is a waste of time. I could even implement it statically, and just rebuild. 

So you have to restart the application. which is fine because themes are changed infrequently.


Inheritance Processs:
- Get the Inhteritee
- Typecheck inheritor properties that overlap
- Overwrite with properties defined in the inhertitor
- If Inheritee and inheritor both have defined structure, throw error
- We will use @property to define templates style components
- a template inheriting from a teplace?

We can also enable higher order components maybe if I feel like it


## Primitives and Built ins

every Primitive has a set of built in properties with defaults. you can add a new property
just by specifying the name and then the value. you can redefine and override the default value.
Do we need the ability to be able to mark a property as required? in React this is pretty crucial.

### List of Primitives

Link
Inputs
List
Menu
Canvas
Frame
SVG
Video

### APIs we need to support

- events (mouse, keyboard, clipboard, file drop, etc)
- Link navigation, going back and forth, maintaining a history of the UI state.
- internationalization
- text highlighting, ranges
- Input Stuff?

The only implicit API here is in the Primitive Component properties. they expose
handlers which are triggered by events. Link clicking is implicit. Text highlighting
and internationalization is a tough one, not sure. Input stuff is mostly just event handlers

## Macro Job

- build AST, component definitions and instantiate
- type checking, checking fields, values, inherited components, etc.
- Variables defined as expressions and properties need to be Obserified
- Variables defined outside the macro need to be checked for observability at runtime, once render is called.