function setup(textarea) {
  textarea.addEventListener('keyup', (e) => {
    const position = textarea.selectionStart;
    const value = textarea.value;

    console.log(e.key);

    if (e.key === 'Enter') {
      const line = getLine(value, position - 1);
      const space = getListItem(line) || getSpace(line);

      textarea.value = insertAtPosition(value, space, position);
      textarea.setSelectionRange(
        position + space.length,
        position + space.length,
      );
    } else if (e.key.length === 1) {
      if (e.key !== '*' && e.key !== ' ') {
        if (value[position - 2] === '*' && value[position - 3] === '*') {
          textarea.value = insertAtPosition(value, '**', position);
          textarea.setSelectionRange(position, position);
        } else if (value[position - 2] === '*' && value[position - 3] !== ' ') {
          textarea.value = insertAtPosition(value, '*', position);
          textarea.setSelectionRange(position, position);
        }
      }
    } else if (e.key === 'Backspace') {
      // NOTE(rstankov): TODO
      if (
        value[position - 2] !== '*' &&
        value[position - 1] === '*' &&
        value[position] === '*' &&
        value[position + 1] === '*'
      ) {
        textarea.value = removeAtPosition(value, position + 1);
        textarea.setSelectionRange(position, position);
      }

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
