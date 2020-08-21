import React from "react";

const tts = (s: number) => {
  if (s > 3600) {
    const sah = s % 3600;
    return `${(s / 3600) >> 0}:${(sah / 60) >> 0}:${sah % 60}`;
  }
  if (s > 60) {
    return `${(s / 60) >> 0}:${s % 60}`;
  }
  return `${s}`;
};

const QueueElement: React.FC<{ info: vidinfo; remove: () => void }> = ({
  info: { title, duration },
  remove,
}) => (
  <tr>
    <td className="text">{title}</td>
    <td className="time">{tts(duration)}</td>
    <td>
      <button className="list" onClick={remove}>
        remove
      </button>
    </td>
  </tr>
);

export default QueueElement;
