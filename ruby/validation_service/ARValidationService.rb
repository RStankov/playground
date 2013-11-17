# Valdy


class Transfer < ActiveRecord::Base
  validate_with TransferProducerValidation
end


class StandingOrder < ActiveRecord::Base
  validate_with TransferProducerValidation
end


class TransferProducerValidation
  include ARValidationService::Validator

  validates :receiver_account, presence: true
end


validation = TransferProducerValidation.new(model, model.errors) #errors = ActiveModel::Errors.new)
validation.valid? #= true / false
validation.invalid?

validation.errors

TransferProducerValidation.validate(self, errors) #= true, false | errors = ActiveModel::Errors.new



@model.extend(ARValidationService::Rules)

@model.add_validation_rule ValidationRule::USA

@model.valid?


module ARValidationService::Rules
  def self.include(base)
    base.validate :_apply_validation_rules
  end

  def add_validation_rule(rule)
    @_validation_rules ||= []
    @_validation_rules << rule
  end

  private

  def _apply_validation_rules
    @_validation_rules && @_validation_rules.each { |rule| rule.validate(self, errors) }
  end
end
