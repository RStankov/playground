# BEFORE

class BlacklistEntry < ActiveRecord::Base
  scope :active, -> { where deactivated_at: nil }
  scope :deactivated -> { where.not deactivated_at: nil  }

  def deactivated?
    not deactivated_at.nil?
  end

  def active?
    deactivated_at.nil?
  end

  def deactivate!
    update_attributes! deactivated_at: Time.current
  end

  def activate
    update_attributes! deactivated_at: nil
  end
end

# AFTER

class BlacklistEntry < ActiveRecord::Base
  action_flag :deactivated, contra: :active, on: :deactivate, off: :activate
end

# DRAFT

module ActionFlag
  module ClassMethod
    # TODO cache module, name module for reference, default on/off
    def action_flag(name, contra: nil, on: nil, off: nil, attribute: "#{name}_at")
      include Module.new do
        define_method "#{name}?" do
          not public_send(attribute).nil?
        end

        if contra
          define_method "#{contra}?" do
            public_send(attribute).nil?
          end
        end

        if on
          define_method "#{on}!" do
            update_attributes! attribute => Time.current
          end
        end

        if off
          define_method "#{off}!" do
            update_attributes! attribute => nil
          end
        end
      end

      instance_eval do
        scope name.to_sym, -> { where.not attribute => nil }

        if contra
          scope contra.to_sym, -> { where attribute => nil }
        end
      end
    end
  end
end

