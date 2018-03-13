import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome'

import './App.css';
import Editor from './Editor'

const Row = ({ children, style={}, ...props }) => (
  <div {...props} style={{ ...style, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
    {children}
  </div>
)
const Col = ({ children, style={}, ...props }) => <div {...props} style={{...style, display: 'flex', flexDirection: 'column'}}>{children}</div>

const View = ({ children, ...props }) => <div {...props}>{children}</div>
const Text = ({ children, style={}, color, bold, ...props }) => (
  <div {...props} style={{color, ...style, fontWeight: bold ? "bold" : undefined }}>{children}</div>
)

const Icon = ({ onPress, onClick, style={}, ...props }) => (
  <FontAwesome {...props} 
               style={{fontSize: 24, padding: 16, ...style}} 
               onClick={onPress || onClick} />
)

const components = {
  View,
  Text,
  Icon,
  Row,
  Col,
}


class App extends Component {

  state = {
    name: "John",
    showCompany: true
  }

  render() {
    const { name, showCompany } = this.state

    const Colors = {
      title: "#f00",
      id: "#f00",
    }
    const Config = {
      showId: true,
    }

    const renderProps = {
      Colors,
      Config,
      firstName: "John",
      lastName: "Doe",
      enterprise: "AppCraft",
      role: "Tester",
      user: { id: 123 },
      alert: alert,
    }

    return (
      <div className="App">
        <h1>JSON 2 JSX demo</h1>
        <div style={{ maxWidth: 1200, margin: '24px auto', position: 'relative' }}>
          <h2>Basic example</h2>
          <div>
            Simple Hello world
          </div>
          <Editor 
            defaultCode={`<div>Hello world</div>`}
            components={components}
            renderProps={renderProps}
          />
        </div>

        <div style={{ maxWidth: 1200, margin: '24px auto', position: 'relative' }}>
          <h2>Passing props</h2>
          <div>
            The <code>name</code> prop is passed to the renderer json2jsx component.
          </div>
          <fieldset style={{maxWidth: 200}}>
            <label htmlFor="name">name</label>
            <input id="name" type="text" value={name} onChange={(e) => this.setState({name: e.target.value})} />
          </fieldset>
          <Editor 
            defaultCode={`<div>Hello {name}</div>`}
            components={components}
            renderProps={{name}}
          />
        </div>

        <div style={{ maxWidth: 1200, margin: '16px auto', position: 'relative' }}>
          <h2>Passing components</h2>
          <div>
            A few custom components are passed to the renderer. This makes json2jsx compatible with react-native or any other implementation.
          </div>
          <div>
            Components passed : <code>Row</code>, <code>View</code>, <code>Text</code>, <code>Icon</code>
          </div>
          <Editor 
            defaultCode={`<Row style={{backgroundColor: '#fff'}}>
  <Icon name="user" style={{fontSize: 32, padding: 16}}/>
  <View style={{flex: 1}}>
    <Text bold>{firstName} {lastName.toUpperCase()}</Text>
    <Text>{\`\${enterprise} - \${role}\`}</Text>
  </View>
  <Icon name="chevron-right" />
</Row>`}
            components={components}
            renderProps={renderProps}
          />
        </div>

        <div style={{ maxWidth: 1200, margin: '16px auto', position: 'relative' }}>
          <h2>Kitchen sink</h2>
          <div>
            Random features... Click on the right icon to show an alert.
          </div>

          <fieldset style={{maxWidth: 200}}>
            <div>
              <input id="showCompany" type="checkbox" checked={showCompany} onChange={(e) => this.setState({showCompany: e.target.checked})} />
              <label className="label-inline" htmlFor="showCompany">showCompany</label>
            </div>
          </fieldset>
          <Editor 
            defaultCode={`<Row style={{backgroundColor: '#fff'}}>
  <Icon name="user" style={{fontSize: 32, padding: 16}}/>
  <View style={{flex: 1}}>
    <Text bold>{firstName} {lastName.toUpperCase()}</Text>
    {showCompany && <Text>{\`\${enterprise} - \${role}\`}</Text>}
    <Row>
      {["red", "green", "blue"].map((v, index) => (
        <Text key={index} color={v} style={{marginRight: 8}}>{v}</Text>
      ))}
    </Row>
  </View>
  <Icon name="chevron-right" onPress={() => alert("ok")} />
</Row>`}
            components={components}
            renderProps={{...renderProps, showCompany}}
          />
        </div>
      </div>
    );
  }
}

export default App;
