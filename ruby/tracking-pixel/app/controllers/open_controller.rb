class OpenController < ApplicationController
  def index
    event = Event.track(request: request, params: params)

    pixel = Rails.root.join('app', 'assets', 'images', 'pixel.png')

    render plain: open(pixel, &:read), content_type: 'image/png'
  end
end
