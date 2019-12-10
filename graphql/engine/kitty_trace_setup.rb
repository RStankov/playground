# In GraphQL::Schema
use KittyTrace if Rails.env.development? || Rails.env.test?

# Initializer
KittyTrace.subscribe

# Router
get '/admin/graphql-tracing' => 'kitty_trace/records#index'
get '/admin/graphql-tracing/:id' => 'kitty_trace/records#show'

