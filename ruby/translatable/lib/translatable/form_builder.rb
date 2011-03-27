module ActionView
  module Helpers 
    class FormBuilder
      def fields_for_translations(locales = I18n.available_locales)
        fields_for :translation_attributes do |translations|
          locales.each do |locale|
            translations.fields_for locale, object.translation(locale) do |translation|
              yield(translation, locale)
            end
          end
        end
      end
    end
  end
end