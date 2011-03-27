require "rubygems"

# rails stack
require "active_support"
require "active_record"
require "action_controller"
require "action_view"

# rspec and shoulda
require "spec"
require "shoulda/rspec"

# plugin itself
require "init"

# setup active record and the test models
ActiveRecord::Base.establish_connection(
  :adapter  => "sqlite3",
  :database => File.join(File.dirname(__FILE__), "db", "spec.sqlite3.db")
)  

require "db/schema"
require "db/models"
