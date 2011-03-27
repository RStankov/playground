require File.dirname(__FILE__) + '/../spec_helper'

describe "acts_as_translatable" do  
  it "should translation class" do
    Object.const_defined?(:ActsAsTranslatableTestClassTranslation).should be_true
  end
  
  describe ActsAsTranslatableTestClass do
    it { have_many :translations }
    
    it "should include ControlDepo::Translatable::InstanceMethods" do
      ActsAsTranslatableTestClass.include?(ControlDepo::Translatable::ActiveRecord::InstanceMethods).should be_true
    end
    
    describe "accesstor methods" do
      before do
        @object = ActsAsTranslatableTestClass.new

        def @object.translation
          @translation ||= ActsAsTranslatableTestClassTranslation.new
        end
      end

      it "should be as translation class attributes" do
        @object.respond_to?(:name).should be_true
        @object.respond_to?(:age).should be_true
      end

      it "should be getters for translation object" do
        @object.translation.name = "name"
        @object.translation.age  = 124

        @object.name.should == "name"
        @object.age.should  == 124
      end

      it "should be getters for translation object" do
        @object.name = "some name"
        @object.age  = 32

        @object.translation.name.should == "some name"
        @object.translation.age.should  == 32
      end
    end
  end
end