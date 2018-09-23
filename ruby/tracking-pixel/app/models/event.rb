class Event < ApplicationRecord
  def self.track(request:, params:)
    browser = Browser.new(request.user_agent)

    create(
      source: params[:source],
      ip: request.ip,
      user_agent: request.user_agent,
      platform: browser.platform.id,
      device: browser.device.id,
      browser: browser.id,
    )
  end
end
