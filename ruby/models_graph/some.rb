# http://sigmajs.org/
# http://www.yasiv.com/npm#view/browserify
# https://github.com/preston/railroady

def associations_for_model(model)
  associations = {}
  model.reflect_on_all_associations.map do |association|
    next if association.options[:polymorphic]

    associations[association.macro] ||= []
    associations[association.macro] << association.klass.name
  end
  associations
end

links = {}
ActiveRecord::Base.subclasses.each do |model|
  links[model.name] = associations_for_model(model)
end
