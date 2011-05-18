describe("event handling", function() {
  it("delegates actions", function() {
    loadFixtures('event_delegation.html');

    var root = $('#root'),
        wasViewClicked = false,
        wasEditHovered = false;

    root.onAction('click', 'view', function() { wasViewClicked = true; });
    root.onAction('mouseover', 'edit', function() { wasEditHovered = true; });

    root.find('[data-action="view"]').click();
    root.find('[data-action="edit"]').mouseover();

    expect(wasViewClicked).toBeTruthy();
    expect(wasEditHovered).toBeTruthy();
  });

  it("can recive custom events", function() {
    loadFixtures('event_delegation.html');

    var root = $('#root'),
        wasCustomEventFired = false;

    root.dataAction('notify', 'custom:event', 'div', function() { wasCustomEventFired = true; });

    root.find('li').trigger('custom:event');

    expect(wasCustomEventFired).toBeTruthy();
  });

  it("works for multiple elements", function(){
    loadFixtures('multiple_elements.html');

    var elements = $('.target');

    elements.onAction('click', 'notify', function(element) {
      element.closest('.target').data('wasNotified', true);
    });

    $('li').last().trigger('click');

    expect(elements.first()).not.toHaveData('wasNotified', true);
    expect(elements.last()).toHaveData('wasNotified', true);
  });
});