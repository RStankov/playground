module ActiveRecord
  class Migration
    def self.create_translations_table(table_name)
      table_name = table_name.to_s.singularize
      create_table("#{table_name}_translations") do |t|
        t.integer table_name.foreign_key
        t.string  :locale
        yield(t)
      end
    end
  end
end