test('test helper - cursor', {
  before: '1|23',
  after: '1|23',
});

test('test helper - selection', {
  before: '1|2|3',
  after: '1|2|3',
});

test('insert char - cursor', {
  before: '|',
  action: { event: 'keypress', key: 'a' },
  after: 'a|',
});

test('insert char - selection', {
  before: 'before|middle|after',
  action: { event: 'keypress', key: 'a' },
  after: 'beforea|after',
});
