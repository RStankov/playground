require 'spec_helper'
require 'mini_operation'

# TODO(rstankov):
#
# ## Code:
#
# - builder for operations
# - rename `pass` to `call`
# - new(args).call(input)
# - result class ?
# - custom steps
#
# ## Usecases:
#
# - have multiple errors
# - convert AR errors to normal errors
# - handle exceptions
# - trigger code on error or success (increase counter)
# - wrap all operations in single transaction
# - custom steps
#   - authorize
#   - form

describe MiniOperation do
  describe '.call' do
    describe '.step' do
      it 'performs in sequance by passing previous result' do
        klass = Class.new do
          include MiniOperation

          step :sum
          step :multiply

          def sum(one: 1, two: 2)
            one + two
          end

          def multiply(sum)
            sum * 2
          end
        end

        expect(klass.call(one: 1, two: 2)).to eq 6
      end

      it 'stops on error' do
        klass = Class.new do
          include MiniOperation

          step :return_an_error
          step :raise_error

          def return_an_error(_input)
            error :invalid_number
          end

          def raise_error(_input)
            raise "Shouldn't be exectuted"
          end
        end

        expect(klass.call(:input)).to be_instance_of described_class::Error
      end
    end

    describe '.pass' do
      it 'performs in sequance by passing initial input' do
        object = double

        allow(object).to receive(:first).and_return :first
        allow(object).to receive(:second).and_return :second
        allow(object).to receive(:third).and_return :third


        klass = Class.new do
          include MiniOperation

          pass :call_first_method
          pass :call_second_method
          step :call_third_method

          def call_first_method(input)
            input.first
          end

          def call_second_method(input)
            input.second
          end

          def call_third_method(input)
            input.third
          end
        end

        expect(klass.call(object)).to eq :third
        expect(object).to have_received :first
        expect(object).to have_received :second
        expect(object).to have_received :third
      end

      it 'stops on error' do
        klass = Class.new do
          include MiniOperation

          pass :return_an_error
          pass :raise_error

          def return_an_error(_input)
            error :invalid_number
          end

          def raise_error(_input)
            raise "Shouldn't be exectuted"
          end
        end

        expect(klass.call(:input)).to be_instance_of described_class::Error
      end
    end
  end
end
