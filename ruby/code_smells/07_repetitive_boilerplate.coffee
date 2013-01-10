class UserCardView extends Backbone.View
  initialize: ->
    @model.bind 'change:name',  @renderName,  this
    @model.bind 'change:email', @renderEmail, this

  remove: ->
    @model.unbind 'change:name',  @renderName,  this
    @model.unbind 'change:email', @renderEmail, this

    Backbone.View::remove.apply this, arguments

  renderName:  -> # code
  renderEmail: -> # code
