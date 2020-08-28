import React from "react";

const labels: { [key: string]: string } = {
  play: "pause",
  paused: "resume",
  notplaying: "play",
};

const ControlPanel: React.FC<{
  p: () => void;
  skip: () => void;
  pstatus: "play" | "paused" | "notplaying";
}> = ({ p, pstatus, skip }) => {
  return (
    <div className="ccontainer">
      <div className="cpanel">
        <button className="cpanel" onClick={p}>
          {labels[pstatus]}
        </button>
      </div>
      <div className="cpanel">
        <button className="cpanel" onClick={skip}>
          skip
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
