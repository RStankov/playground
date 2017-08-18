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
