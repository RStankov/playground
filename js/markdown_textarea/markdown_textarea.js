function setup(textarea) {
  ['keyup', 'keydown', 'keypres', 'input'].forEach((eventName) =>
    textarea.addEventListener(eventName, (e) => console.log(eventName, e)),
  );

  textarea.addEventListener('keydown', (e) => {
    // console.log(e.key, e);

    if (e.key === 'Backspace') {
      e.preventDefault();

      let position = textarea.selectionStart;
      const endPosition = textarea.selectionEnd;

      let value = textarea.value;

      if (position == endPosition) {
        textarea.value = removeAtPosition(value, position - 1);
        textarea.setSelectionRange(position - 1, position - 1);
      } else {
        textarea.value = value.slice(0, position) + value.slice(endPosition);
        textarea.setSelectionRange(position, position);
      }

      // if (
      //   value[position - 2] !== '*' &&
      //   value[position - 1] === '*' &&
      //   value[position] === '*' &&
      //   value[position + 1] === '*'
      // ) {
      //   textarea.value = removeAtPosition(value, position + 1);
      //   textarea.setSelectionRange(position, position);
      // }
      // if (
      //   value[position - 1] !== '*' &&
      //   value[position] === '*' //&&
      //   // value[position + 1] === '*'
      // ) {
      //   textarea.value = removeAtPosition(value, position + 1)
      //   textarea.setSelectionRange(position, position);
      // }
    }
  });

  textarea.addEventListener('keypress', (e) => {
    // console.log(e.key, e);

    e.preventDefault();

    let position = textarea.selectionStart;
    const endPosition = textarea.selectionEnd;

    let value = textarea.value;

    if (position != endPosition) {
      value = value.slice(0, position) + value.slice(endPosition);
    }

    if (e.key === 'Enter') {
      value = insertAtPosition(value, '\n', position);
      position += 1;

      const line = getLine(value, position - 1);
      const space = getListItem(line) || getSpace(line);

      textarea.value = insertAtPosition(value, space, position);
      textarea.setSelectionRange(
        position + space.length,
        position + space.length,
      );
    } else if (e.key.length === 1) {
      textarea.value = insertAtPosition(value, e.key, position);
      textarea.setSelectionRange(position + 1, position + 1);

      // if (e.key !== '*' && e.key !== ' ') {
      //   if (value[position - 2] === '*' && value[position - 3] === '*') {
      //     textarea.value = insertAtPosition(value, '**', position);
      //     textarea.setSelectionRange(position, position);
      //   } else if (value[position - 2] === '*' && value[position - 3] !== ' ') {
      //     textarea.value = insertAtPosition(value, '*', position);
      //     textarea.setSelectionRange(position, position);
      //   }
      // }
    }
  });

  // TODO complete task
  // textarea.addEventListener('click', (e) => {
  //   console.log(textarea.selectionStart);
  // });
}

function removeAtPosition(text, position) {
  return text.slice(0, position) + text.slice(position + 1);
}

function insertAtPosition(text, insert, position) {
  return text.slice(0, position) + insert + text.slice(position);
}

function getLine(text, position) {
  let line = '';
  for (let i = position; i--; i >= 0) {
    if (text[i] === '\n') {
      break;
    }
    line = text[i] + line;
  }
  return line;
}

function returnMatch(text, regexp) {
  const match = text.match(regexp);
  if (!match) {
    return '';
  }
  return match[0];
}

function getListItem(text) {
  return (
    returnMatch(text, /^[ ]*\* /) ||
    returnMatch(text, /^[ ]*- \[(x| )\] /).replace('x', ' ') ||
    returnMatch(text, /^[ ]*- /)
  );
}

function getSpace(text) {
  return returnMatch(text, /^[ ]+/);
}
