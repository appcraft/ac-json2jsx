import React, { Component } from 'react';
import './App.css';

import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-json'

import {
  LiveProvider,
  LiveEditor,
  LiveError
} from 'react-live'

import jsx2json from './jsx2json'
import json2jsx from './json2jsx'

import { transform } from 'babel-standalone'

class ObjProvider extends LiveProvider {
  transpile = ({ code, scope, transformCode, noInline = false }) => {
    const { ast, error } = jsx2json(code)

    // State reset object
    const state = { unsafeWrapperError: undefined, error }
    this.setState({ ...state, element: null }) // Reset output for async (no inline) evaluation
    if (ast) this.props.onChange(ast)
  }
}

class ErrorBoundary extends React.Component {
  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    const { children } = this.props
    return <div>{children}</div>
  }
}

const Label = ({type="default", children, ...props}) => (
  <div {...props} className={"label label--" + type}>{children}</div>
)

class Editor extends Component {
  state = {
    result: {}
  }

  handleChange = (result => this.setState({ result }))

  render() {
    const { defaultCode, components, renderProps } = this.props
    const { result } = this.state

    const firstName="Gregory", lastName="Potdevin", enterprise="AppCraft",
          role="CTO", user={id: 123}

    const Component = (props) => json2jsx(result, components, props)
    
    return (
      <ObjProvider code={defaultCode} onChange={this.handleChange}>
        <div className="react-live-container">
          <div style={{display: "flex", flex: 1, flexDirection: 'column'}}>
            <div style={{flex: 2, backgroundColor: '#1D1F21', position: 'relative', margin: 4, borderLeft: '3px solid #f44336'}}>
              <Label type="jsx">JSX template</Label>
              <LiveEditor />
            </div>
            <div style={{flex: 1, backgroundColor: '#eee', color: '#333', position: 'relative', padding: 8, paddingTop: 20, margin: 4, borderLeft: '3px solid #777'}}>
              <Label type="preview">Live preview</Label>
              <ErrorBoundary>
                <Component {...renderProps} />
              </ErrorBoundary>
            </div>
          </div>
          <div style={{flex: 1, backgroundColor: '#f5f2f0', color: '#000', position: 'relative', margin: 4, borderLeft: '3px solid #1976D2'}}>
              <Label type="json">JSON</Label>
              <pre className="prism-json" dangerouslySetInnerHTML={{__html: highlight(JSON.stringify(result, null, 2), languages.json)}} />
          </div>
        </div>
        <LiveError />
      </ObjProvider>
    );
  }
}

export default Editor;
