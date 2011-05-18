describe("action handler", function() {
  beforeEach(function() {
    loadFixtures('basic.html');

    this.triggerActionHandledWith = function(actionHandler) {
      var element = $('.target').onAction('click', 'test', actionHandler);

      this.eventData = {'custom': 'data'};
      this.eventObject = jQuery.Event('click', this.eventData);
      this.eventTarget = element.find('[data-action="test"]')[0];

      $(this.eventTarget).trigger(this.eventObject, this.eventData);
    };
  });

  it("binds the handler to element from which the event was fired", function() {
    var binding;

    this.triggerActionHandledWith(function() { binding = this; });

    expect(binding).toEqual(this.eventTarget);
  });

  it("passes the jQuery wrapped element to the handler as 1st argument", function() {
    var firstArgument;

    this.triggerActionHandledWith(function() { firstArgument = arguments[0]; });

    expect(firstArgument).toEqual($(this.eventTarget));
  });

  it("passes the event object to the handler as 2nd argument", function() {
    var secondArgument;

    this.triggerActionHandledWith(function() { secondArgument = arguments[1]; });

    expect(secondArgument).toEqual(this.eventObject);
  });

  it("passes the event data to the handler as 3rd argument", function() {
    var thirdArgument;

    this.triggerActionHandledWith(function() { thirdArgument = arguments[2]; });

    expect(thirdArgument).toEqual(this.eventData);
  });
});