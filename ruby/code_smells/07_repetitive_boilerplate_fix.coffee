class UserCardView extends Backbone.View
  bindToModel:
    'change:name':  'render:name'
    'change:email': 'render:email'

  renderName:  -> # code
  renderEmail: -> # code
