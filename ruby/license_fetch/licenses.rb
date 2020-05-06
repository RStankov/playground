require 'nokogiri'
require 'open-uri'
require 'csv'

def build(name, source_url, license_name, license_url = nil)
  {
    name: name,
    source_url: source_url,
    license_name: license_name,
    license_url: license_url,
  }

end

def fetch_cocoapods(url)
  doc = Nokogiri::HTML(open(url))

  link = doc.css('tr:contains("License")').last.css('td a').last

  name = doc.css('h1').first.text.split(' ').first
  source_url = doc.css('.github-link a').first['href']
  license_name = link.text
  license_url = link['href']

  build(name, source_url, license_name, license_url)
end

def fetch_rubygems(url)
  doc = Nokogiri::HTML(open(url))

  name = doc.css('.t-display.page__heading').first.text.split(' ').first
  source_url = (doc.css('#code').first || doc.css('#home').first)['href']
  license_name = doc.css('.gem__ruby-version p').first.text

  build(name, source_url, license_name)
end

def fetch_npm(url)
  doc = Nokogiri::HTML(open(url))

  name = doc.css('h2 span[title]').first.text
  source_url = doc.css('div:contains("Repository")').last ? doc.css('div:contains("Repository")').last.css('a').first['href'] : url
  license_name = doc.css('div:contains("License")').last.css('p').first.text

  build(name, source_url, license_name)
end

def fetch(url)
  if url.include?('cocoapods.org')
    fetch_cocoapods(url)
  elsif url.include?('rubygems.org')
    fetch_rubygems(url)
  elsif url.include?('npmjs.com')
    fetch_npm(url)
  else
    raise "Invlid URL - #{url}"
  end
end

def fetch_all(urls)
  urls.map do |url|
    begin
      p url
      fetch(url)
    rescue => e
      pp "> #{url}"
      pp e.message
      pp e.backtrace
      pp ''

      nil
    end
  end.compact
end

def read_urls_list
  text=File.read('list.txt')
  text.gsub!(/\r\n?/, "\n")
  text.each_line.map do |line|
    line.strip
  end
end

def save(list)
  CSV.open('licenses.csv', 'w') do |csv|
    csv << ['Name', 'License', 'Source Code (URL)', 'Add. License Provisions']
    list.each do |item|
      csv << [item[:name], item[:license_name], item[:source_url]]
    end
  end
end

save(fetch_all(read_urls_list))

print "✅  Done\n"

