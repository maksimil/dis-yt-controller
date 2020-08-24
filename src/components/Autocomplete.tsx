import React from "react";

const Autocomplete: React.FC<{
  turlcache: { [key: string]: string };
  seturl: (url: string) => void;
  nameurl: string;
  width: number;
}> = ({ turlcache, seturl, nameurl, width }) => (
  <table
    className="autocomplete"
    style={{
      width: `${width}px`,
    }}
  >
    <tbody>
      {Object.keys(turlcache)
        .filter((title) => title.startsWith(nameurl))
        .map((title) => {
          const url = turlcache[title];
          return (
            <tr className="autocompleteelement" key={url}>
              <td
                onMouseEnter={() => {
                  seturl(url);
                }}
              >
                {title}
              </td>
            </tr>
          );
        })}
    </tbody>
  </table>
);

export default Autocomplete;
