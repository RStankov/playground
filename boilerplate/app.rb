require 'bundler'

Bundler.require

ROOT_PATH = File.dirname(__FILE__)

require 'lib/slim_template'
require 'lib/asset_pipeline'

Sass::Engine::DEFAULT_OPTIONS[:load_paths].tap do |load_paths|
  load_paths << "#{ROOT_PATH}/assets/stylesheets"
  load_paths << "#{Gem.loaded_specs['compass'].full_gem_path}/frameworks/compass/stylesheets"
end

builder = Rack::Builder.new do
  use Rack::CommonLogger

  map('/assets') { run AssetPipeline.new(ROOT_PATH) }
  map('/')       { run SlimTemplate.new(ROOT_PATH)  }
end

Rack::Handler::Mongrel.run builder, :Port => 3000

