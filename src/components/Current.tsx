import React from "react";
import tts from "../tts";

const Current: React.FC<{
  info: vidinfo;
  url: string;
  time: number;
}> = ({ time, info, url }) => {
  const { duration, title } = info;
  return (
    <table>
      <tbody>
        <tr>
          <td
            className="text vidtitle"
            onClick={() => window.open(url, "blank")}
          >
            {title}
          </td>
          <td className="time">
            {tts(time)}/{tts(duration)}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Current;
