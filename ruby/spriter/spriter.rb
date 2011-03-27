require "rubygems"
require "paperclip"

module Spriter
  def self.generate(sprite_file_name, images_list)
    spriter = Generator.new(sprite_file_name)
    
    images_list.each do |image|
      spriter << image
    end
    
    spriter.run
  end
  
  class Generator
    attr_reader :file_name

    def initialize(file_name)
      @file_name = file_name
      @images    = []
    end

    def << image_file      
      @images << (image_file.is_a?(Array) ? Image.new(*image_file) : Image.new(image_file))
    end
    
    def run      
      File.unlink(file_name) if File.exists? file_name
      
      system "convert -size #{width}x#{height} xc:none #{file_name}"
      
      top = 0
      @images.each do |image|
        system %[convert #{file_name} -draw "image over 0,#{top} #{image}" #{file_name}]
        top += image.height
      end
    end
    
    private    
      def width
        @width ||= @images.max { |a,b| a.width <=> a.width }.width
      end
      
      def height
        @height ||= @images.inject(0) { |s, i| s += i.height }
      end
  end
  
  class Image
    attr_reader :file_name, :width, :height
    
    def initialize(file_name, width = nil, height = nil)
      geomery = Paperclip::Geometry.from_file(file_name)
      
      @file_name  = file_name      
      @width      = width  || geomery.width
      @height     = height || geomery.height
    end
    
    def to_s
      "#{width},#{height} '#{file_name}'"
    end
  end
end