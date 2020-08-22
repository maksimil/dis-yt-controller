import React from "react";

class Input extends React.Component<
  {
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
    const { add, lastvalid } = this.props;
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
                <tr className="autocompleteelement">
                  <td>BOY</td>
                </tr>
                <tr className="autocompleteelement">
                  <td>OH, BOY</td>
                </tr>
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
