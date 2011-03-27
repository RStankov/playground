require File.dirname(__FILE__) + '/../spec_helper'

describe "create_accessors" do
  before :all do
    class CreateAccessorsTestClass
      attr_accessor :translation
    end
    
    class CreateAccessorsTranslationClass
      attr_accessor :name, :age
    end
    
    ControlDepo::Translatable::ActiveRecord.create_accessors(CreateAccessorsTestClass, [:name, :age])
  end
  
  before :each do
    @object = CreateAccessorsTestClass.new
    @object.translation = CreateAccessorsTranslationClass.new
  end
  
  it "should define getter methods, delegated to translation" do
    @object.translation.name = "radoslav"
    @object.translation.age  = 22
    
    @object.name.should == "radoslav"
    @object.age.should  == 22
  end
  
  it "should define setter methods, delegated to translation"  do
    @object.name = "radoslav"
    @object.age  = 22
    
    @object.translation.name.should == "radoslav"
    @object.translation.age.should  == 22
  end
end
