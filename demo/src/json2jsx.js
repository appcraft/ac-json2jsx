import React from "react";

function unop(op, arg) {
  switch (op) {
    case "+":
      return +arg;
    case "-":
      return -arg;
    case "!":
      return !arg;
    case "~":
      return ~arg;
    default: {
      console.error("unhandled unop", op);
      return null;
    }
  }
}

function binop(op, left, right) {
  switch (op) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return left / right;
    case "%":
      return left % right;
    case "==":
      return left == right;
    case "!=":
      return left != right;
    case "===":
      return left === right;
    case "!==":
      return left !== right;
    case ">":
      return left > right;
    case ">=":
      return left >= right;
    case "<":
      return left < right;
    case "<=":
      return left <= right;
    case "&":
      return left & right;
    case "|":
      return left | right;
    case "^":
      return left ^ right;
    case "<<":
      return left << right;
    case ">>":
      return left >> right;
    case ">>>":
      return left >>> right;
    default: {
      console.error("unhandled binop", op);
      return null;
    }
  }
}

function jsxEval(node, components, props) {
  if (!node || !node.type) return null;
  switch (node.type) {
    case "Identifier":
      return props[node.name];
    case "Value":
      return node.value;
    case "TemplateLiteral": {
      let str = "";
      for (let i = 0; i < node.quasis.length; i++) {
        str += node.quasis[i];
        if (i < node.expressions.length) {
          str += jsxEval(node.expressions[i], components, props);
        }
      }
      return str;
    }
    case "UnaryExpression": {
      return unop(node.operator, jsxEval(node.argument, components, props));
    }
    case "BinaryExpression": {
      return binop(
        node.operator,
        jsxEval(node.left, components, props),
        jsxEval(node.right, components, props)
      );
    }
    case "LogicalExpression": {
      const left = jsxEval(node.left, components, props);
      switch (node.operator) {
        case "&&": {
          if (!left) return false; // Slight semantic change for React Native (simplified {str && <Text>{str}</Text>})
          return jsxEval(node.right, components, props);
        }
        case "||": {
          if (left) return left;
          return jsxEval(node.right, components, props);
        }
        default: {
          console.error("unhandled logicop", node.operator);
          return null;
        }
      }
    }
    case "ConditionalExpression": {
      const res = jsxEval(node.test, components, props);
      if (res) {
        return jsxEval(node.consequent, components, props);
      }
      return jsxEval(node.alternate, components, props);
    }
    case "MemberExpression": {
      const { object, property } = node;
      const obj = jsxEval(object, components, props);
      if (!obj) return null;
      if (property.type === "Identifier") {
        const res = obj[property.name];
        if (typeof res === "function") {
          res._this = obj;
        }
        return res;
      }
      return null;
    }
    case "ObjectExpression": {
      const result = {};
      for (let key in node.properties) {
        result[key] = jsxEval(node.properties[key], components, props);
      }
      return result;
    }
    case "ArrayExpression": {
      return node.elements.map((n) => jsxEval(n, components, props));
    }
    case "CallExpression": {
      const callee = jsxEval(node.callee, components, props);
      // console.log("callee", callee, callee && callee._this)
      if (!callee) return null;
      return callee.apply(
        callee._this,
        node.arguments.map((arg) => jsxEval(arg, components, props))
      );
    }
    case "ArrowFunctionExpression": {
      const { body, params } = node;
      return (...args) =>
        jsxEval(body, components, {
          ...props,
          ...params.reduce(
            (acc, param, i) => ({ ...acc, [param.name]: args[i] }),
            {}
          ),
        });
    }
    case "Component": {
      let elementProps = {};

      if (
        node.props.length === 1 &&
        node.props[0].type === "JSXAttributeValues"
      ) {
        // Only prop with all the values in it
        elementProps = node.props[0].values;
      } else {
        for (const prop of node.props) {
          if (prop.type === "JSXAttributeValues") {
            Object.assign(elementProps, prop.values);
          } else if (prop.type === "JSXAttributeValue") {
            elementProps[prop.name] = prop.value;
          } else {
            elementProps[prop.name] = prop.value
              ? jsxEval(prop.value, components, props)
              : true;
          }
        }
      }

      const children = node.children.map((c) => jsxEval(c, components, props));
      // console.log("Create", node.component, elementProps, children)
      return React.createElement(
        components[node.component] || node.component,
        elementProps,
        ...children
      );
    }
    default: {
      console.warn("Unknown node type", node.type, node);
      return null;
    }
  }
}

const json2jsx = jsxEval;

export default json2jsx;
