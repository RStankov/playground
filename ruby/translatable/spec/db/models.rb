class Post < ActiveRecord::Base
  acts_as_translatable # fields: title / text
end

class ActsAsTranslatableTestClass < ActiveRecord::Base
  acts_as_translatable
end