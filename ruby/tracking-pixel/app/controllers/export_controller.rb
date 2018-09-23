require 'csv'

class ExportController < ApplicationController
  before_action :authenticate

  def index
    @events = Event.all

    respond_to do |format|
      format.csv { send_data build_csv(@events), filename: "events-#{ Time.zone.today }.csv" }
      format.json { render json: @events }
      format.html { render json: @events }
    end
  end

  private

  def build_csv(events)
    CSV.generate(headers: true) do |csv|
      csv << Event.columns.map(&:name)
      events.reduce(csv) do |acc, event|
        acc << event.attributes
      end
    end
  end

  def authenticate
    authenticate_or_request_with_http_basic('Administration') do |username, password|
      if ENV['AUTH_USER'] || ENV['AUTH_PASSWORD']
        username == ENV['AUTH_USER'] && password == ENV['AUTH_PASSWORD']
      else
        username == 'admin' && password == 'password'
      end
    end
  end
end
