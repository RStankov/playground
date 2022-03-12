function test(description, { before, action, after }) {
  // 1.Setup

  // 1.1. Create test element

  const testElement = document.createElement('textarea');
  document.body.appendChild(testElement);

  // 1.2 Set its initial content

  const selectionStart = before.indexOf('|');
  const selectionEnd = before.lastIndexOf('|');

  testElement.value = before.replace(/\|/g, '');
  testElement.setSelectionRange(
    selectionStart - 1,
    selectionStart === selectionEnd ? selectionStart - 1 : selectionEnd - 2,
  );

  // 1.3 Attach markdown textarea to it

  markdownTextarea(testElement);

  // 2. Perform Action

  if (action) {
    const event = new KeyboardEvent(action.event, { key: action.key });
    testElement.dispatchEvent(event);
  }

  // 3. Verify result

  const result =
    testElement.selectionStart === testElement.selectionEnd
      ? testElement.value.slice(0, testElement.selectionStart + 1) +
        '|' +
        testElement.value.slice(testElement.selectionStart + 1)
      : testElement.value.slice(0, testElement.selectionStart + 1) +
        '|' +
        testElement.value.slice(
          testElement.selectionStart + 1,
          testElement.selectionEnd + 1,
        ) +
        '|' +
        testElement.value.slice(testElement.selectionEnd + 1);

  if (after === result) {
    console.log(`PASS: ${description}`);
  } else {
    console.error(`FAIL: ${description}`, {
      got: result,
      expected: after,
    });
  }

  // 4. Teardown
  testElement.parentNode.removeChild(testElement);
}

function xtest() {
  // ignore this case for now
}
