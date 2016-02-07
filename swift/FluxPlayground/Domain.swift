//
//  Domain.swift
//  TestPtoject
//
//  Created by Radoslav Stankov on 12/18/15.
//  Copyright © 2015 Radoslav Stankov. All rights reserved.
//

import Foundation

public class Post : Equatable {
    let id:Int
    let name:String
    let votes:Int
    let headline:String
    let imageURL:NSURL?
    let isVoted:Bool

    init(id:Int, name:String, votes:Int, imageURL:NSURL? = nil, isVoted:Bool = false) {
        self.id = id
        self.name = name
        self.votes = votes
        self.headline = "\(name) headline so cool"
        self.imageURL = imageURL
        self.isVoted = isVoted
    }

    init() {
        self.id = 0
        self.name = "Empty"
        self.votes = 0
        self.headline = "Empty"
        self.imageURL = nil
        self.isVoted = false
    }
}

public func ==(lhs: Post, rhs: Post) -> Bool {
    return lhs.id == rhs.id && lhs.name == rhs.name && lhs.votes == rhs.votes
}


protocol UserInteractions {
    func hasVotedFor(post:Post) -> Bool
}

public class AnonymousUser : UserInteractions {
    var id:Int {
        get {
            return 0
        }
    }

    func hasVotedFor(post:Post) -> Bool {
        return false
    }
}

public class LoggedUser : UserInteractions {
    private var votedPostIds = [Int]()

    var id:Int {
        get {
            return 0
        }
    }

    func upvote(post:Post) {
        if votedPostIds.indexOf(post.id) == nil {
            votedPostIds.append(post.id)
        }
    }

    func downvote(post:Post) {
        if let index = votedPostIds.indexOf(post.id) {
            votedPostIds.removeAtIndex(index)
        }
    }

    func hasVotedFor(post:Post) -> Bool {
        return votedPostIds.indexOf(post.id) == nil
    }
}

extension Post : StorableWithId {}

extension AnonymousUser : StorableCurrentUser {}
extension LoggedUser : StorableCurrentUser {}

public class Api {
    private let user = LoggedUser()

    private let posts = [
        Post(id: 1, name: "Post 1", votes: 1),
        Post(id: 2, name: "Post 2", votes: 2),
        Post(id: 3, name: "Post 3", votes: 3),
        Post(id: 4, name: "Post 4", votes: 4),
        Post(id: 5, name: "Post 5", votes: 5),
        Post(id: 6, name: "Post 6", votes: 6),
        Post(id: 7, name: "Post 7", votes: 7),
        Post(id: 8, name: "Post 8", votes: 8),
        Post(id: 9, name: "Post 9", votes: 9),
    ]

    public func getPostWithId(id: Int, handler:(Post?) -> Void) {
        for post in posts {
            if (post.id == id) {
                handler(post)
                return
            }
        }
        handler(nil)
    }

    public func getPosts(handler:([Post]) -> Void) {
        handler(posts)
    }

    public func voteForPost(post:Post) {}
    public func downVoteForPost(post:Post) {}

    public func getCurrentUser(handler:(LoggedUser?) -> Void) {
        handler(self.user)
    }
}