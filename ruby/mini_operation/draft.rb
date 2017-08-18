module MiniOperation
  extend self

  def included()
    # steps
  end

  def register(name, operation)
    define_method :name do |*args|
      @operations << Operation.new(*args)
    end
  end

  register :check, CheckOperation
  register :step StepOperation
  register :pass, PassOperation

  def self.call(*args)
    new.call(*args)
  end

  def call(*args)
    @operations.reduce(Result.new(args)) do |result, operation|
      result = operation.perform(result, context: self)
      return result if result.error?
      result
    end
    # TODO(rstankov): handle error
  end

  def error

  end
end

class BaseOperation

  def initialize

  end

  def perform(result, context:)

  end
end

class Result

end

class Error

end

module SomeOperation
  include MiniOperation.build do
    check
    step
    pass
  end
end

module Operation
  include MiniOperation
end
