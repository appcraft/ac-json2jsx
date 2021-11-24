import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import "./App.css";
import BasicExample from "./examples/BasicExample";
import ComponentsExample from "./examples/ComponentsExample";
import KitchenSinkExample from "./examples/KitchenSinkExample";
import PropsExample from "./examples/PropsExample";

const Row = ({ children, style = {}, ...props }) => (
  <div
    {...props}
    style={{
      ...style,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    }}
  >
    {children}
  </div>
);
const Col = ({ children, style = {}, ...props }) => (
  <div
    {...props}
    style={{ ...style, display: "flex", flexDirection: "column" }}
  >
    {children}
  </div>
);

const View = ({ children, ...props }) => <div {...props}>{children}</div>;
const Text = ({ children, style = {}, color, bold, ...props }) => (
  <div
    {...props}
    style={{ color, ...style, fontWeight: bold ? "bold" : undefined }}
  >
    {children}
  </div>
);

const Icon = ({ onPress, onClick, style = {}, ...props }) => (
  <FontAwesome
    {...props}
    style={{ fontSize: 24, padding: 16, ...style }}
    onClick={onPress || onClick}
  />
);

const components = {
  View,
  Text,
  Icon,
  Row,
  Col,
};

class App extends Component {
  state = {
    name: "John",
    showCompany: true,
  };

  render() {
    const { name, showCompany } = this.state;

    const Colors = {
      title: "#f00",
      id: "#f00",
    };
    const Config = {
      showId: true,
    };

    const renderProps = {
      Colors,
      Config,
      firstName: "John",
      lastName: "Doe",
      enterprise: "AppCraft",
      role: "Tester",
      user: { id: 123 },
      alert: alert,
    };

    return (
      <div className="App">
        <h1>JSON 2 JSX demo</h1>
        <BasicExample components={components} />
        <PropsExample components={components} />
        <ComponentsExample components={components} renderProps={renderProps} />
        <KitchenSinkExample components={components} renderProps={renderProps} />
      </div>
    );
  }
}

export default App;
