describe('data', function() {
  beforeEach(function() {
    this.element = $(document);
    this.dataActions = function() { return this.element.data('delegates'); };
  });

  afterEach(function() { this.element.removeData().unbind(); });

  it("sets proper data attributes", function() {
    function addFunc() { alert('added'); }
    function delFunc() { alert('deleted'); }
    function anyFunc() { alert('anyFunc'); }

    this.element.dataAction('action', 'click', 'add', addFunc);
    this.element.dataAction('action', 'click', 'del', delFunc);
    this.element.dataAction('action', 'custom:event', 'any', anyFunc);
    this.element.dataAction('other', 'click', 'any', anyFunc);

    expect(this.dataActions()).toEqual({
      action: {
        click: {
          add: addFunc,
          del: delFunc
        },
        'custom:event': {
          any: anyFunc
        }
      },
      other: {
        click: {
          any: anyFunc
        }
      }
    });
  });

  it("accepts an object with options", function() {
    var actions = {
      add: function() {},
      del: function() {},
      save: function() {}
    };

    this.element.dataAction('action', 'click', actions);

    expect(this.dataActions()['action']['click']).toEqual(actions);
  });

  it("is chainable", function() {
    var result = this.element.dataAction('action', 'click', 'add', function() {});

    expect(result).toEqual(this.element);
  });
});
