require File.dirname(__FILE__) + '/../spec_helper'

class CreateProxyTestClass < ActiveRecord::Base
end

ControlDepo::Translatable::ActiveRecord.create_proxy(CreateProxyTestClass)

describe CreateProxyTestClassTranslation, "the class created by create_proxy" do
# TODO check why should-a don't work here
#  it { should belong_to(:create_proxy_test_class) }

  it "should be ActiveRecord::Base class" do
    CreateProxyTestClassTranslation.superclass.should == ActiveRecord::Base
  end
end
