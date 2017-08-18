module MiniOperation
  def self.included(base)
    base.extend ClassMethods
  end

  def error(*args)
    Error.new(*args)
  end

  module ClassMethods
    def step(name)
      # TODO(rstankov): make inhritable
      @operations ||= []
      @operations << StepOperation.new(name)
    end

    def pass(name)
      # TODO(rstankov): make inhritable
      @operations ||= []
      @operations << PassOperation.new(name)
    end

    def call(arg)
      instance = new
      # TODO(rstankov): Ensure `@operations` defined
      @operations.reduce(arg) do |acc, operation|
        result = operation.perform_with(instance, acc)
        return result if result.kind_of?(Error)
        result
      end
    end
  end

  # TODO(rstankov): what is the format?
  class Error
    def initialize(*args)
    end
  end

  class StepOperation
    attr_reader :method_name

    def initialize(method_name)
      @method_name = method_name
    end

    def perform_with(instance, input)
      instance.public_send(method_name, input)
    end
  end

  class PassOperation
    attr_reader :method_name

    def initialize(method_name)
      @method_name = method_name
    end

    def perform_with(instance, input)
      # TODO(rstankov): Handle error
      result = instance.public_send(method_name, input)
      if result.kind_of?(Error)
        result
      else
        input
      end
    end
  end
end
