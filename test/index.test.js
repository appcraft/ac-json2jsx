import React from 'react'
import json2jsx from '../src'

import renderer from 'react-test-renderer';

function render(component){
  return renderer.create(component).toJSON()
}

describe("basic js", () => {

  it('handles values', () => {
    // 123
    expect(json2jsx({
      "type": "Value",
      "value": 123
    })).toEqual(123)

    // "foo"
    expect(json2jsx({
      "type": "Value",
      "value": "foo"
    })).toEqual("foo")
  });

  it('handles objects', () => {
    // { key: "value"}
    expect(json2jsx({
      "type": "Value",
      "value": {
        "key": "value"
      }
    })).toEqual({ key: "value"})

    // { key: value}
    expect(json2jsx({
      "type": "ObjectExpression",
      "properties": {
        "key": {
          "type": "Identifier",
          "name": "value"
        }
      }
    }, null, {value: "dynamic value"})).toEqual({ key: "dynamic value"})
  });

  it('handles arrays', () => {
    // ["foo", "bar", "baz"]
    expect(json2jsx({
      "type": "Value",
      "value": [
        "foo",
        "bar",
        "baz"
      ]
    })).toEqual(["foo", "bar", "baz"])

    // ["foo", value, "baz"]
    expect(json2jsx({
      "type": "ArrayExpression",
      "elements": [
        {
          "type": "Value",
          "value": "foo"
        },
        {
          "type": "Identifier",
          "name": "value"
        },
        {
          "type": "Value",
          "value": "baz"
        }
      ]
    }, null, {value: 123})).toEqual(["foo", 123, "baz"])
  });


  it('handles unary operators', () => {
    // !true
    expect(json2jsx({
      "type": "UnaryExpression",
      "operator": "!",
      "argument": { "type": "Value", "value": true }
    })).toEqual(false)

    // !false
    expect(json2jsx({
      "type": "UnaryExpression",
      "operator": "!",
      "argument": { "type": "Value", "value": false }
    })).toEqual(true)
  });

  it('handles binary operators', () => {
    // 1 + 1
    expect(json2jsx({
      "type": "BinaryExpression",
      "left": { "type": "Value", "value": 1 },
      "operator": "+",
      "right": { "type": "Value", "value": 1 }
    })).toEqual(2)

    // 4 - 1
    expect(json2jsx({
      "type": "BinaryExpression",
      "left": { "type": "Value", "value": 4 },
      "operator": "-",
      "right": { "type": "Value", "value": 1 }
    })).toEqual(3)

    // 3 * 4
    expect(json2jsx({
      "type": "BinaryExpression",
      "left": { "type": "Value", "value": 3 },
      "operator": "*",
      "right": { "type": "Value", "value": 4 }
    })).toEqual(12)
  });

  it('handles strings concatenation', () => {
    // "foo" + "bar"
    expect(json2jsx({
      "type": "BinaryExpression",
      "left": { "type": "Value", "value": "foo" },
      "operator": "+",
      "right": { "type": "Value", "value": "bar" }
    })).toEqual("foobar")
  })

  it('handles string templates', () => {
    // `foo ${"bar"} baz`
    expect(json2jsx({
      "type": "TemplateLiteral",
      "expressions": [
        { "type": "Value", "value": "bar" }
      ],
      "quasis": [ "foo "," baz" ]
    })).toEqual("foo bar baz")
  })

  it('handles variables', () => {
    // foo
    expect(json2jsx({
      "type": "Identifier",
      "name": "foo"
    }, null, {foo: "bar"})).toEqual("bar")

    // `foo ${foo} baz`
    expect(json2jsx({
      "type": "TemplateLiteral",
      "expressions": [
        { "type": "Identifier", "name": "foo" }
      ],
      "quasis": [ "foo "," baz" ]
    }, null, {foo: "bar"})).toEqual("foo bar baz")
  })

  it('handles conditional expressions ', () => {
    // true ? 1 : 0
    expect(json2jsx({
      "type": "ConditionalExpression",
      "test": { "type": "Value", "value": true },
      "consequent": { "type": "Value", "value": 1 },
      "alternate": { "type": "Value", "value": 0 }
    })).toEqual(1)

    // false ? 1 : 0
    expect(json2jsx({
      "type": "ConditionalExpression",
      "test": { "type": "Value", "value": false },
      "consequent": { "type": "Value", "value": 1 },
      "alternate": { "type": "Value", "value": 0 }
    })).toEqual(0)
  })

  it('handles logic expressions', () => {

    function makeLogic(op, leftValue, rightValue){
      return {
        "type": "LogicalExpression",
        "left": {
          "type": "Value",
          "value": leftValue
        },
        "operator": op,
        "right": {
          "type": "Value",
          "value": rightValue
        }
      }
    }

    // &&
    expect(json2jsx(makeLogic("&&", true, true))).toEqual(true)
    expect(json2jsx(makeLogic("&&", true, false))).toEqual(false)
    expect(json2jsx(makeLogic("&&", false, true))).toEqual(false)
    expect(json2jsx(makeLogic("&&", false, false))).toEqual(false)

    // ||
    expect(json2jsx(makeLogic("||", true, true))).toEqual(true)
    expect(json2jsx(makeLogic("||", true, false))).toEqual(true)
    expect(json2jsx(makeLogic("||", false, true))).toEqual(true)
    expect(json2jsx(makeLogic("||", false, false))).toEqual(false)
  })

  it('handles arrow functions', () => {
    // ((foo) => foo + "bar")("baz")
    const json = {
      "type": "CallExpression",
      "callee": {
        "type": "ArrowFunctionExpression",
        "params": [
          { "type": "Identifier", "name": "foo" }
        ],
        "body": {
          "type": "BinaryExpression",
          "left": { "type": "Identifier", "name": "foo" },
          "operator": "+",
          "right": { "type": "Value", "value": "bar" }
        }
      },
      "arguments": [
        { "type": "Value", "value": "baz" }
      ]
    }

    expect(json2jsx(json)).toEqual("bazbar")
  })
})


describe("React elements", () => {
  const components = {
    div: ({children, ...props}) => <div {...props}>{children}</div>
  }

  it('handles components', () => {
    expect(render(json2jsx({
      "type": "Component",
      "component": "div",
      "props": [],
      "children": [
        {
          "type": "Value",
          "value": "Hello world"
        }
      ]
    }, components))).toEqual(render(<div>Hello world</div>))

  });

  it('handles jsx props', () => {
    expect(render(json2jsx({
      "type": "Component",
      "component": "div",
      "props": [
        {
          "type": "JSXAttribute",
          "name": "className",
          "value": {
            "type": "Value",
            "value": "active"
          }
        },
        {
          "type": "JSXAttribute",
          "name": "style",
          "value": {
            "type": "Value",
            "value": {
              "color": "red"
            }
          }
        }
      ],
      "children": [
        {
          "type": "Value",
          "value": "Test"
        }
      ]
    }, components))).toEqual(render(<div className="active" style={{color: "red"}}>Test</div>))

  });

  it('handles nested components', () => {
    expect(render(json2jsx({
      "type": "Component",
      "component": "div",
      "props": [],
      "children": [
        {
          "type": "Component",
          "component": "div",
          "props": [],
          "children": [
            {
              "type": "Value",
              "value": "Hello"
            }
          ]
        },
        {
          "type": "Component",
          "component": "div",
          "props": [],
          "children": [
            {
              "type": "Value",
              "value": "world"
            }
          ]
        }
      ]
    }, components))).toEqual(render(
      <div>
        <div>Hello</div>
        <div>world</div>
      </div>
    ))

  });
})