class AssetPipeline < Sprockets::Environment
  def initialize(root_path)
    super(root_path)

    self.cache = false
    self.append_path 'assets/javascripts'
    self.append_path 'assets/stylesheets'
    self.append_path 'assets/images'
    self.append_path "#{Gem.loaded_specs['compass'].full_gem_path}/frameworks/compass/stylesheets"
  end
end
