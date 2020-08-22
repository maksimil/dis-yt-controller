import React from "react";

class Input extends React.Component<
  {
    turlcache: { [key: string]: string };
    add: (s: string) => void;
    lastvalid: boolean;
  },
  {
    url: string;
    focused: boolean;
  }
> {
  state = {
    url: "",
    focused: false,
  };

  inputref: React.RefObject<HTMLInputElement> = React.createRef();

  render() {
    const { add, lastvalid, turlcache } = this.props;
    const { url, focused } = this.state;
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
              this.setState({
                url: e.target.value,
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
                  .filter((title) => title.startsWith(url))
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
