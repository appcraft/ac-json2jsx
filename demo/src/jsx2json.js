import { transform } from 'babel-standalone'


function isEmptyString(node){
  return (node.type === "StringLiteral" || node.type === "Value") && /^([ ]|\n)*\n([ ]|\n)*$/.test(node.value)
}

function removeEmptyChildren(children){
  if (!children) return children
  return children.filter(c => !isEmptyString(c))
}

function propertiesObject(properties){
  const obj = {}
  for(let prop of properties){
    obj[prop.key] = prop.value
  }
  return obj
}

function partialEval(node){
  switch(node.type){
    case "Value": return node
    case "ObjectExpression": {
      let isConstant = true
      const value = {}
      for(let prop in node.properties){
        node.properties[prop] = partialEval(node.properties[prop])
        if (node.properties[prop].type === "Value"){
          value[prop] = node.properties[prop].value
        } else {
          isConstant = false
          break
        }
      }
      if (!isConstant) return node
      return {
        type: "Value",
        value: value
      }
    }
    case "ArrayExpression": {
      let isConstant = true
      for(let element of node.elements){
        if (element.type !== "Value") {
          isConstant = false
          break
        }
      }
      if (!isConstant){
        return node
      }
      return {
        type: "Value",
        value: node.elements.map(n => n.value)
      }
    }
    default: return node
  }
}


function clean(node){
  if (!node) return node

  switch(node.type){
    case "File": return clean(node.program)
    case "Program": return clean(node.body[0])
    case "ExpressionStatement": return clean(node.expression)
    case "Identifier": return { type: node.type, name: node.name }
    case "StringLiteral": 
    case "NumericLiteral": 
    case "BooleanLiteral": 
    case "JSXText": return { type: "Value", value: node.value }
    case "TemplateLiteral": return { type: node.type, expressions: node.expressions.map(clean), quasis: node.quasis.map(q => q.value.raw) }
    case "CallExpression": return { type: node.type, callee: clean(node.callee), arguments: node.arguments.map(clean)}
    case "MemberExpression": return { type: node.type, object: clean(node.object), property: clean(node.property)}
    case "UnaryExpression": return { type: node.type, operator: node.operator, argument: clean(node.argument)}
    case "BinaryExpression":
    case "LogicalExpression": return { type: node.type, left: clean(node.left), operator: node.operator, right: clean(node.right)}
    case "ConditionalExpression": return { 
      type: node.type,
      test: clean(node.test),
      consequent: clean(node.consequent),
      alternate: clean(node.alternate)
    }
    // case "ObjectExpression": return { type: node.type, properties: node.properties.map(clean)}
    case "ObjectExpression": return partialEval({ type: node.type, properties: propertiesObject(node.properties.map(clean))})
    case "ArrayExpression": return partialEval({ type: node.type, elements: node.elements.map(clean)})
    case "ArrowFunctionExpression": return { type: node.type, params: node.params.map(clean), body: clean(node.body) }
    case "ObjectProperty": return { type: node.type, key: node.key.name, value: clean(node.value)}
    case "JSXExpressionContainer": return clean(node.expression)
    case "JSXElement": return {
      type: 'Component',
      component: node.openingElement.name.name,
      props: node.openingElement.attributes.map(clean),
      children: node.children && removeEmptyChildren(node.children.map(clean))
    }
    case "JSXAttribute": return {
      type: "JSXAttribute",
      name: node.name.name,
      value: clean(node.value)
    }
    default: {
      console.warn("Unhandled node type", node.type, node) 
      return {...node}
    } 
  }
}

export default function(jsx){
  try {
    const result = transform(jsx, { 
      // presets: ["es2015", "react", "stage-1"],
      plugins: [ [ require('babel-plugin-syntax-jsx') ] ]
      // plugins: [ [ jsxTransform ] ]
    })
    console.log("ast", result.ast)
    return {
      ast: clean(result.ast)
    }
  } catch(e){
    console.log("error", e)
    return {
      error: e.message
    }
  }
}