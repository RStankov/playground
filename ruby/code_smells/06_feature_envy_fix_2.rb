def score
  answers.map(&:score).sum
end
