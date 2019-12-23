# frozen_string_literal: true

require 'csv'
require 'ostruct'
require 'prettyprint'

users = {}
CSV.foreach('data.csv', headers: true) do |row|
  users[row['id'].to_i] = row['friend_ids'].gsub('{', '').gsub('}', '').split(',').map(&:to_i)
end

USERS = users
MIN = 3

def make_cluster(pair)
   pair[1]
    .map { |id| [id, pair[1].select { |i| USERS[id] && USERS[id].include?(i) }] }
    .reduce([]) do |acc, a|
      acc << [pair[0], *a].flatten
      acc += make_cluster(a)
      acc
    end.select { |a| a.size >= MIN }.uniq
end

clusters = users.to_a.reduce([]) do |acc, pair|
  acc += make_cluster(pair)
  acc
end.uniq.sort_by { |c| c.size }.reverse

pp clusters
pp clusters.size

CSV.open("clusters.csv", "wb") do |csv|
  csv << clusters[0].size.times.map { |i| "Profile #{i+1}"  }
  clusters.each do |cluster|
    csv << cluster.map(&:id)
  end
end
