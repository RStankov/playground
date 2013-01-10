def login_reason_for(reason, subject)
  case reason
    when 'vote'    then "Vote for #{subject.name}"
    when 'comment' then "Comment #{subject.name}"
    when 'visit'   then "Visit page"
    when 'follow'  then "Follow user #{subject.name}"
    else ''
  end
end
