ActiveRecord::Schema.define(:version => 0) do
  create_table "acts_as_translatable_test_classes", :force => true do |t|
  end
  
  create_table "acts_as_translatable_test_class_translations", :force => true do |t|
    t.integer "acts_as_translatable_test_class_id"
    t.string  "locale"
    t.string  "name"
    t.string  "age"
  end
  
  create_table "posts", :force => true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end
  
  create_table "post_translations", :force => true do |t|
    t.integer "post_id"
    t.string  "locale"
    t.string  "title"
    t.string  "text"
  end

end