# JSON 2 JSX

A JSON to JSX converter. 

![preview](https://raw.githubusercontent.com/appcraft/ac-json2jsx/master/doc/sample.png)

[live demo](https://appcraft.github.io/ac-json2jsx/)

## Why ?

We needed to push React component code dynamically to React Native users. Sending raw code and using eval could probably work but would lead to memory leaks. So this is plain JSON, re-interpreted client-side.

Think of it like a JSX templating engine

## How ?

Babel is used to generate an AST of the JSX code. A simple AST interpreter is then used to evaluate that code and create React/React Native components

## FAQ

### How slow is this ?

It actually runs faster than you might think. Think of a page rendering with React in 3 steps :

1. Create the React components / vdom
2. Compare/merge with the previous vdom
3. Apply changes to the page (react-dom) or screen (react-native)

We haven't done lots of benchmarks yet, but our first tests (in Chrome) show that json2jsx is roughly 2 times slow for step 1. Steps 2 and 3 stays in pure JS inside React so there's no performance hit for those steps. So all in all, it feels like the performance should be pretty close to vanilla React performance.

### This sounds like a terrible idea

Yeah, it probably is. Still not sure if it's a good idea or a crazy one. I'll beb testing and benchmarking it in our product and see how it well it works. Obviously I'm open to other solutions.

## License

MIT
