#! /usr/bin/ruby

require "yaml"
require "spriter"

images = [
  ["images/headers/book_open.png",     32, 32],
  ["images/headers/cabinet.png",       32, 32],
  ["images/headers/clipboard.png",     32, 32],
  ["images/headers/copy.png",          32, 32],
  ["images/headers/dashboard.png",     32, 32],
  ["images/headers/edit.png",          32, 32],
  ["images/headers/entry_feed.png",    32, 32],
  ["images/headers/file.png",          32, 32],
  ["images/headers/user.png",          32, 32],
  ["images/headers/users.png",         32, 32],
  "images/headers/comments.png",
  "images/headers/comment_new.png",
  "images/icons/drag.png",
  "images/icons/drag_hover.png",
  "images/icons/search.png",
  "images/icons/search_hover.png",
  "images/icons/lock.png",
  "images/icons/lock_hover.png",
  "images/icons/unlock.png",
  "images/icons/unlock_hover.png",
]

options = YAML::load( open("spriter.yml") )

Spriter.generate options["sprite"], options["images"]


