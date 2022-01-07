## template compiler

* template -> ast
* ast -> transformAst
* transformAst -> code string

### Ast Explorer

* [vue-next-template-explorer](https://vue-next-template-explorer.netlify.app/#eyJzcmMiOiJcbiA8ZGl2PkhlbGxvIFdvcmxkITwvZGl2PiIsIm9wdGlvbnMiOnsib3B0aW1pemVJbXBvcnRzIjpmYWxzZX19)
* [ast explorer](https://astexplorer.net/)

### template compile

core thinking:

* match tag, attrs, expression, text to parse
* delete parsed part
* while loop template until it become empty

#### compile text

#### compile expression

get value within `{{ value }}`

#### compile element

* parse tag
