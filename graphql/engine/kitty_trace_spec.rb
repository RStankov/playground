# frozen_string_literal: true

describe KittyTrace do
  def execute_query(query)
    trace_key = nil
    trace = nil

    allow(KittyTrace::Storage).to receive(:write) do |key, value|
      trace_key = key
      trace = value
    end

    result = StacksSchema.execute(query, variables: {}, context: {})

    OpenStruct.new(
      data: result.to_h['data'],
      trace_key: trace_key,
      trace: trace,
    )
  end

  describe 'tracing' do
    let(:product) { create :profile, slug: 'rstankov' }

    it 'doesnt interfere with proper query result' do
      result = execute_query <<-GRAPHQL
      query {
        profile(slug:"#{product.slug}") {
          id
        }
      }
      GRAPHQL

      expect(result.data).to eq(
        'profile' => {
          'id' => product.id.to_s,
        },
      )
    end

    it 'is saved into file with proper name' do
      result = execute_query <<-GRAPHQL
      query QueryName {
        profile(slug:"#{product.slug}") {
          id
        }
      }
      GRAPHQL

      expect(result.trace_key).to match(/^[\d]+_QueryName_[\w]+$/)
    end

    it 'include general query information' do
      result = execute_query <<-GRAPHQL
      query {
        profile(slug:"#{product.slug}") {
          id
        }
      }
      GRAPHQL

      trace = result.trace

      expect(trace).to include(
        'version' => 1,
        'startTime' => match(/^[\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2}\.[\w]+$/),
        'endTime' => match(/^[\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2}\.[\w]+$/),
        'duration' => be_kind_of(Integer),
        'execution' => {
          'resolvers' => be_kind_of(Array),
        },
      )
    end

    it 'includes detailed information about each resulver' do
      result = execute_query <<-GRAPHQL
      query {
        profile(slug:"#{product.slug}") {
          id
          name
        }
      }
      GRAPHQL

      trace = result.trace

      expect(trace).to include(
        'version' => 1,
        'startTime' => match(/^[\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2}\.[\w]+$/),
        'endTime' => match(/^[\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2}\.[\w]+$/),
        'duration' => be_kind_of(Integer),
        'execution' => {
          'resolvers' => be_kind_of(Array),
        },
      )

      expect(trace['execution']['resolvers'].size).to eq 3

      expect(trace['execution']['resolvers'][0]).to include(
        'path' => ['profile'],
        'parentType' => 'Query',
        'fieldName' => 'profile',
        'returnType' => 'Profile',
        'startOffset' => be_kind_of(Integer),
        'duration' => be_kind_of(Integer),
        'io' => [{
          sql: "SELECT \"profiles\".* FROM \"profiles\" WHERE \"profiles\".\"trashed_at\" IS NULL AND \"profiles\".\"slug\" = 'rstankov' LIMIT 1 /*application:Stacks,extra:profile*/", # rubocop:disable Metrics/LineLength
          duration: be_kind_of(Integer),
          name: 'Profile Load',
          line: nil,
          filename: nil,
          method: nil,
        }],
      )

      expect(trace['execution']['resolvers'][1]).to include(
        'path' => %w(profile id),
        'parentType' => 'Profile',
        'fieldName' => 'id',
        'returnType' => 'String!',
        'startOffset' => be_kind_of(Integer),
        'duration' => be_kind_of(Integer),
        'io' => [],
      )

      expect(trace['execution']['resolvers'][2]).to include(
        'path' => %w(profile name),
        'parentType' => 'Profile',
        'fieldName' => 'name',
        'returnType' => 'String!',
        'startOffset' => be_kind_of(Integer),
        'duration' => be_kind_of(Integer),
        'io' => [],
      )
    end
  end
end
