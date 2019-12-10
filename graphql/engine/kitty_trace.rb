# frozen_string_literal: true

require 'graphql'

module KittyTrace
  extend self

  def use(schema_definition)
    schema_definition.instrument(:query, Tracer)
    schema_definition.instrument(:field, Tracer)
  end

  def time_diff(start_time, end_time)
    ((end_time.to_f - start_time.to_f) * 1e9).to_i
  end

  def subscribe # rubocop:disable Metrics/MethodLength
    ActiveSupport::Notifications.subscribe('sql.active_record') do |_name, start, ending, _transaction_id, payload|
      if payload[:name] != 'SCHEMA'
        KittyTrace::Current.record_io(
          sql: payload[:sql],
          duration: KittyTrace.time_diff(start, ending),
          name: payload[:name],
          line: payload[:line],
          filename: payload[:filename],
          method: payload[:method],
        )
      end
    end

    ActiveSupport::Notifications.subscribe('cache_read.active_support') do |_name, start, ending, _transaction_id, payload|
      KittyTrace::Current.record_io(
        cacheKey: payload[:key],
        cacheHit: payload[:hit],
        duration: KittyTrace.time_diff(start, ending),
        name: payload[:name],
        line: payload[:line],
        filename: payload[:filename],
        method: payload[:method],
      )
    end
  end
end

class KittyTrace::Current < ActiveSupport::CurrentAttributes
  attribute :io

  def record_io(recording)
    io << recording unless io.nil?
  end
end

# def log(message)
#   Rails.logger.info ActiveSupport::LogSubscriber.new.send(:color, "LOG: #{message}", :red)
# end

module KittyTrace::Tracer
  extend self

  KEY = :kitty_trace

  def before_query(query)
    query.context[KEY] = {
      'start_time' => Time.current,
      'resolvers' => [],
    }
  end

  def after_query(query)
    result = query.result
    return if result.nil? || result.to_h.nil?

    end_time = Time.current

    write_key = "#{end_time.to_i}_#{(query.operation_name || 'Query')}_#{SecureRandom.hex(4)}"
    trace = {
      'version' => 1,
      'startTime' => query.context[KEY]['start_time'].strftime('%FT%T.%3NZ'),
      'endTime' => end_time.strftime('%FT%T.%3NZ'),
      'duration' => KittyTrace.time_diff(query.context[KEY]['start_time'], end_time),
      'execution' => {
        'resolvers' => query.context[KEY]['resolvers'],
      },
    }

    KittyTrace::Storage.write(write_key, trace)
  end

  def instrument(type, field)
    old_resolve_proc = field.resolve_proc

    new_resolve_proc = lambda do |obj, args, context|
      io = []

      # NOTE(rstankov): Because of graphql-batch and promises don't reset this variable after sync resolve
      # Passing io by reference will record the io in the last Promise field
      KittyTrace::Current.io = io

      start_time = Time.current
      result = old_resolve_proc.call(obj, args, context)
      end_time = Time.current

      context[KEY]['resolvers'] << {
        'path' => context.path,
        'parentType' => type.name,
        'fieldName' => field.name,
        'returnType' => field.type.to_s,
        'startOffset' => KittyTrace.time_diff(context[KEY]['start_time'], start_time),
        'duration' => KittyTrace.time_diff(start_time, end_time),
        'io' => io,
      }

      result
    end

    field.redefine { resolve(new_resolve_proc) }
  end
end

module KittyTrace::Config
  extend self

  def file_limit
    20
  end
end

module KittyTrace
  module Storage
    extend self

    def write(key, value)
      FileUtils.mkdir_p dir_path
      json_file = dir_path.join("#{key}.json")
      File.open(json_file, 'wb') { |file| file.write(value.to_json) }
      maintain_limited_number_of_files(KittyTrace::Config.file_limit)
    end

    def files
      Dir["#{dir_path}/*.json"].map { |file_name| Record.new(file_name) }.sort_by(&:time).reverse
    end

    def read(key)
      key = File.basename(key, '.json')
      json_file = dir_path.join("#{key}.json")

      File.read(json_file)
    end

    private

    def maintain_limited_number_of_files(size)
      files = Dir["#{dir_path}/*.json"].sort_by { |f| -file_ctime(f) }
      (files[size..-1] || []).each do |file|
        FileUtils.rm_f(file)
      end
    end

    def file_ctime(file)
      File.stat(file).ctime.to_i
    rescue Errno::ENOENT
      0
    end

    def dir_path
      Rails.root.join('tmp', 'data', 'kitty_trace')
    end

    class Record
      attr_reader :id, :time, :operation_name

      def initialize(file_name)
        @id = File.basename(file_name, '.json')
        @time, @operation_name = id.split('_')
      end

      def as_json(_)
        {
          id: id,
          time: time,
          operationName: operation_name,
        }
      end
    end
  end
end

module KittyTrace
  class RecordsController < ActionController::API
    def index
      render json: KittyTrace::Storage.files
    end

    def show
      render json: KittyTrace::Storage.read(params[:id])
    rescue Errno::ENOENT
      render json: nil
    end
  end
end

