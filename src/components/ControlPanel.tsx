import React from "react";

const ControlPanel: React.FC<{}> = () => {
  return (
    <div className="ccontainer">
      <div className="cpanel">
        <button className="cpanel">resume</button>
      </div>
      <div className="cpanel">
        <button className="cpanel">skip</button>
      </div>
    </div>
  );
};

export default ControlPanel;
