Rails.application.routes.draw do
  get '/export', to: 'export#index'
  get '/open', to: 'open#index'

  root to: 'root#index'
end
