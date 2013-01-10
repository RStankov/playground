def score
  answers.inject(0) do |result, answer|
    result + answer.score
  end
end
