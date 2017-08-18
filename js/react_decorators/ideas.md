# Ideas


## stateAsProps

```js
function MyComponent({ state, inc, dec }) {
  return (
    <div>
      <button onClick={dec}>-</button>
      {state.count}
      <button onClick={inc}>+</button>
    </div>
  );
}


export default stateAsProps({
  initial: { count: 0 },
  actions: {
    dec() { this.setState({ count: count - 1 }) },
    inc() { this.setState({ count: count + 1 }) },
  },
})(MyComponent)
```

## PureComponent

```js
function pureComponentUpdate(compareProps) {
  return (Component) => {
    class PureComponentUpdate extend React.Component {
      props: any,

      static displayName = `PureComponentUpdate(${ Component.displayName || Component.name || 'Component' })`;

      shouldComponentUpdate(nextProps: any, nextState: any): boolean {
        if (!compareProps) {
          return shallowCompare(this, nextProps, nextState);
        }

        // we might do deep compare
        return _.any(compareProps, (name) => this.props[name] !== nextProps[name]);
      }

      render() {
        return React.createElement(Component, ...this.props);
      }
    };

    return PureComponentUpdate;
  }
}
```
