class SlimTemplate
  def initialize(root_path)
    @trail = Hike::Trail.new root_path
    @trail.append_path 'views'
  end

  def call(env)
    template = find_template(env['REQUEST_URI'])
    if template
      [200, {'Content-Type' => 'text/html'}, Tilt.new(template).render]
    else
      [404, {'Content-Type' => 'text/html'}, 'File not found']
    end
  end

  private

  def find_template(path)
    @trail.find "#{path == '/' ? 'index' : path}.slim"
  end
end