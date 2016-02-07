//
//  AppStore.swift
//  TestPtoject
//
//  Created by Radoslav Stankov on 12/23/15.
//  Copyright © 2015 Radoslav Stankov. All rights reserved.
//

import Foundation

protocol StorableCurrentUser : Storable {}

extension StorableCurrentUser {
    static func storeKeyForObject(object: Self) -> String {
        return "CurrentUser"
    }

    static func storeKeyForId(id: Int) -> String {
        return "CurrentUser"
    }
}

enum AppStoreAction {
    case Set([AnyObject])
    case Upvote(Post)
    case Downvote(Post)
}

class AppStore : Store<AppStoreAction> {
    override func reduce(entries: StoreEntities, action: AppStoreAction) -> StoreEntities {
        switch(action) {
        case .Set(let objects):
            entries.set(objects)
            break

        case .Upvote(let post):
            entries.set(Post(id: post.id, name: post.name, votes: post.votes + 1, isVoted: true))
            break

        case .Downvote(let post):
            entries.set(Post(id: post.id, name: post.name, votes: post.votes - 1, isVoted: false))
            break
        }

        return entries
    }
}