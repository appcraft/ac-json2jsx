import React, { useState } from "react";
import Editor from "../Editor";

const PropsExample = ({ components, renderProps }) => {
  const [name, setName] = useState("John");
  return (
    <div style={{ maxWidth: 1200, margin: "24px auto", position: "relative" }}>
      <h2>Passing props</h2>
      <div>
        The <code>name</code> prop is passed to the renderer json2jsx component.
      </div>
      <fieldset style={{ maxWidth: 200 }}>
        <label htmlFor="name2">name</label>
        <input
          id="name2"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </fieldset>
      <Editor
        defaultCode={`<div>Hello {name}</div>`}
        components={components}
        renderProps={{ name }}
      />
    </div>
  );
};

export default PropsExample;
