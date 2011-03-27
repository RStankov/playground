module ControlDepo
  module Translatable
    module ActiveRecord
      class << self
        def create_proxy(model)
         Object.const_set "#{model.name}Translation", Class.new(::ActiveRecord::Base) do
            belongs_to "#{model.name.underscore}".to_sym

#           validate :valid_locale
#           protected 
#             def valid_locale
#               errors.add("----") unless 
#             end
          end
        end

        def create_accessors(model, attributes)
          attributes.each do |attribute|
            model.send :define_method, attribute do
              translation.send :"#{attribute}"
            end
            model.send :define_method, "#{attribute}=" do |value|
              translation.send :"#{attribute}=", value
            end
          end
        end
      end
      
      module InstanceMethods
        def translation(locale = I18n.locale)
          @translation_attributes ||= {}
          @translation_attributes[locale.to_sym] ||= translations.find_or_initialize_by_locale(locale.to_s)
        end
      
        def translation_attributes=(translations)
          translations.each do |(locale, attributes)|
            translation(locale).attributes = attributes
          end
        end
      
        protected
          def save_translations          
            if @translation_attributes
              @translation_attributes.each do |(locale, translation)|
                translation.write_attribute(self.class.to_s.foreign_key, id)
                translation.save
              end
            end
          end
      end
    end
  end
end

class ActiveRecord::Base
  def self.acts_as_translatable
    include ControlDepo::Translatable::ActiveRecord::InstanceMethods
    proxy = ControlDepo::Translatable::ActiveRecord::create_proxy(self)
    
    has_many :translations, :class_name => proxy.name, :dependent => :destroy
    
    after_save :save_translations
      
    columns = proxy.columns.collect(&:name)

    ControlDepo::Translatable::ActiveRecord.create_accessors(self, columns.slice(3, columns.size));
  end
end