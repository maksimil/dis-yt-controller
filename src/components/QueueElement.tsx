import React from "react";
import tts from "../tts";

const QueueElement: React.FC<{
  info: vidinfo;
  url: string;
  remove: () => void;
}> = ({ info: { title, duration }, remove, url }) => (
  <tr>
    <td className="text vidtitle" onClick={() => window.open(url, "blank")}>
      {title}
    </td>
    <td className="time">{tts(duration)}</td>
    <td>
      <button className="list" onClick={remove}>
        remove
      </button>
    </td>
  </tr>
);

export default QueueElement;
