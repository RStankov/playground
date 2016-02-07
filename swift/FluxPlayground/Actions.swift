//
//  Actions.swift
//  TestPtoject
//
//  Created by Radoslav Stankov on 12/18/15.
//  Copyright © 2015 Radoslav Stankov. All rights reserved.
//

import UIKit

class VoteForPost : Action {
    private var post:Post

    init(_ post: Post) {
        self.post = post
    }

    func perform(dispatcher: Dispatcher) {
        if post.isVoted {
            dispatcher.store.handle(.Downvote(post))
            Api().downVoteForPost(post)
        } else {
            dispatcher.store.handle(.Upvote(post))
            Api().voteForPost(post)
        }
    }
}

/*
func openPost(post: Post)(dispatcher: Dispatcher) {

}
*/

class OpenPost : Action {
    private var post:Post

    init(_ post: Post) {
        self.post = post
    }

    func perform(dispatcher: Dispatcher) {
        let controller = PostDetailsViewController()
        controller.post = post

        dispatcher.run(OpenViewController(controller))
    }
}

class OpenViewController : Action {
    private var viewController:UIViewController

    init (_ viewController: UIViewController) {
        self.viewController = viewController
    }

    func perform(dispatcher: Dispatcher) {
        appDelegate().activeNavigationController.pushViewController(viewController, animated: true)
    }
}