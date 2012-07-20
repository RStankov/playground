require "bundler"
Bundler.setup

require "rspec"
require File.join(File.dirname(__FILE__), '..', 'lib', 'game_of_life')
require "support/matchers"

RSpec.configure do |config|
  config.include SpecMatchers
end
