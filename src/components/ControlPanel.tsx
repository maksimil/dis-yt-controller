import React from "react";

const ControlPanel: React.FC<{
  pause: () => void;
  paused: boolean | undefined;
}> = ({ pause, paused }) => {
  return (
    <div className="ccontainer">
      <div className="cpanel">
        <button className="cpanel" onClick={pause}>
          {paused ? "resume" : "pause"}
        </button>
      </div>
      <div className="cpanel">
        <button className="cpanel">skip</button>
      </div>
    </div>
  );
};

export default ControlPanel;
