import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const DragPoint = styled.div`
  background: #d71d48;
  border-radius: 50%;
  cursor: crosshair;
  height: 8px;
  position: absolute;
  width: 8px;
`;

const Line = styled.div`
  background: #d61d48;
  cursor: pointer;
  min-height: 2px;
  min-width: 2px;
  position: absolute;
`;

function top(el) {
  if (!el) { return 0; }
  return el.offsetTop + top(el.offsetParent);
}

function left(el) {
  if (!el) { return 0; }
  return el.offsetLeft + left(el.offsetParent);
}

class MouseObserver {
  constructor(el, handleMouseMove, handleMouseUp) {
    this.handleMouseMove = handleMouseMove;
    this.handleMouseUp = handleMouseUp;

    this.diffX = left(el.offsetParent);
    this.diffY = top(el.offsetParent);

    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);
  }

  stop() {
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  onMouseUp = (e) => {
    this.stop();
    this.handleMouseUp();
  }

  onMouseMove = (e) => {
    this.handleMouseMove({ x: e.clientX - this.diffX, y: e.clientY - this.diffY });
  }
}

const TRANSFORMATIONS = {
  topLeft({ top, left, width, height }, { x, y }) {
    return {
      top: y,
      left: x,
      height: top - y + height,
      width: left - x + width,
    };
  },
  topRight({ top, left, width, height }, { x, y }) {
    return {
      top: y,
      height: top - y + height,
      width: x - left,
    };
  },
  bottomRight({ top, left, width, height }, { x, y }) {
    return {
      height: y - top,
      width: x - left,
    };
  },
  bottomLeft({ top, left, width, height }, { x, y }) {
    return {
      left: x,
      height: y - top,
      width: left - x + width,
    };
  },
};

export default class Shape extends React.Component {
  state = {
    top: this.props.shape.top,
    left: this.props.shape.left,
    width: this.props.shape.width,
    height: this.props.shape.height,
  };

  render() {
    const { top, left, width, height } = this.state;

    return (
      <div style={{ position: 'absolute', top, left, width, height }}>
        <Line style={{ top: 0, right: 0, left: 0 }} onMouseDown={this.dragShape} />
        <Line style={{ top: 0, left: 0, bottom: 0 }} onMouseDown={this.dragShape} />
        <Line style={{ top: 0, bottom: 0, right: 0 }} onMouseDown={this.dragShape} />
        <Line style={{ bottom: 0, left: 0, right: 0 }} onMouseDown={this.dragShape} />
        <DragPoint style={{ top: -2, left: -2 }} onMouseDown={this.dragTopLeft} />
        <DragPoint style={{ top: -2, right: -2 }} onMouseDown={this.dragTopRight} />
        <DragPoint style={{ bottom: -2, right: -2 }} onMouseDown={this.dragBottomRight} />
        <DragPoint style={{ bottom: -2, left: -2 }} onMouseDown={this.dragBottomLeft} />
      </div>
    );
  }

  dragShape = (e) => {
    const el = ReactDOM.findDOMNode(this);

    const diffY = e.clientY - top(el);
    const diffX = e.clientX - left(el);

    this.startDrag((_state, { x, y }) => { return { top: y - diffY, left: x - diffX }; });
  };

  dragTopLeft = () => {
    this.startDrag(TRANSFORMATIONS.topLeft);
  };

  dragTopRight = () => {
    this.startDrag(TRANSFORMATIONS.topRight);
  };

  dragBottomRight = () => {
    this.startDrag(TRANSFORMATIONS.bottomRight);
  };

  dragBottomLeft = () => {
    this.startDrag(TRANSFORMATIONS.bottomLeft);
  };

  startDrag = (transform) => {
    const el = ReactDOM.findDOMNode(this);

    this.transform = transform;
    this.observer = new MouseObserver(el, this.onDrag, this.stopDrag);
  };

  onDrag = (coordinates) => {
    const newState = this.transform(this.state, coordinates);

    if (newState.width < 0) {
      if (this.transform === TRANSFORMATIONS.topRight) {
        this.transform = TRANSFORMATIONS.topLeft;
      } else if (this.transform === TRANSFORMATIONS.topLeft) {
        this.transform = TRANSFORMATIONS.topRight;
      } else if (this.transform === TRANSFORMATIONS.bottomLeft) {
        this.transform = TRANSFORMATIONS.bottomRight;
      } else if (this.transform === TRANSFORMATIONS.bottomRight) {
        this.transform = TRANSFORMATIONS.bottomLeft;
      }
    }

    if (newState.height < 0) {
      if (this.transform === TRANSFORMATIONS.topRight) {
        this.transform = TRANSFORMATIONS.bottomRight;
      } else if (this.transform === TRANSFORMATIONS.bottomRight) {
        this.transform = TRANSFORMATIONS.topRight;
      } else if (this.transform === TRANSFORMATIONS.topLeft) {
        this.transform = TRANSFORMATIONS.bottomLeft;
      } else if (this.transform === TRANSFORMATIONS.bottomLeft) {
        this.transform = TRANSFORMATIONS.topLeft;
      }
    }

    this.setState(newState);
  };

  stopDrag = () => {
    this.transform = null;
    this.observer = null;
  };
}
