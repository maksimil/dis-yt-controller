import React from "react";

const round = (value: number, order: number) =>
  Math.round(value * order) / order;

const VolumeController: React.FC<{
  volume: number;
  setvolume: (v: number) => void;
}> = ({ volume, setvolume }) => {
  return (
    <div className="volumecontainer">
      <div className="volumetitle">volume:</div>
      <div className="volume">{volume}</div>
      <div className="volcontrol">
        <button
          className="volume"
          onClick={() => {
            setvolume(round(volume + 0.5, 10));
          }}
        >
          +0.5
        </button>
        <button
          className="volume"
          onClick={() => {
            setvolume(round(volume + 0.1, 10));
          }}
        >
          +0.1
        </button>
        <button
          className="volume"
          onClick={() => {
            setvolume(round(volume - 0.1, 10));
          }}
        >
          -0.1
        </button>
        <button
          className="volume"
          onClick={() => {
            setvolume(round(volume - 0.5, 10));
          }}
        >
          -0.5
        </button>
      </div>
    </div>
  );
};

export default VolumeController;
