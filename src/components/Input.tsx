import React from "react";

class Input extends React.Component<
  {
    turlcache: { [key: string]: string };
    add: (s: string) => void;
    lastvalid: boolean;
  },
  {
    nameurl: string;
    url: string;
    focused: boolean;
  }
> {
  state = {
    nameurl: "",
    url: "",
    focused: false,
  };

  inputref: React.RefObject<HTMLInputElement> = React.createRef();

  render() {
    const { add, lastvalid, turlcache } = this.props;
    const { nameurl, url, focused } = this.state;
    return (
      <tr>
        <td className="text" colSpan={2}>
          <input
            ref={this.inputref}
            className={lastvalid ? "" : "invalid"}
            type="text"
            value={url}
            placeholder="url"
            onFocus={(e) => {
              this.setState({ focused: true });
            }}
            onBlur={(e) => {
              this.setState({ focused: false });
            }}
            onChange={(e) => {
              const value = e.target.value;
              this.setState({
                nameurl: value,
                url: value,
              });
            }}
          />
          {focused ? (
            <table
              className="autocomplete"
              style={{
                width: `${
                  this.inputref.current?.getBoundingClientRect().width
                }px`,
              }}
            >
              <tbody>
                {Object.keys(turlcache)
                  .filter((title) => title.startsWith(nameurl))
                  .map((title) => {
                    const url0 = turlcache[title];
                    return (
                      <tr className="autocompleteelement" key={url0}>
                        <td
                          onMouseEnter={() => {
                            this.setState({ url: url0 });
                          }}
                        >
                          {title}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          ) : null}
        </td>
        <td>
          <button
            className="list"
            onClick={() => {
              add(url);
              this.setState({ url: "" });
            }}
          >
            add
          </button>
        </td>
      </tr>
    );
  }
}

export default Input;
